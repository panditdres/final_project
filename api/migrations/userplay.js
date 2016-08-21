'user strict';

module.exports = {
up: function(queryInterface, Sequelize) {
	return queryInterface.addColumn('Users', 'playing', {
	 		type: Sequelize.ARRAY(Sequelize.INTEGER),
	  		after: "friends"
		});
	}
}
