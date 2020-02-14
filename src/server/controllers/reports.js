const ModelLocator = require("../model/index");
const ErrorCodes = require("../constants/errorCodes");
const Reports = ModelLocator.getReports();
const Images = ModelLocator.getImagesModel();
const ImagesCategories = ModelLocator.getImagesCategoriesModel();
const Comments = ModelLocator.getCommentsModel();
const Likes = ModelLocator.getLikesModel();
const Users = ModelLocator.getUsersModel();
const Uploads = ModelLocator.getUploads();
const Favorites = ModelLocator.getFavoritesModel();
const db = ModelLocator.getDb().sequelize;
const fs = require("fs");

async function postReport(user, imageId, reportReason) {
    const report = Reports.build({
        userId: user.userId,
        imageId,
        reportReason
    });
    await report.save();
    return {
        success: true
    };
}

async function deleteReport(reportId) {
    const report = await Reports.findById(reportId);
    if (!report) {
        return {
            success: false,
            error: ErrorCodes.NO_SUCH_REPORT
        }
    }
    await Reports.destroy({
        where: {id: reportId}
    });
    return {
        success: true,
    }
}

async function getAllReports(count, offset) {
    const res = await db.query(`select reports.id, reports."reportDate", reports."userId", reports."imageId", reports."reportReason", uploads."userId" as "memePostedBy" `
        + ` from reports`
        + ` left outer join images on images."imageId" = reports."imageId"`
        + ` left outer join uploads on uploads.id = images."uploadId"`
        + ` order by "reportDate" DESC limit ${count} offset ${offset};`);
    const reportsArr = res[0] || [];
    const c = await db.query(`select count(*) from reports`);
    const pageCount = Math.floor(c[0][0].count / count);
    return {
        success: true,
        data: {
            reports: reportsArr,
            pageCount,
        }
    }
}

async function deleteMeme(memId) {
    const meme = await Images.findById(memId, {attributes: ["imageData"]});
    if (meme === null) {
        return {
            success: false,
            error: ErrorCodes.NO_SUCH_MEM
        };
    }
    if (fs.existsSync(meme.imageData))
        fs.unlinkSync(meme.imageData);
    const image = await Images.findById(memId);
    image.uploadId = null;
    await image.save();
    await Reports.destroy({where: {imageId: memId}});
    await ImagesCategories.destroy({where: {imageId: memId}});
    await Comments.destroy({where: {imageId: memId}});
    await Likes.destroy({where: {imageId: memId}});
    await Favorites.destroy({where: {imageId: memId}});
    if (await Uploads.findOne({where: {imageId: memId}})) {
        await Uploads.destroy({where: {imageId: memId}});
    }
    await Images.destroy({where: {imageId: memId}});

    return {
        success: true
    }
}

async function banUser(userId) {
    const user = await Users.findById(userId);
    if (user == null) {
        return {
            success: false,
            error: ErrorCodes.NO_SUCH_USER
        }
    }
    user.isBanned = true;
    await user.save();
    return {
        success: true
    }
}

async function unbanUser(userId) {
    const user = await Users.findById(userId);
    if (user == null) {
        return {
            success: false,
            error: ErrorCodes.NO_SUCH_USER
        }
    }
    user.isBanned = false;
    await user.save();
    return {success: true}
}

module.exports = {
    postReport,
    deleteReport,
    getAllReports,
    deleteMeme,
    banUser,
    unbanUser
};