'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("images", "uploadId", {
            type: Sequelize.INTEGER,
            references: {
                model: "uploads",
                key: "id"
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn("umages", "uploadId");
    }
};
