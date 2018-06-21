'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("favorites", {
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "users",
                    key: "userId"
                }
            },
            imageId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "images",
                    key: "imageId"
                }
            }
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("favorites")
    }
};
