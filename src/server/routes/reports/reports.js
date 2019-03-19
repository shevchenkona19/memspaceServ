const ErrorCodes = require("../../constants/errorCodes");
const Controller = require("../../controllers/reports");

async function postReport(req, res, next) {
    const user = req.user;
    const imageId = req.body.imageId;
    const reportReason = req.body.reportReason;
    if (!user || !imageId || !reportReason) {
        next(ErrorCodes.INCORRECT_BODY);
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

module.exports = {
    postReport,
    deleteReport
};