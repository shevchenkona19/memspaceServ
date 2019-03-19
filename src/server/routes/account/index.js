const express = require('express');
const router = express.Router();
const accountMethods = require("./account");
const auth = require("../../middleware/auth");
const passport = require('../../app').passport;

router.post("/login", accountMethods.login);
router.post("/register", accountMethods.register);
router.post("/registerModer", accountMethods.registerModer);
router.get("/myUsername", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, accountMethods.getMyUsername);
router.get("/policy", accountMethods.getPolicy);
router.get("/achievements", accountMethods.getAchievements);
router.post("/fcmId", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, accountMethods.setFcmId);
router.get("/myReferralInfo", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, accountMethods.getMyReferralInfo);
router.post("/uploadMeme", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, accountMethods.uploadMeme);
router.get("/userUploads", passport.authenticate('jwt', {session: false}), accountMethods.getUserUploads);

module.exports = router;