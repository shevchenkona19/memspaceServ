async function trackTime(req, res, next) {
    const user = req.user;
    user.lastVisited = Date.now();
    await user.save();
    next();
}

module.exports = {
    trackTime
};