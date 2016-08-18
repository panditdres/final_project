'user strict';

module.exports = {
up: function(queryInterface, Sequelize) {
	return queryInterface.addColumn('Locations', 'address', {
	 		type: Sequelize.STRING,
	  		after: "type"
		});
	}
}