'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("users", "lastVisited", {
      type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("users", "lastVisited");
  }
};
