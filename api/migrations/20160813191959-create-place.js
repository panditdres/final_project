'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Location', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.FLOAT
      },
      longitude: {
        type: Sequelize.FLOAT
      },
      type: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      maxCapacity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      address: {
        type: Sequelize.STRING
      },
      players: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Location');
  }
};