const Images = require("../model/index").getImagesModel();
const Sequelize = require("sequelize").Op;
const moment = require("moment");
const fs = require("fs");

async function clearOldMemes() {
    const memesToDelete = await Images.findAll({where: {createdAt: {[Sequelize.lt]: moment().subtract(30, "days").toDate()}}});
    const deleted = memesToDelete.length;
    try {
        memesToDelete.forEach(mem => {
            fs.unlinkSync(mem.imageData);
        });
        await Images.destroy({where: {createdAt: {[Sequelize.lt]: moment().subtract(30, "days").toDate()}}});
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