'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("likes", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
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
            },
            opinion: {
                type: Sequelize.INTEGER,
            }
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("likes")
    }
};
