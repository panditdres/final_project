'user strict';

module.exports = {
up: function(queryInterface, Sequelize) {
	return queryInterface.addColumn('Users', 'username', {
	 		type: Sequelize.STRING,
	  		after: "lastName",
	  		unique: true
		});
	}
}
