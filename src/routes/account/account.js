const Controller = require("../../controllers/account");
const policyPath = require("../../app").policy;

async function login(req, res) {
    const result = await Controller.login(req.body);
    if (result.success) {
        return res.json({
            token: result.token,
            id: result.userId
        })
    } else {
        throw Error(result.errorCode)
    }
}

async function register(req, res) {
    const result = await Controller.register(req.body);
    if (result.success) {
        return res.json({
            id: result.userId,
            token: result.token
        })
    } else {
        throw Error(result.errorCode);
    }
}

async function registerModer(req, res) {
    const result = await Controller.registerModer(req.body);
    if (result.success) {
        return res.json({
            token: result.token
        })
    } else {
        throw Error(result.errorCode);
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

module.exports = {
    login,
    register,
    registerModer,
    getMyUsername,
    getPolicy,
    getAchievements
};