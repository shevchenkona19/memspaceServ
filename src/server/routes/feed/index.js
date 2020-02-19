const express = require('express');
const router = express.Router();
const feedMethods = require("./feed");
const auth = require("../../middleware/auth");
const passport = require('../../app').passport;
const Tracker = require("../../middleware/tracker");

router.get("/refreshMem", passport.authenticate('jwt', {session: false}), feedMethods.refreshMem);
router.get("/mainFeed", passport.authenticate('jwt', {session: false}), feedMethods.getMainFeed);
router.get("/categoriesFeed", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, Tracker.trackTime, feedMethods.getCategoriesFeed);
router.get("/categoryFeed", passport.authenticate('jwt', {session: false}), Tracker.trackTime, feedMethods.getCategoryFeed);
router.get("/hotFeed", passport.authenticate('jwt', {session: false}), Tracker.trackTime, feedMethods.getHotFeed);
router.get("/imgs", feedMethods.getImgs);
router.get("/userPhoto", feedMethods.getUserPhoto);
router.get("/mem", feedMethods.getMemById);
router.get("/searchUser", feedMethods.searchUsers);

module.exports = router;