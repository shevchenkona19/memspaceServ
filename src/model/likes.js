module.exports = function (db, DataTypes) {
    const Likes = db.define("likes", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        opinion: {
            type: DataTypes.INTEGER,
        }
    }, {timestamps: false,
    associate: models => {
        Likes.belongsTo(models.users);
        Likes.belongsTo(models.images);
    }});

    Likes.getOpinionByIds = async (userId, imageId) => {
        return await Likes.findOne({where: {userId, imageId}, attributes: ["opinion"]});
    };

    return Likes;
};