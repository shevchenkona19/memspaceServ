'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("reports", {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          reportDate: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "users",
              key: "userId"
            }
          },
          imageId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "images",
              key: "imageId"
            }
          },
          reportReason: {
            type: Sequelize.STRING,
            allowNull: false
          }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("reports");
    }
};
