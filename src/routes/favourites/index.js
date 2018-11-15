const express = require('express');
const router = express.Router();
const favouritesMethods = require("./favorites");
const auth = require("../../middleware/auth");
const passport = require('../../app').passport;

router.post("/addToFavorites", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, favouritesMethods.addToFavorites);

router.get("/allFavorites", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, favouritesMethods.getAllFavorites);

router.delete("/removeFromFavorites", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, favouritesMethods.removeFromFavorites);

router.get("/isFavourite", passport.authenticate('jwt', {session: false}), auth.allButNotRegistered, favouritesMethods.isFavourite);

module.exports = router;