'use strict';
module.exports = function(sequelize, DataTypes) {
  var HistoryLog = sequelize.define('HistoryLog', {
    user_id: DataTypes.INTEGER,
    location_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return HistoryLog;
};