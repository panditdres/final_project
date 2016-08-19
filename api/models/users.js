'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {type:DataTypes.STRING, unique:true},
    username: {type:DataTypes.STRING, unique:true},
    friends: DataTypes.ARRAY(DataTypes.STRING),
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Users;
};