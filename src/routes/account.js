const db = require('../model/index').getDb();
const express = require('express');
const router = express.Router();
const passport = require('../app').passport;
const Controller = require("../controllers/account");
const policyPath = require("../app").policy;

router.post('/login', async (req, res) => {
    try {
        const result = await Controller.login(req.body);
        if (result.success) {
            return res.json({
                token: result.token,
                id: result.userId
            })
        } else {
            return res.json({
                message: result.errorCode
            })
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: e.message
        })
    }
});
router.post('/register', async (req, res) => {
    try {
        const result = await Controller.register(req.body);
        if (result.success) {
            return res.json({
                id: result.userId,
                token: result.token
            })
        } else {
            return res.json({
                message: result.errorCode
            })
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: e.message
        })
    }
});

router.post('/registerModer', async (req, res) => {
    try {
        const result = await Controller.registerModer(req.body);
        if (result.success) {
            return res.json({
                token: result.token
            })
        } else {
            return res.status(500).json({
                message: result.errorCode
            })
        }
    } catch (e) {
        console.error(e);
    }
});

router.get("/username", async (req, res) => {
    try {
        const result = await Controller.getUsername(req.query.userId);
        if (result.success) {
            return res.json({
                username: result.username
            })
        } else {
            return res.status(500).json({
                message: result.errorCode
            })
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: e
        })

    }
});

router.get("/policy", (req, res) => {
    res.contentType("text/html");
    return res.sendFile(policyPath);
});

router.get("/achievements", async (req, res) => {
    if (!req.query.userId) {
        return res.status(401).json({message: "incorrect data"});
    }
    try {
        const achievements = await Controller.getUserAchievementsById(req.query.userId);
        return res.json(achievements);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: e.message
        })
    }
});

router.get("/test", async (req, res) => {
    let data = await db.query('SELECT categoryid, categoryname FROM categories');
    console.log(data);
    console.log(data.rows[0]);
    return res.status(400).json({message: "unregistered"});
});

module.exports = router;