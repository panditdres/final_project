'user strict';

module.exports = {
up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('Invites', 'invited', {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
            after: "date"
        });
    }
}