'user strict';

module.exports = {
up: function(queryInterface, Sequelize) {
	return queryInterface.addColumn('Locations', 'maxCapacity', {
	 		type: Sequelize.INTEGER,
	  		after: "type"
		});
	}
}

