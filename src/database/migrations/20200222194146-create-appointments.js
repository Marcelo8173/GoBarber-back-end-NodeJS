'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('appointments', {
         id: {
           type: Sequelize.INTEGER, //para definir o tipo
           allowNull: false,  //para não permitir que algum user não tenha id
           autoIncrement: true, // para icrementar automaticamente
           primaryKey: true, //chave primaria
         },
         date: {
            allowNull: false,
            type: Sequelize.DATE
         },
         user_id:{
            type: Sequelize.INTEGER,
            references: {model: 'users', key: 'id'}, //criando a chave estrangeira dentro do model files
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
         },
         provider_id: {
            type: Sequelize.INTEGER,
            references: {model: 'users', key: 'id'}, //criando a chave estrangeira dentro do model files
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
         },
         canceled_at:{
            type: Sequelize.DATE,
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
     return queryInterface.dropTable('appointments');
  }
};

