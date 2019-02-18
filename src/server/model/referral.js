module.exports = function (db, DataTypes) {
    const Referral = db.define("referral", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
    }, {timestamps: false, freezeTableName: true,});

    return Referral;
};