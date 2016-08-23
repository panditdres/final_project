'use strict';
module.exports = function(sequelize, DataTypes) {
  var Invites = sequelize.define('Invites', {
    userId: DataTypes.INTEGER,
    locationId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    accepted: DataTypes.ARRAY(DataTypes.INTEGER),
    rejected: DataTypes.ARRAY(DataTypes.INTEGER),
    invited: DataTypes.ARRAY(DataTypes.INTEGER)
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Invites;
};