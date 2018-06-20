const db = require('../model/index');
const express = require('express');
const router = express.Router();
const passport = require('../../app').passport;

router.post("/addToFavorites", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(401).json({message: 'unauthorized'})
    }
    if (!req.query.id) {
        return res.status(401).json({message: "incorrect data"});
    }
    try {
        await db.query(`INSERT INTO favorites(userid, imageid) VALUES($1, $2)`, [req.user.userid, req.query.id]);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({message: "BD error"});
    }
    res.status(200).json({message: "200"});
});
router.get("/allFavorites", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(401).json({message: 'unauthorized'})
    }
    try {
        const data = await db.query('SELECT imageid FROM favorites WHERE userid = $1', [req.user.userid]);
        if (data.rows[0]) {
            return res.json({favorites: data.rows});
        } else {
            return res.json({favorites: []})
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({message: "BD error"});
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
        await db.query(`DELETE FROM favorites WHERE userid = $1 AND imageid = $2`, [req.user.userid, req.query.id]);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({message: "BD error"});
    }
    res.status(200).json({message: "200"});
});
router.get("/isFavourite", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(401).json({message: 'unauthorized'})
    }
    if (!req.query.id) {
        return res.status(401).json({message: "incorrect data"});
    }
    try {
        const isFavourite = (await db.query("SELECT * FROM favorites WHERE userid = $1 AND imageid = $2", [req.user.userid, req.query.id])).rows.length > 0;
        return res.status(200).json({isFavourite});
    } catch (e) {
        console.log(e.stack);
        res.status(500).json({message: "DB error"})
    }
});

module.exports = router;