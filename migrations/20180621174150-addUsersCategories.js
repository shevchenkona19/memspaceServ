'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("userscategories", {
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "users",
                    key: "userId"
                }
            },
            categoryId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "categories",
                    key: "categoryId"
                }
            }
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("userscategories");
    }
};
