const express = require('express');
const router = express.Router();
const passport = require('../app').passport;
const images = require("../app").imageFolder;
const Controller = require("../controllers/config");
const ErrorCodes = require("../constants/errorCodes");
const SuccessCodes = require("../constants/successCodes");
const fs = require("fs");

router.get("/categories", passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const categories = await Controller.getCategories();
        return res.json({
            categories
        });
    } catch (e) {
        console.log(e.stack);
        return res.status(500).json({
            message: ErrorCodes.INTERNAL_ERROR
        })
    }
});

router.post("/selectedCategories", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accessLvl === -1) {
        return res.status(400).json({message: "unauthorized"});
    }
    try {
        await Controller.saveCategories(req.body, req.user.userId);
        res.json({
            message: SuccessCodes.SUCCESS
        })
    } catch (e) {
        console.log(e.stack);
        res.status(500).json({
            message: ErrorCodes.INTERNAL_ERROR
        })
    }
});

router.post("/photo", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accessLvl === -1) {
        return res.status(400).json({message: "unauthorized"});
    }
    if (!req.body.photo) {
        return res.status(401).json({message: 'incorrect quarry'})
    }
    const photo = req.body.photo;
    const mime = req.body.mime;
    const filename = images + "/users/" + req.user.userId + req.user.username + mime;
    try {
        const result = await Controller.postPhoto(req.user.userId, filename, photo);
        if (result.success) {
            return res.json({message: SuccessCodes.SUCCESS})
        } else {
            return res.json({message: ErrorCodes.INTERNAL_ERROR})
        }
    } catch (e) {
        console.log(e.stack);
        return res.json({message: ErrorCodes.INTERNAL_ERROR})
    }
});

router.get("/personalCategories", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accessLvl === -1) {
        return res.status(400).json({message: "unauthorized"});
    }
    try {
        const result = await Controller.getPersonalCategories(req.user.userId);
        if (result.success) {
            res.json({
                categories: result.categories
            });
        }
    } catch (e) {
        console.log(e.stack);
        res.status(500).json({
            message: ErrorCodes.INTERNAL_ERROR
        });
    }
});

router.get("/test", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accessLvl === -1) {
        return res.status(400).json({message: "unauthorized"});
    }
    try {
        const result = await Controller.getTest();
        if (result.success) {
            res.json({
                test: result.test
            })
        }
    } catch (e) {
        console.log(e.stack);
        res.status(500).json({
            message: ErrorCodes.INTERNAL_ERROR
        })
    }
});

module.exports = router;