const db = require("./db").sequelize;
const DataTypes = require("./db").Sequelize.DataTypes;
let users;
let images;
let comments;
let usersCategories;
let imagesCategories;
let favorites;

module.exports = {
    init: () => {
        users = require("./users")(db, DataTypes);
        images = require("./images")(db, DataTypes);
        comments = require("./comments")(db, DataTypes);
        usersCategories = require("./userscategories")(db, DataTypes);
        imagesCategories = require("./imagescategories")(db, DataTypes);
        favorites = require("./favorites")(db, DataTypes);
    },
    getUsersModel: () => users,
    getImagesModel: () => images,
    getCommentsModel: () => comments,
    getUsersCategoriesModel: () => usersCategories,
    getImagesCategoriesModel: () => imagesCategories,
    getFavoritesModel: () => favorites
};
