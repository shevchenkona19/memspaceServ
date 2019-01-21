const express = require('express');
const router = express.Router();
const configMethods = require("./config");
const auth = require("../../middleware/auth");
const passport = require('../../app').passport;

router.get("/categories", passport.authenticate('jwt', {session: false}), configMethods.getCategories);
router.post("/selectedCategories", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, configMethods.setSelectedCategories);
router.post("/photo", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, configMethods.postPhoto);
router.get("/personalCategories", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, configMethods.getPersonalCategories);
router.get("/test", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, configMethods.getTest);

module.exports = router;