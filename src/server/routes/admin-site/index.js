const express = require('express');
const router = express.Router();
const auth = require("../../middleware/auth");
const passport = require('../../app').passport;
const admin = require("./admin-site");

router.get("/*", auth.checkToken, (req, res, next) => {
    if (req.tokenPresent) {
        req.headers.authorization = "jwt " + req.cookies.token;
        passport.authenticate("jwt", {session: false})(req, res, next);
    } else next();
}, admin.serveForToken);

module.exports = router;