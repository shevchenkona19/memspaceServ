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
            defaultValue: 0
        },
        likesCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        dislikesAchievementLvl: {
            type: DataTypes.SMALLINT,
            defaultValue: 0
        },
        dislikesCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        commentsAchievementLvl: {
            type: DataTypes.SMALLINT,
            defaultValue: 0
        },
        commentsCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        favouritesAchievementLvl: {
            type: DataTypes.SMALLINT,
            defaultValue: 0
        },
        favouritesCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        viewsAchievementLvl: {
            type: DataTypes.SMALLINT,
            defaultValue: 0
        },
        viewsCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        referralAchievementLvl: {
            type: DataTypes.SMALLINT,
            defaultValue: 0,
        },
        referralCount: {
            type: DataTypes.SMALLINT,
            defaultValue: 0,
        },
        firstHundred: {
            type: DataTypes.BOOLEAN
        },
        firstThousand: {
            type: DataTypes.BOOLEAN
        },
        fcmId: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultNull: true
        },
        lastVisited: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        isBanned: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    }, {
        timestamps: false,
        associate: models => {
            Users.belongsToMany(models.images, {
                through: "favorites",
                as: "user",
                foreignKey: "userId"
            });
            Users.belongsToMany(models.categories, {
                through: "userscategories",
                as: "category",
                foreignKey: "userId"
            });
            Users.hasMany(models.userfeedback, {onDelete: "cascade", foreignKey: "userId"});
            Users.belongsToMany(models.images, {
                through: "likes",
                as: "user",
                foreignKey: "userId"
            });
            Users.belongsToMany(models.images, {
                through: "comments",
                as: "user",
                foreignKey: "userId"
            })
        }
    });

    return Users;
};