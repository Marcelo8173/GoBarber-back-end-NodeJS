'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users','avatar_id',{ //criando o campo avatar-id dentro da tabela users
      type: Sequelize.INTEGER,
      references: {model: 'files', key: 'id'}, //criando a chave estrangeira dentro do model files
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users','avatar_id');
  }
};
