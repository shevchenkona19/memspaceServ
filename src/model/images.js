module.exports = function (db, DataTypes) {
    const Images = db.define("images", {
        imageId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        imageData: {
            type: DataTypes.STRING,
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        dislikes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        comments: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        isChecked: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        source: {
            type: DataTypes.STRING
        },
        height: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        width: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false,
        associate: models => {
            Images.hasMany(models.likes, {onDelete: "cascade"});
            Images.hasMany(models.comments, {onDelete: "cascade"});
        }
    });
    return Images;
};