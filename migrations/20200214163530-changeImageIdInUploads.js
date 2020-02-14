'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("uploads", "imageId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "images",
        key: "imageId"
      }
    })
  },

  down:  async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("uploads", "imageId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "images",
        key: "imageId"
      }
    })
  }
};
