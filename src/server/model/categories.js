module.exports = function (db, DataTypes) {
    const Categories = db.define("categories", {
        categoryId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        categoryName: {
            type: DataTypes.STRING,
        }
    }, {
        timestamps: false,
        associate: models => {
            Categories.belongsToMany(models.users, {
                through: "userscategories",
                as: "category",
                foreignKey: "categoryId",
            });
            Categories.belongsToMany(models.images, {
                through: "imagescategories",
                as: "category",
                foreignKey: "categoryId",
            });
        }
    });
    return Categories;
};