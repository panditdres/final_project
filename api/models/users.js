'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {type:DataTypes.STRING, unique:true},
    username: {type:DataTypes.STRING, unique:true},
    profilePic: DataTypes.STRING,
    friends: DataTypes.ARRAY(DataTypes.STRING),
    friendRequestFrom: DataTypes.ARRAY(DataTypes.INTEGER),
    playing: DataTypes.ARRAY(DataTypes.INTEGER),
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