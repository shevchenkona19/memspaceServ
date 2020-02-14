module.exports = function (db, DataTypes) {
    const Uploads = db.define("uploads", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        uploadDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "userId"
            }
        },
        imageId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        timestamps: false,
        associate: models => {
            Uploads.belongsTo(models.users, {
                as: "user"
            });
        }
    });
    return Uploads;
};