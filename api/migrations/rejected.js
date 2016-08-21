'user strict';

module.exports = {
up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('Invites', 'rejected', {
            type: Sequelize.ARRAY(Sequelize.STRING),
            defaultValue: [],
            after: "accepted"
        });
    }
}