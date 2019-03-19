const express = require('express');
const router = express.Router();
const reportsMethods = require("./reports");
const auth = require("../../middleware/auth");
const passport = require('../../app').passport;

router.post("/report", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, reportsMethods.postReport);
router.delete("/report", passport.authenticate('jwt', {session: false}), auth.requireModer, reportsMethods.deleteReport);

module.exports = router;