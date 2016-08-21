'user strict';

module.exports = {
up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('Invites', 'accepted', {
            type: Sequelize.ARRAY(Sequelize.STRING),
            defaultValue: [],
            after: "invited"
        });
    }
}