const express = require('express');
const router = express.Router();
const reportsMethods = require("./reports");
const auth = require("../../middleware/auth");
const passport = require('../../app').passport;

router.post("/report", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, reportsMethods.postReport);
router.delete("/report", passport.authenticate('jwt', {session: false}), auth.requireModer, reportsMethods.deleteReport);
router.get("/reports", passport.authenticate('jwt', {session: false}), auth.requireModer, reportsMethods.getAllReports);
router.delete("/meme", passport.authenticate('jwt', {session: false}), auth.requireModer, reportsMethods.deleteMeme);
router.post("/banUser", passport.authenticate('jwt', {session: false}), auth.requireModer, reportsMethods.banUser);

module.exports = router;