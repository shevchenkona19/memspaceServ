'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable('users', {
            userId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING
            },
            imageData: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            accessLvl: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            favorites: {
                type: Sequelize.STRING,
                defaultValue: "[]"
            }
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('users');
    }
};
