const express = require('express');
const router = express.Router();
const infoMethods = require("./info");
const auth = require("../../middleware/auth");
const passport = require('../../app').passport;

router.post("/users", passport.authenticate('jwt', {session: false}), auth.requireAdmin, infoMethods.getUsersInfo);
router.get("/memes", passport.authenticate('jwt', {session: false}), auth.requireAdmin, infoMethods.getMemesInfo);

module.exports = router;