'user strict';

module.exports = {
up: function(queryInterface, Sequelize) {
	return queryInterface.addColumn('Users', 'friendRequestFrom', {
	 		type: Sequelize.ARRAY(Sequelize.INTEGER),
	 		defaultValue: [],
	  		after: "friends"
		});
	}
}
