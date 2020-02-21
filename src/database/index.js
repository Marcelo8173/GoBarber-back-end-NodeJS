import Sequelize from 'sequelize';
import User from '../app/models/user'
import File from '../app/models/File';
import DataBaseConfig from '../config/database';


const models = [User, File];

class Database{
    constructor(){

        this.init();
    }

    init(){ //conexão com a base de dados e carregar os models da aplicação
         this.connection = new Sequelize(DataBaseConfig); // conexão com a base de dados
        
        models.map( model => model.init(this.connection)) // vai para dentro da classe user e gerar a conexão do model 
        models.map( model => model.associate && model.associate(this.connection.models));
        //com o base de dados dentro do postgres
    }
}

export default new Database();