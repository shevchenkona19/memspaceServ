module.exports = (db, DataTypes) => {
  const Images = db.define("images", {
      imageId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      imageData: {
          type: DataTypes.BLOB,
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
      }
  });
  return Images;
};