module.exports = function(db, DataTypes) {
    const Favorites = db.define('favorites', {
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: "users",
                key: "userId"
            }
        },
        imageId: {
            type: DataTypes.INTEGER,
            references: {
                model: "images",
                key: "imageId"
            }
        }
    }, {timestamps: false});

    return Favorites;
};