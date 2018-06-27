'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('comments', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
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
            text: {
                type: Sequelize.TEXT
            },
            date: {
                type: Sequelize.DATE,
            }
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("comments");
    }
};
