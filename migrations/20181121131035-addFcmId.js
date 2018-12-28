'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn("users", "fcmId", {
            type: Sequelize.STRING,
            allowNull: true,
            defaultNull: true
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn("users", "fcmId");
    }
};
