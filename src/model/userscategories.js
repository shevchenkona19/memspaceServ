module.exports = (db, DataTypes) => {
    const UsersCategories = db.define("userscategories", {
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: "users",
                key: "userId"
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

    return UsersCategories;
};