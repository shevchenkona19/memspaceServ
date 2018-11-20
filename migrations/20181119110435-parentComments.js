'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("comments", "parentId", {
            type: Sequelize.INTEGER,
            defaultValue: null,
            allowNull: true,
        });
        await queryInterface.addColumn("comments", "answers", {
            type: Sequelize.INTEGER,
            defaultValue: null,
            allowNull: true
        });
        await queryInterface.addColumn("comments", "answerUserId", {
            type: Sequelize.INTEGER,
            defaultValue: null,
            allowNull: true,
            references: {
                model: "users",
                key: "userId"
            }
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn("comments", "parentId");
        await queryInterface.removeColumn("comments", "answers");
        await queryInterface.removeColumn("comments", "answerUserId");
    }
};
