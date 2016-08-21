'user strict';

module.exports = {
up: function(queryInterface, Sequelize) {
	return queryInterface.removeColumn('Users', 'playing')
	}
}