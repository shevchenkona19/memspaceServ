const Images = require("../model/index").getImagesModel();
const ImagesCategories = require("../model/index").getImagesCategoriesModel();
const Comments = require("../model/index").getCommentsModel();
const Likes = require("../model/index").getLikesModel();
const Op = require("sequelize").Op;
const Sequelize = require("sequelize");
const moment = require("moment");
const fs = require("fs");
const db = require("../model/index").getDb().sequelize;

async function clearOldMemes() {
    //kek
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
        deleted
    };
}

module.exports = {
    clearOldMemes
};