'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("userFeedback", {
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
            title: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            message: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("userFeedback");
    }
};
