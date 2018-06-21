const jwt = require('jsonwebtoken');
const db = require('../model/index');
const fs = require('fs');
const bcrypt = require('bcrypt-nodejs');
const express = require('express');
const router = express.Router();
const passport = require('../app').passport;
const jwtOptions = require('../app').jwtOptions;
const controller = require("../controllers/account");

router.post('/login', async (req, res) => {
    try {
        const result = await controller.login(req.body);
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
        res.status(500).json({
            message: e.message
        })
    }
});
router.post('/register', async (req, res) => {
    try {
        const result = await controller.register(req.body);
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
        res.status(500).json({
            message: e.message
        })
    }
});

router.get("/myUsername", passport.authenticate('jwt', {session: false}), (req, res) => {
    if (req.user.accesslvl !== -1) {
        return res.status(200).json({"username": req.user.username});
    }
    return res.status(400).json({message: "unregistered"});
});

router.get("/test", async (req, res) => {
    let data = await db.query('SELECT categoryid, categoryname FROM categories');
    console.log(data);
    console.log(data.rows[0]);
    return res.status(400).json({message: "unregistered"});
});

module.exports = router;