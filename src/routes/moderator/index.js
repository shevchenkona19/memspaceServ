const express = require('express');
const router = express.Router();
const moderatorMethods = require("./moderator");
const auth = require("../../middleware/auth");
const passport = require('../../app').passport;

router.post("/createCategory", passport.authenticate('jwt', {session: false}), auth.requireSuperAdmin, moderatorMethods.createCategory);

router.get("/getImages", moderatorMethods.getImages);

router.delete("/category", passport.authenticate('jwt', {session: false}), auth.requireSuperAdmin, moderatorMethods.deleteCategory);

router.get("/newMem", passport.authenticate('jwt', {session: false}), auth.requireModer, moderatorMethods.getNewMem);

router.post("/discardMem", passport.authenticate('jwt', {session: false}), auth.requireModer, moderatorMethods.discardMem);

router.post("/mem", passport.authenticate('jwt', {session: false}), auth.requireModer, moderatorMethods.postMem);

router.post("/clearMemes", moderatorMethods.clearMemes);

module.exports = router;