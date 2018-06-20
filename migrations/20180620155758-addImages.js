'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('images', {
            imageId: {
                type: Sequelize.INTEGER,
                primaryKey: true,
            },
            imageData: {
                type: Sequelize.BLOB,
            },
            likes: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            dislikes: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            comments: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            isChecked: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            source: {
                type: Sequelize.STRING
            },
            height: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            width: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            }
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('images')
    }
};
