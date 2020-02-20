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

async function getMyReferralInfo(req, res, next) {
    const result = await Controller.getMyReferralInfo(req.user);
    if (result.success) {
        return res.json({...result.ref})
    } else {
        next(result.message);
    }
}

async function uploadMeme(req, res, next) {
    const result = await Controller.uploadMeme(req.user, req.body.categories, req.body.photo);
    if (result.success) {
        return res.json({success: true,});
    } else {
        next(result.message);
    }
}

async function getUserUploads(req, res, next) {
    const userId = req.query.userId;
    const limit = req.query.limit;
    const offset = req.query.offset;
    if (!userId || !limit || !offset) {
        next(ErrorCodes.INCORRECT_DATA);
    }
    const result = await Controller.getUserUploads(userId, offset, limit, req.user);
    if (result.success) {
        res.json({
            success: true,
            uploads: result.uploads,
        });
    } else {
        next(result.message)
    }
}

async function createNoRegistrationUser(req, res, next) {
    const {username, password, email} = req.body;
    if (!username || !password || !email) {
        next(new Error(ErrorCodes.INCORRECT_DATA))
    }
    const result = await Controller.createNoRegistrationUser(username, password, email);
    if (result.success) {
        res.json({
            success: true
        });
    } else {
        next(new Error(result.errorCode));
    }
}

async function getNoRegistrationInfo(req, res, next) {
    const result = await Controller.loadNoRegistrationInfo();
    if (result.success) {
        res.json({
            success: true,
            user: result.user
        })
    } else {
        next(result.errorCode)
    }
}

module.exports = {
    login,
    register,
    registerModer,
    getMyUsername,
    getPolicy,
    getAchievements,
    setFcmId,
    getMyReferralInfo,
    uploadMeme,
    getUserUploads,
    createNoRegistrationUser,
    getNoRegistrationInfo
};