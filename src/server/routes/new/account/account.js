const Controller = require('../../../controllers/account');

async function getUsername(req, res) {
    const result = await Controller.getUsername(req.query.userId);
    if (result.success) {
        return res.json({
            username: result.username
        })
    } else {
        throw Error(result.errorCode);
    }
}

module.exports = {
    getUsername
};