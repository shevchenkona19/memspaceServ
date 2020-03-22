const moment = require("moment-timezone");
const fs = require("fs");
const ModelLocator = require("../model");
const Images = ModelLocator.getImagesModel();
const ImagesCategories = ModelLocator.getImagesCategoriesModel();
const Comments = ModelLocator.getCommentsModel();
const Likes = ModelLocator.getLikesModel();
const Uploads = ModelLocator.getUploads();
const Reports = ModelLocator.getReports();
const db = ModelLocator.getDb().sequelize;

async function clearOldMemes() {
    const date = moment().subtract(30, "days").format("DD/MM/YYYY");
    const memes = await db.query(`SELECT images."imageId", images."imageData" from images left outer join favorites on (images."imageId" = favorites."imageId") where favorites."imageId" is NULL AND images."createdAt" < to_date('${date}', 'DD/MM/YYYY');`, {model: Images});
    let deleted = 0;
    if (memes != null) {
        deleted = memes.length;
        const ids = memes.map(mem => mem.imageId);
        try {
            memes.forEach(async mem => {
                fs.unlinkSync(mem.imageData);
            });
            await Reports.destroy({where: {imageId: ids}});
            await Uploads.destroy({where: {imageId: ids}});
            await ImagesCategories.destroy({where: {imageId: ids}});
            await Comments.destroy({where: {imageId: ids}});
            await Likes.destroy({where: {imageId: ids}});
            await Images.destroy({where: {imageId: ids}});
        } catch (e) {
            console.error("Error in clearing memes!", e.stack);
        }
    }
    console.log("cleared: " + deleted);
    return {
        success: true,
        ...deleted
    };
}

module.exports = {
    clearOldMemes
};
