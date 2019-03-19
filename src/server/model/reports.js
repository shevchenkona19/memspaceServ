module.exports = function (db, DataTypes) {
    const Reports = db.define("reports", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        reportDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
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
            allowNull: false,
            references: {
                model: "images",
                key: "imageId"
            }
        },
        reportReason: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        associate: models => {
            Reports.belongsTo(models.users, {
                as: "userId"
            });
            Reports.belongsTo(models.images, {
                as: "imageId"
            })
        }
    });
    return Reports;
};