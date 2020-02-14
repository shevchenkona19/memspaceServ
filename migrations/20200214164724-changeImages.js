'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("images", "uploadId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("images", "uploadId", {
      type: Sequelize.INTEGER,
      references: {
        model: "uploads",
        key: "id"
      }
    })
  }
};
