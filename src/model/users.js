const achievementLvls = require("../constants/achievementLevels");

module.exports = function (db, DataTypes) {
    const Users = db.define("users", {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING
        },
        imageData: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        accessLvl: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        favorites: {
            type: DataTypes.STRING,
            defaultValue: "[]"
        },
        likeAchievementLvl: {
            type: Sequelize.SMALLINT,
            defaultValue: achievementLvls.likes["0"].price
        },
        likesCount: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        dislikesAchievementLvl: {
            type: Sequelize.SMALLINT,
            defaultValue: achievementLvls.dislikes["0"].price
        },
        dislikesCount: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        commentsAchievementLvl: {
            type: Sequelize.SMALLINT,
            defaultValue: achievementLvls.comments["0"].price
        },
        commentsCount: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        favouritesAchievementLvl: {
            type: Sequelize.SMALLINT,
            defaultValue: achievementLvls.favourites["0"].price
        },
        favouritesCount: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        viewsAchievementLvl: {
            type: Sequelize.SMALLINT,
            defaultValue: achievementLvls.views["0"].price
        },
        viewsCount: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        firstHundred: {
            type: DataTypes.BOOLEAN
        },
        firstThousand: {
            type: DataTypes.BOOLEAN
        }
    }, {timestamps: false});

    return Users;
};