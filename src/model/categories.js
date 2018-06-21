module.exports = (db, DataTypes) => {
    const Categories = db.define("categories", {
        categoryId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        categoryName: {
            type: DataTypes.STRING,
        });
    return Categories;
};