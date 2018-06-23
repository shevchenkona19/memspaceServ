const db = require("./db").sequelize;
const DataTypes = require("./db").Sequelize.DataTypes;
let users;
let images;
let categories;
let comments;
let usersCategories;
let imagesCategories;
let favorites;
let likes;

module.exports = {
    init: () => {
        users = require("./users")(db, DataTypes);
        images = require("./images")(db, DataTypes);
        categories = require("./categories")(db, DataTypes);
        comments = require("./comments")(db, DataTypes);
        usersCategories = require("./userscategories")(db, DataTypes);
        imagesCategories = require("./imagescategories")(db, DataTypes);
        favorites = require("./favorites")(db, DataTypes);
        likes = require("./likes")(db, DataTypes);
    },
    getUsersModel: () => users,
    getImagesModel: () => images,
    getCategoriesModel: () => categories,
    getCommentsModel: () => comments,
    getUsersCategoriesModel: () => usersCategories,
    getImagesCategoriesModel: () => imagesCategories,
    getFavoritesModel: () => favorites,
    getLikesModel: () => likes,
    getDb: () => db,
};
