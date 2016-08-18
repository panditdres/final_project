'user strict';

module.exports = {
up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('Locations', 'players', {
            type: Sequelize.ARRAY(Sequelize.STRING),
            defaultValue: [],
            after: "type"
        });
    }
}