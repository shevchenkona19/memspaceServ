const db = require('../model/index');
const express = require('express');
const router = express.Router();
const passport = require('../app').passport;
const Controller = require("../controllers/favorites");
const ErrorCodes = require("../constants/errorCodes");

router.post("/addToFavorites", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(401).json({message: 'unauthorized'})
    }
    if (!req.query.id) {
        return res.status(401).json({message: "incorrect data"});
    }
    try {
        const result = await Controller.addToFavorites(req.user.userid, req.query.id);
        if (result.success) {
            return res.json({message: result.message});
        } else {
            return res.status(500).json({
                message: result.errorCode
            })
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({message: "BD error"});
    }
});
router.get("/allFavorites", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(401).json({message: 'unauthorized'})
    }
    try {
        const result = await Controller.getAllFavorites(req.user.userId);
        if (result.success) {
            return res.json({
                favorites: result.favorites
            })
        } else {
            return res.status(500).json({
                message: ErrorCodes.INTERNAL_ERROR
            })
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR});
    }
});
router.delete("/removeFromFavorites", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(401).json({message: 'unauthorized'})
    }
    if (!req.query.id) {
        return res.status(401).json({message: "incorrect data"});
    }
    try {
        const result = await Controller.removeFromFavorites(req.user.userid, req.query.id);
        if (result.success) {
            return res.json({
                message: result.message
            })
        } else {
            return res.status(500).json({
                message: ErrorCodes.INTERNAL_ERROR
            })
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR});
    }
});
router.get("/isFavourite", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(401).json({message: 'unauthorized'})
    }
    if (!req.query.id) {
        return res.status(401).json({message: "incorrect data"});
    }
    try {
        const result = await Controller.isFavorite(req.user.userid, req.query.id);
        if (result.success) {
            return res.json({
                isFavourite: result.isFavorite
            })
        } else {
            return res.status(500).json({
                message: ErrorCodes.INTERNAL_ERROR
            })
        }
    } catch (e) {
        console.log(e.stack);
        res.status(500).json({message: ErrorCodes.INTERNAL_ERROR})
    }
});

module.exports = router;