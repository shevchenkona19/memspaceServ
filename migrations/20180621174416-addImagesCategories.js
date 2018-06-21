'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("imagescategories", {
            imageId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "images",
                    key: "imageId"
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
        return queryInterface.dropTable("imagescategories");
    }
};
