'use strict'

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.addColumn( 'Users','friendRequestFrom',
	  {
	    type: Sequelize.ARRAY(Sequelize.STRING),
	    defaultValue:[]
	  }
)}
 