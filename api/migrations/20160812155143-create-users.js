'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      password: {
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
      username: {
        type: Sequelize.STRING,
        unique: true
      },
      friendRequestFrom: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue:[]
      },
      friends: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
      },
      playing: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
      },
      profilePic: {
        type: Sequelize.STRING,
        defaultValue: "/uploads/default.png"
      },
      friendRequestFrom: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue:[]
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');
  }
};