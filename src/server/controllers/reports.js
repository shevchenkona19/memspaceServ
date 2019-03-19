const ModelLocator = require("../model/index");
const ErrorCodes = require("../constants/errorCodes");
const Reports = ModelLocator.getReports();

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

module.exports = {
    postReport,
    deleteReport
};