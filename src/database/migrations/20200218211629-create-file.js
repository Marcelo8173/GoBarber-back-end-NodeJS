'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('files', {
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
         path:{
          type: Sequelize.STRING, //ripo string
          allowNull: false,
          unique: true, //serve para poder não permitir que existem elementos repetidos
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
     return queryInterface.dropTable('files');
  }
};

