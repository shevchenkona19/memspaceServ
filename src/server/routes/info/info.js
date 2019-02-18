const Controller = require("../../controllers/info.js");
const ErrorCodes = require("../../constants/errorCodes");

async function getUsersInfo(req, res, next) {
    const result = await Controller.getUsersInfo(req.params);
    if (result.success) {
        return res.json({
            success: true,
            users: result.users
        })
    }
    next({
        success: false,
        message: ErrorCodes.INTERNAL_ERROR
    });
}

async function getMemesInfo(req, res, next) {

}


module.exports = {
    getMemesInfo,
    getUsersInfo
};