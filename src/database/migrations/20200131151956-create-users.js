'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('users', {
         id: {
           type: Sequelize.INTEGER, //para definir o tipo
           allowNull: false,  //para não permitir que algum user não tenha id
           autoIncrement: true, // para icrementar automaticamente
           primaryKey: true, //chave primaria
         },
         name:{
           type: Sequelize.STRING, //ripo string
           allowNull: false,
         },
         email:{
          type: Sequelize.STRING, //ripo string
          allowNull: false,
          unique: true, //serve para poder não permitir que existem elementos repetidos
         },
         password_hash: { //vai ser criptografado
          type: Sequelize.STRING, //ripo string
          allowNull: false,
         },
         provide: { // quando é true ele é prestador de serviço
           type: Sequelize.BOOLEAN,
           defaultValue: false,
           allowNull: false,
         },
         created_at:{
            type: Sequelize.DATE,
            allowNull: false,
         },
         updated_at:{
            type: Sequelize.DATE,
            allowNull:false,
         }
        
        });
    
    },

  down: (queryInterface) => {
     return queryInterface.dropTable('users');
  }
};

