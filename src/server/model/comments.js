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
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        answers: {
            type: DataTypes.INTEGER,
            defaultValue: null,
            allowNull: true
        },
        answerUserId: {
            type: DataTypes.INTEGER,
            defaultValue: null,
            allowNull: true,
            references: {
                model: "users",
                key: "userId"
            }
        }
    }, {
        timestamps: false
    });
    return Comments;
};