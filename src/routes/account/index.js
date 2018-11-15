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

module.exports = router;