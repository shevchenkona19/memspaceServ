'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users', 'likeAchievementLvl', {
            type: Sequelize.SMALLINT,
            defaultValue: 0
        });
        await queryInterface.addColumn('users', 'likesCount', {
            type: Sequelize.INTEGER,
            defaultValue: 0
        });
        await queryInterface.addColumn('users', 'dislikesAchievementLvl', {
            type: Sequelize.SMALLINT,
            defaultValue: 0
        });
        await queryInterface.addColumn('users', 'dislikesCount', {
            type: Sequelize.INTEGER,
            defaultValue: 0
        });
        await queryInterface.addColumn('users', 'commentsAchievementLvl', {
            type: Sequelize.SMALLINT,
            defaultValue: 0
        });
        await queryInterface.addColumn('users', 'commentsCount', {
            type: Sequelize.INTEGER,
            defaultValue: 0
        });
        await queryInterface.addColumn('users', 'favouritesAchievementLvl', {
            type: Sequelize.SMALLINT,
            defaultValue: 0
        });
        await queryInterface.addColumn('users', 'favouritesCount', {
            type: Sequelize.INTEGER,
            defaultValue: 0
        });
        await queryInterface.addColumn('users', 'viewsAchievementLvl', {
            type: Sequelize.SMALLINT,
            defaultValue: 0
        });
        await queryInterface.addColumn('users', 'viewsCount', {
            type: Sequelize.INTEGER,
            defaultValue: 0
        });
        await queryInterface.addColumn('users', 'firstHundred', {type: Sequelize.BOOLEAN, defaultValue: false});
        await queryInterface.addColumn('users', 'firstThousand', {type: Sequelize.BOOLEAN, defaultValue: false});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('users', 'likeAchievementLvl');
        await queryInterface.removeColumn('users', 'likesCount');
        await queryInterface.removeColumn('users', 'dislikesAchievementLvl');
        await queryInterface.removeColumn('users', 'dislikesCount');
        await queryInterface.removeColumn('users', 'commentsAchievementLvl');
        await queryInterface.removeColumn('users', 'commentsCount');
        await queryInterface.removeColumn('users', 'favouritesAchievementLvl');
        await queryInterface.removeColumn('users', 'favouritesCount');
        await queryInterface.removeColumn('users', 'viewsAchievementLvl');
        await queryInterface.removeColumn('users', 'viewsCount');
        await queryInterface.removeColumn('users', 'firstHundred');
        await queryInterface.removeColumn('users', 'firstThousand');
    }
};
