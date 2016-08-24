'user strict';

module.exports = {
up: function(queryInterface, Sequelize) {
	return queryInterface.addColumn('Users', 'profilePic', {
	 		type: Sequelize.STRING,
	 		defaultValie: '/uploads/default.png'
	  		after: "username"
		});
	}
}
