import User from '../models/user';
import jwt from 'jsonwebtoken';
import auth from '../../config/auth';
import * as Yup from 'yup';

class SessionCrontoller {
    async store(req,res){
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        });
        //validando o schema
        if(!(await schema.isValid(req.body))){
            res.status(400).json({ error: 'Validation falid'})
        };

        const {email, password} = req.body;

        const user = await User.findOne({ where: {email}});

        if(!user){
            return res.status(401).json({ error: 'User not found'})
        };

        if(!(await user.checkPassword(password))){
            return res.json(401).json({ error: 'Password does match'})
        };

        const {id, name} = user;

     return res.json({
         user: {
             id,
             name,
             email,
         },
         token: jwt.sign({id}, auth.secret,{
             expiresIn: auth.expireIn, //tempo para expirar 
         }),
     });
          
    
    }
}

export default new SessionCrontoller();