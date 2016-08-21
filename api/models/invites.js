'use strict';
module.exports = function(sequelize, DataTypes) {
  var Invites = sequelize.define('Invites', {
    userId: DataTypes.INTEGER,
    locationId: DataTypes.INTEGER,
    date: DataTypes.DATE,
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