import Sequelize from 'sequelize';
import User from '../app/models/user'
import File from '../app/models/File';
import DataBaseConfig from '../config/database';
import Appointment from '../app/models/Appointment';
import mongoose from 'mongoose';

const models = [User, File, Appointment];

class Database{
    constructor(){

        this.init();
        this.mongo();
    }

    init(){ //conexão com a base de dados e carregar os models da aplicação
         this.connection = new Sequelize(DataBaseConfig); // conexão com a base de dados
        
        models.map( model => model.init(this.connection)) // vai para dentro da classe user e gerar a conexão do model 
        models.map( model => model.associate && model.associate(this.connection.models));
        //com o base de dados dentro do postgres
    }

    mongo(){
        this.mongoConnection = mongoose.connect(
            'mongodb://localhost:27017/gobarber',
            { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true}
        );
    }
}

export default new Database();