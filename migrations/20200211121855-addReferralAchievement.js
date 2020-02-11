'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'referralAchievementLvl', {
      type: Sequelize.SMALLINT,
      defaultValue: 0
    });
    await queryInterface.addColumn('users', 'referralCount', {
      type: Sequelize.SMALLINT,
      defaultValue: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'referralAchievementLvl');
    await queryInterface.removeColumn('users', 'referralCount');
  }
};
