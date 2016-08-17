'user strict';

module.exports = {
up: function(queryInterface, Sequelize) {
	return queryInterface.addColumn('Locations', 'currCapacity', {
	 		type: Sequelize.INTEGER,
	 		defaultValue: 0,
	  		after: "type"
		});
	}
}