'use strict';
const achievementLvls = require("../src/constants/achievementLevels");

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('users', 'likeAchievementLvl', {
            type: Sequelize.SMALLINT,
            defaultValue: achievementLvls.likes["0"].price
        })
            .then(() => queryInterface.addColumn('users', 'likesCount', {
                type: Sequelize.INTEGER,
                defaultValue: 0
            })
                .then(() => queryInterface.addColumn('users', 'dislikesAchievementLvl', {
                    type: Sequelize.SMALLINT,
                    defaultValue: achievementLvls.dislikes["0"].price
                })
                    .then(() => queryInterface.addColumn('users', 'dislikesCount', {
                        type: Sequelize.INTEGER,
                        defaultValue: 0
                    })
                        .then(() => queryInterface.addColumn('users', 'commentsAchievementLvl', {
                            type: Sequelize.SMALLINT,
                            defaultValue: achievementLvls.comments["0"].price
                        })
                            .then(() => queryInterface.addColumn('users', 'commentsCount', {
                                type: Sequelize.INTEGER,
                                defaultValue: 0
                            })
                                .then(() => queryInterface.addColumn('users', 'favouritesAchievementLvl', {
                                    type: Sequelize.SMALLINT,
                                    defaultValue: achievementLvls.favourites["0"].price
                                })
                                    .then(() => queryInterface.addColumn('users', 'favouritesCount', {
                                        type: Sequelize.INTEGER,
                                        defaultValue: 0
                                    })
                                        .then(() => queryInterface.addColumn('users', 'viewsAchievementLvl', {
                                            type: Sequelize.SMALLINT,
                                            defaultValue: achievementLvls.views["0"].price
                                        })
                                            .then(() => queryInterface.addColumn('users', 'viewsCount', {
                                                type: Sequelize.INTEGER,
                                                defaultValue: 0
                                            })
                                                .then(() => queryInterface.addColumn('users', 'firstHundred', Sequelize.BOOLEAN)
                                                    .then(() => queryInterface.addColumn('users', 'firstThousand', Sequelize.BOOLEAN))))))))))));
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('users', 'likeAchievementLvl')
            .then(() => queryInterface.removeColumn('users', 'likesCount')
                .then(() => queryInterface.removeColumn('users', 'dislikesAchievementLvl')
                    .then(() => queryInterface.removeColumn('users', 'dislikesCount')
                        .then(() => queryInterface.removeColumn('users', 'commentsAchievementLvl')
                            .then(() => queryInterface.removeColumn('users', 'commentsCount')
                                .then(() => queryInterface.removeColumn('users', 'favouritesAchievementLvl')
                                    .then(() => queryInterface.removeColumn('users', 'favouritesCount')
                                        .then(() => queryInterface.removeColumn('users', 'viewsAchievementLvl')
                                            .then(() => queryInterface.removeColumn('users', 'viewsCount')
                                                .then(() => queryInterface.removeColumn('users', 'firstHundred')
                                                    .then(() => queryInterface.removeColumn('users', 'firstThousand'))))))))))));
    }
};
