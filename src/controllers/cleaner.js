const Images = require("../model/index").getImagesModel();
const ImagesCategories = require("../model/index").getImagesCategoriesModel();
const Favorites = require("../model/index").getFavoritesModel();
const Sequelize = require("sequelize").Op;
const moment = require("moment");
const fs = require("fs");

async function clearOldMemes() {
    const memesToDelete = await Images.findAll({where: {createdAt: {[Sequelize.lt]: moment().subtract(30, "days").toDate()}}});
    const deleted = memesToDelete.length;
    const confirm = memesToDelete.filter(async mem => {
        const isFavorite = await Favorites.findOne({where: {imageId: mem.imageid}});
        return isFavorite === null;
    });
    const ids = confirm.map(mem => mem.imageId);
    try {
        confirm.forEach(async mem => {
            fs.unlinkSync(mem.imageData);
        });
        await ImagesCategories.destroy({where: {imageId: ids}});
        await Images.destroy({where: {imageId: ids}});
    } catch (e) {
        console.error("Error in clearing memes!", e.stack);
    }
    console.log("cleared: " + deleted);
    return {
        success: true,
        deleted
    };
}

module.exports = {
    clearOldMemes
};