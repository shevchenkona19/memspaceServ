'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("memeIds", {
            memeId: {type: Sequelize.INTEGER},
            groupId: {type: Sequelize.INTEGER},
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("memeIds");
    }
};
