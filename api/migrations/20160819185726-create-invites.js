'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Invites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      locationId: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      accepted: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      rejected: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      invited: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
      },
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Invites');
  }
};