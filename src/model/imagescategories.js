module.exports = (db, DataTypes) => {
    const ImagesCategories = db.define('imagescategories', {
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
    ImagesCategories.getTest = async (category, limit, offset) => {
        return await ImagesCategories.findOne({
            attributes: ["imageId"],
            where: {categoryId: category.get("categoryId")},
            order: db.literal("imageId DESC"),
            limit,
            offset
        })
    };
    return ImagesCategories;
};