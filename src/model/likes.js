module.exports = (db, DataTypes) => {
  const Likes = db.define("likes", {
      id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      userId: {
          type: Sequelize.INTEGER,
          references: {
              model: "users",
              key: "userId"
          }
      },
      imageId: {
          type: Sequelize.INTEGER,
          references: {
              model: "images",
              key: "imageId"
          }
      },
      opinion: {
          type: Sequelize.INTEGER,
      }
  });

  Likes.getOpinionByIds = async (userId, imageId) => {
      return await Likes.findOne({where: {userId, imageId}, attributes: ["opinion"]});
  };

  return Likes;
};