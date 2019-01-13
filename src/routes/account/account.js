const SuccessCodes = require("../../constants/successCodes");
const ErrorCodes = require("../../constants/errorCodes");
const Controller = require("../../controllers/account");
const policyPath = require("../../app").policy;

async function login(req, res, next) {
    const result = await Controller.login(req.body);
    if (result.success) {
        return res.json({
            token: result.token,
            id: result.userId
        })
    } else {
        next(result.errorCode);
    }
}

async function register(req, res, next) {
    const result = await Controller.register(req.body);
    if (result.success) {
        return res.json({
            id: result.userId,
            token: result.token
        })
    } else {
        next(result.errorCode);
    }
}

async function registerModer(req, res, next) {
    const result = await Controller.registerModer(req.body);
    if (result.success) {
        return res.json({
            token: result.token
        })
    } else {
       next(result.errorCode);
    }
}

async function getMyUsername(req, res) {
    res.status(200).json({"username": req.user.username});
}

async function getPolicy(req, res) {
    res.contentType("text/html");
    return res.sendFile(policyPath);
}

async function getAchievements(req, res) {
    if (!req.query.userId) {
        return res.status(401).json({message: "incorrect data"});
    }
    const achievements = await Controller.getUserAchievementsById(req.query.userId);
    return res.json(achievements);
}

async function setFcmId(req, res) {
    if (!req.query.fcmId) {
        return res.status(401).json({message: ErrorCodes.INCORRECT_DATA});
    }
    await Controller.setFcmId(req.query.fcmId, req.user.userId);
    return res.json({
        message: SuccessCodes.SUCCESS
    })
}
module.exports = {
    login,
    register,
    registerModer,
    getMyUsername,
    getPolicy,
    getAchievements,
    setFcmId
};