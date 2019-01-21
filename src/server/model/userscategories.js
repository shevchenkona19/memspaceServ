module.exports = function(db, DataTypes) {
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
    }, {timestamps: false});

    return UsersCategories;
};