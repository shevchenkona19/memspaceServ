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
    }, {timestamps: false});
    return Categories;
};