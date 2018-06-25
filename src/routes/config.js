const express = require('express');
const router = express.Router();
const passport = require('../app').passport;
const base64 = require('js-base64').Base64;
const Controller = require("../controllers/config");
const ErrorCodes = require("../constants/errorCodes");
const SuccessCodes = require("../constants/successCodes");

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
    if (req.user.accesslvl === -1) {
        return res.status(400).json({message: "unauthorized"});
    }
    try {
        await Controller.saveCategories(req.body, req.user.userid);
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
    if (req.user.accesslvl === -1) {
        return res.status(400).json({message: "unauthorized"});
    }
    if (!req.body.photo) {
        return res.status(401).json({message: 'incorrect quarry'})
    }
    const photo = base64.atob(req.body.photo);
    //await db.query('UPDATE users SET imagedata = $1 WHERE userid = $2', [photo, req.user.userid]);
    return res.status(200).json({message: "200"})
});

router.get("/personalCategories", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(400).json({message: "unauthorized"});
    }
    try {
        const result = await Controller.getPersonalCategories(req.user.userid);
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
    if (req.user.accesslvl === -1) {
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