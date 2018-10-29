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
            type: DataTypes.SMALLINT,
            defaultValue: achievementLvls.likes["0"].lvl
        },
        likesCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        dislikesAchievementLvl: {
            type: DataTypes.SMALLINT,
            defaultValue: achievementLvls.dislikes["0"].lvl
        },
        dislikesCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        commentsAchievementLvl: {
            type: DataTypes.SMALLINT,
            defaultValue: achievementLvls.comments["0"].lvl
        },
        commentsCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        favouritesAchievementLvl: {
            type: DataTypes.SMALLINT,
            defaultValue: achievementLvls.favourites["0"].lvl
        },
        favouritesCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        viewsAchievementLvl: {
            type: DataTypes.SMALLINT,
            defaultValue: achievementLvls.views["0"].lvl
        },
        viewsCount: {
            type: DataTypes.INTEGER,
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