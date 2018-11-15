const express = require('express');
const router = express.Router();
const favoritesMethods = require("./favorites");

router.get("/allFavorites", favoritesMethods.getAllFavorites);

module.exports = router;