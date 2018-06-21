module.exports = (db, DataTypes) => {
    const ImagesCategories = db.define('imagescategories',  {
        imageId: {
            type: DataTypes.INTEGER,
            references: {
                model: "images",
                key: "imageId"
            }
        },
        categoryId: {
            type: DataTypes.INTEGER,
            references: {
                model: "categories",
                key: "categoryId"
            }
        }
    });
    return ImagesCategories;
};