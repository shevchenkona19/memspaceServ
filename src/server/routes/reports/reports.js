const ErrorCodes = require("../../constants/errorCodes");
const Controller = require("../../controllers/reports");

async function postReport(req, res, next) {
    const user = req.user;
    const imageId = req.body.imageId;
    const reportReason = req.body.reportReason;
    if (!user || !imageId || !reportReason) {
        next(ErrorCodes.INCORRECT_BODY);
        return;
    }
    const result = await Controller.postReport(user, imageId, reportReason);
    if (result.success) {
        return res.json({success: true})
    } else {
        next(result.error)
    }
}

async function deleteReport(req, res, next) {
    const reportId = req.query.reportId;
    if (!reportId) {
        next(ErrorCodes.INCORRECT_DATA)
    }
    const result = await Controller.deleteReport(reportId);
    if (result.success) {
        return res.json({success: true})
    } else {
        next(result.error)
    }
}

async function getAllReports(req, res, next) {
    const count = req.query.count;
    const offset = req.query.offset;
    if (!count || !offset) {
        next(ErrorCodes.INCORRECT_DATA);
    }
    const result = await Controller.getAllReports(count, offset);
    if (result.success) {
        return res.json({
            success: true,
            data: result.data,
        })
    } else {
        next(result.error);
    }
}

async function deleteMeme(req, res, next) {
    const memId = req.query.memeId;
    if (!memId) {
        next(ErrorCodes.INCORRECT_DATA);
    }
    const result = await Controller.deleteMeme(memId);
    if (result.success) {
        return res.json({
            success: true,
        })
    } else {
        next(result.error);
    }
}

async function banUser(req, res, next) {
    const userId = req.query.userId;
    if (!userId) {
        next(ErrorCodes.INCORRECT_DATA);
    }
    const result = await Controller.banUser(userId);
    if (result.success) {
        return res.json({
            success: true,
        })
    } else {
        next(result.error);
    }
}

module.exports = {
    postReport,
    deleteReport,
    getAllReports,
    deleteMeme,
    banUser,
};