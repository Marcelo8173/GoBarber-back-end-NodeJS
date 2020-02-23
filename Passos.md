*** configurando ***

- yarn init -y -> cria o package.json
- yarn add express

*** Cria a pasta src ***
- arquivos => route.js, server.js, app.js

*** App.js ***
- app.js -> importação do express
    usando a ideia de classes 

    class App {
        constructor(){
            this.server = express();  //criando uma instancia do express - semelhante de como era feito antes

        middlewares()

        routes()

        }

        middlewares(){
            this.serve.use(express.json())
        }

        routes(){
            this.server.use(routes)
        }
    }

*** Server.js ***
- server.js -> é onde é inicializado o nosso servidor
    
    
    const app = require('./app');
    app.listen(3333);
    
*** routes.js ***    
- routes.js ->onde será criado as rotas da aplicação

const {Router} = require('express') -> importando apenas o Router do express

const route = new Router();

module.export = route;


- é criado assim para se usar quando se for fazer os testes unitarios

*** Add sucrase e nodemon ***

- o sucrase permite que seja usado a nova sintaxe do JS como o import que não é suportado pelo node

yarn add sucrase nodemon -D
para rodar -> yarn sucrase-node src/server.js

- para automatizer o nodemon é necessario criar um nodemon.json para configurar

*** eslint ***
- para padronização de codigo

- yarn add eslint -D
- yarn eslint --init
- yarn

*** configurando o sequalize ***

1. dentro da pasta src - criamos a pasta config e um arquivo database.js
2. criamos uma pasta database e dentro dela outra pasta chamada migrations
3. pasta app - vai gerenciar todas as regras de negocio e criamos a pasta controller e models

- yarn add sequelize
- yarn add sequelize-cli -D

4. crio um arquivo .sequelizerc e configuro o texto para javaScript - esse arquivo que vai conter as rotas do sequelize

- depois de alterar o arquio sequelize e database.js
yarn add pg pg-hstore

*** adicionando um migration *** 

- yarn sequelize migration:create --name=create-user (ou qualquer nome);
- yarn sequelize db:migrate -> roda a migration e cria, altera ou deleta uma tabela
- yarn sequelize db:migrate:undo ou :undo:all -> para desfazer as migration


*** criando os models ***

- o models usuer -> é o model onde vamos alterar e cadastrar as informações dos usuarios
- eu importo Sequelize e model de sequelize

import Sequelize, {Model} from 'sequelize';

class User extend Model {
    static init (sequelize){
        super.init({
            //dados
        },
        {
            sequelize,
        })
    }
}

*** criando um arquivo que realiza a conexão com o banco de dados ***

1. é criado um arquivo de models
    ex: models user.js
2. dentro desse arquivo eu importo o model e o sequelize de dentro do sequelize
3. crio uma classe user e defino um metodo static chamado init e um super init
4. eu passo pra eles os atributos que vão ser definidos pelo usuario, como nome e email
5. e dentro do super init eu passo o segundo parametro sequelize que é o mesmo parametro passado no metodo constructor
6. para integrar o model dentro da aplicação é necessario criar uma arquivo dentro da pasta database chamada index.js
7. dentro do index.js eu importo o Sequelize dentro do sequelize;
8. e importo o databaseConfig de dentro da pasta da config e chamo o arquivo database.js
9. dentro do arquivo index.js eu crio uma classe database e dentro do metodo constructor eu chamo o metodo init;
10. e dentro do metodo init eu instancio um novo objeto sequelize e passo o parametro DatabaseConfig -> esse parametro que carrega minha base de dados na aplicação

*** Usando os controllers ***

- como meu unico model é o user eu crio um arquivo chamado USerController
- todo controller vai ter o mesmo padrão de escrita

1. cria uma classe UserController e  export default new UserController
2. cria um metodo para se usar dentro da requisição HTTP do arquivo Router.js
3. async store(req,res){

    return res.json("msg");
} 
4. crio a função para criação
    async store(req,res){

        const {id, name, email, provider} = await User.create(req.body);

    return res.json({
        id,
        name,
        email,
        provider
    });
} 
5. caso de erro criar as verificações como o email unico

