module.exports = function (db, DataTypes) {
    const FeedTime = db.define("feedTime", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isFeed: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
        isHot: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
        isCategories: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
        timestamp: DataTypes.DATE
    }, {timestamps: false, freezeTableName: true});

    return FeedTime;
};