'use strict';
module.exports = function(sequelize, DataTypes) {
  var Location = sequelize.define('Location', {
    name: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    type: DataTypes.STRING,
    players: DataTypes.ARRAY(DataTypes.STRING),
    address: DataTypes.STRING,
    currCapacity: DataTypes.INTEGER,
    maxCapacity: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Location;
};