'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('categories', {
            categoryId: {
                type: Sequelize.INTEGER,
                primaryKey: true
            },
            categoryName: {
                type: Sequelize.STRING,
            }
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('categories')
    }
};
