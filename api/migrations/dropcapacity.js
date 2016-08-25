'user strict';

module.exports = {
up: function(queryInterface, Sequelize) {
	return queryInterface.removeColumn('Locations', 'currCapacity')
	}
}