async store(req,res){
        const userExist = await User.findOne({where: 
            { email:req.body.email }
        })

        if(userExist){
            return res.status(400).json({ erro: "User already exists."});
        }

6. é importado dentro do arquivo routes.js
7. dentro do aquivo se cria o metodo post 
    routes.post('/users', UserController.store);

*** criando o password_hash ***

- para gerar o hash da senha é necessario usar bcryptjs 
    - yarn add bcryptjs

- no model de usuario eu importo o bcryptjs
- dentro do model eu não preciso necessariamente refletir a base de dados
- os campos que estão no model são os campos que serão informados pelo usuario da aplicação

1. crio um campo password e o campo é Sequelize.Virtual
2. apos o super init eu crio a função this.addHook
    - this.addHook('beforeSave', async (user) =>{
            if(user.password){ //verifico se ele tem um password, assim sera criado o hash apenas na create
                user.password_hash = await bcrypt.hash(user.password, 8); //força da criptografia
            }

            return this;
        })

*** Autenticação com JWT ***

- é criado um controller de session;  
- instalado o jsonwebtoken
- yarn add jsonwebtoken

1. faço a verificação de o usuario existe e se a senha existe,
2. eu recupero os dados do body do minha requisição
3. retorno no final os dados do usuario junto com o token,
4. o metodo sign do jwt recebe 3 parametros, id, string de hash e config.;
5. eu crio uma rota para acessar o Session na aplicação;

*** Middleware de atenticação ***

- para apenas o usuario que esta autenticado possa ter acesso a rota de update é necessario criar um middleware de autenticação;

1. crio uma pasta dentro de app chama middleware e crio um arquivo authi.js
    - ele vai verificar se o usuario esta logado
    - para isso ele vai utilizar o token de quando o usuario fez o login
    - esse token vai ser passado pelo header (bearer);
2. eu busco o token dentro do header da req
    - const authHeader = req.headers.athorization;
3. e testo se ele existe, caso não exista ele retorna um erro 401
    - quando ele retornar o token por padrão ele retorna um baerer e o token.
4. depois eu divido minha string em um array para utilizar apenas o token.
5. crio um bloco try e cath e dentro do try eu recupero todas as informaçoes
6. dou next pois depois desde ponto ele esta autenticado
7. recupero o id dentro do token e altero dentro do usercontroller

*** Criando a rota de update ***

1. primeiro eu busco os dados de dentro da minha requisição {email, oldPassord}
2. depois eu busco o usuario de dentro do banco de dados, para isso eu uso o User.findByPK(req.UserId)
3. eu verifico se o email que ele esta tentando alterar é o mesmo email que ele já tem 
4. eu verifico se a senha antiga realmente bate com a senha que ele já tem
5. e no final eu atualizo as informações com o user.updade

*** criando as validações ***

- serve para saber se o cliente informou todos os campos solicitados

yarn add yup 
- o Yup é um schemma validation, 
- importante o yup não tem export default, por isso é necessario importar *as yup from 'yup';
1. crio uma variavel chamada schemma e dentro dela passo Yup.object().shape({

})
2. dentro do shape eu passo os campos para serem validados
    const schemma = Yup.object().shape({
        name: Yup.string().required(),   o campo required informa que o campo é obrigatorio
    })
3. apos passar todos os campo eu valido o schema com um if
    if(!(await schema.isValid(req.body))){
        
    }


*** Upload de arquivos ***

- Importante para fazer o avatar
- salvando apenas o avatar do usuario e depois criando os registros
- salvamos o id no banco de dados e depois enviamos o id para o front que renderiza a imagem
- yanr add multer -> a imagem precisa ser multipartformdata

1. criamos uma pasta temp fora do src e criamos dentro dela uma pasta chamada uploads
2. depois criamos um arquivo multer dentro de config 
3. criamos a rota post para poder subir o aquivo para dentro da pasta tmp

*** Salvando updloads dentro do banco de dados ***

1. crio um aquivo dentro de controller e chamado de fileController;
2. depois eu crio uma migration pra poder criar uma tabela no banco de dados
3. criando um campo novo e depois crio um relacionamento
4. é criado uma chave estrangeira dentro de uma migration para referenciar o id salvo no banco com a imagem do usuario
5. e dentro do model de users é passado o relacionamento 
6. crio o model de file para inicializar o file
7. por fim dentro do index do database eu passo o metodo associete criado dentro filecontroller

*** Listagem de prestadores de serviços ***

1. criar as rotas para listar os prestadores de serviços dentro de routes
1. ceio um provider controller para manipular os dados da imagem
3. dentro do providerController eu crio um metodo chamado index que vai manipular as informações
4. dentro do metodo index eu faõ uma busca dos meus usuarios que são providers usando o findall com o metodo where do sql
5. é retornar apenas os atributos que eu quero usando o atributtes
6. incluir uma url para o front acessar as informações desse arquivo


*** Tabela de agendamentos ***

 - toda vez que um usuario agendar ele vai criar um registro desse agendamento
1. criar uma migration para uma tabela de agendamento, essa tabale possui relação com a tabela de usuario
2. dentro da tabela de agendamento eu registro o dia e o horario que foi marcado o agendamento e caso ele seja cancelado eu também marco
3. crio o model de agendamentos

*** Agendamento de serviços ***

1. crio o controller de agendamento e crio a rota em routes.js
2. importante logar como um usuario que não é provedor
3. dentro do controller é feito o teste de o user é provider ou não e medoto de store com o create

*** Validação de agendamento ***

- a data de agendamento é uma data futura
- é a data de agendamento já está sendo usada pelo provider
- um agendamento por hora 

1. install date-fns@next
2. importo dentro do controller de apointment o starofhour, parseISO, isBefore
3. crio os checks

*** listagem de agendamento de usuarios logados ***

1. dentro do AppointmentController crio o metodo de index para listar
2. crio a rota de get dentro de routes
3. procuro por todos os provider sem cancelamento

*** Aplicando paginação ***