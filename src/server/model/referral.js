module.exports = function (db, DataTypes) {
    const Referral = db.define("referral", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "userId"
            }
        },
        myCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        usedCode: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        }
    }, {timestamps: false, freezeTableName: true,
    associate: models => {
        Referral.belongsTo(models.users);
    }});

    return Referral;
};