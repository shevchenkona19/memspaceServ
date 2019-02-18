const sequelize = require("./db").sequelize;
const Sequelize = require("./db").Sequelize;
const fs = require("fs");
const path = require("path");

const db = {};

fs.readdirSync(__dirname)
    .filter(file => {
        return file !== "index.js" && file !== "db.js";
    })
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize.models.imagescategories.removeAttribute("id");
db.sequelize.models.userscategories.removeAttribute("id");
db.sequelize.models.favorites.removeAttribute("id");
db.sequelize.models.memeIds.removeAttribute("id");
db.sequelize.models.referral.removeAttribute("id");


module.exports = {
    getUsersModel: () => db.sequelize.models.users,
    getImagesModel: () => db.sequelize.models.images,
    getCategoriesModel: () => db.sequelize.models.categories,
    getCommentsModel: () => db.sequelize.models.comments,
    getUsersCategoriesModel: () => db.sequelize.models.userscategories,
    getImagesCategoriesModel: () => db.sequelize.models.imagescategories,
    getFavoritesModel: () => db.sequelize.models.favorites,
    getLikesModel: () => db.sequelize.models.likes,
    getUserFeedback: () => db.sequelize.models.userfeedback,
    getMemeIdsModel: () => db.sequelize.models.memeIds,
    getReferral: () => db.sequelize.models.referral,
    getDb: () => db,
};