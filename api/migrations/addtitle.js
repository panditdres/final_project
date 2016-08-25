'user strict';

module.exports = {
up: function(queryInterface, Sequelize) {
	return queryInterface.addColumn('Reviews', 'title', {
	 		type: Sequelize.STRING,
	  		after: "userId"
		});
	}
}