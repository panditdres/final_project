'user strict';

module.exports = {
up: function(queryInterface, Sequelize) {
	return queryInterface.addColumn('Users', 'friends', {
	 		type: Sequelize.ARRAY(Sequelize.STRING),
            defaultValue: [],
	  		after: "username"
		});
	}
}