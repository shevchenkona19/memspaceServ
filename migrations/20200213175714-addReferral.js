'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("referral", {
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "userId"
                }
            },
            myCode: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            usedCode: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null
            }
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("referral");
    }
};
