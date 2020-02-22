'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("feedTime", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            isFeed: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
            isHot: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
            isCategories: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
            timestamp: {type: Sequelize.DATE, allowNull: false}
        }, {timestamps: false});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("feedTime");
    }
};
