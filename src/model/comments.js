module.exports = function (db, DataTypes) {
    const Comments = db.define("comments", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
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
        },
        text: {
            type: DataTypes.TEXT
        },
        date: {
            type: DataTypes.DATE,
        }
    }, {
        timestamps: false
    });
    return Comments;
};