const {main, login} = require("../../app");

function serveForToken(req, res) {
    if (req.tokenPresent) {
        if (req.user) {
            return res.sendFile(main);
        }
    }
    return res.sendFile(login);
}

module.exports = {
    serveForToken
};