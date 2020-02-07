import * as Yup from 'yup';
import User from '../models/user'

class UserController{
    async store(req,res){
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        });
        //validando o schema
        if(!(await schema.isValid(req.body))){
            res.status(400).json({ error: 'Validation falid'})
        }

        //procurando no banco de dados se o usuario já existe
        const userExist = await User.findOne({where: 
            { email:req.body.email }
        })

        if(userExist){
            return res.status(400).json({ erro: "User already exists."});
        }

        // criando um usuario
        const {id, name, email, provider} = await User.create(req.body);

        return res.json({
            id,
            name,
            email, 
            provider,
        });
    }

    //edição de usuario
    async update(req,res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6), //se ele informar o old tem q ser obrigado a informar a nova
            password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
                oldPassword ? field.required() : field 
            ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref(password)]) : field
            ),
        });

        const {email,oldPassword} = req.body;
        
        //procurando o usuario pela primary key
        const user = await User.findByPk(req.userId);

        if(email != user.email){ //se o email que ele esta tentando alterar for diferente do email que ele ja tem 
            const userExist = await User.findOne({where: 
                { email }
            });
    
            if(userExist){
                return res.status(400).json({ erro: "User already exists."});
            };
        };
        
        //validando a antiga senha para saber se o usuario tem permissão para alteração
        if(oldPassword && !(await user.checkPassword(oldPassword))){
            return res.status(401).json({error: 'Password does not match'})
        }

        const {id, name, provider} = await user.update(req.body)

        
        return res.json({
            id,
            name,
            email, 
            provider,
        });
    }
}

export default new UserController();