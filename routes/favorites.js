const db = require('../model');
const express = require('express');
const router = express.Router();
const passport = require('../app').passport;

router.post("/addToFavorites", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(401).json({message: 'unauthorized'})
    }
    if (!req.query.id) {
        return res.status(401).json({message: "incorrect data"});
    }
    const id = req.query.id;
    let favArr = [];
    const data = await db.query('SELECT favorites FROM users WHERE userid = $1', [req.user.userid]);
    if (data.rows[0]) {
        favArr = JSON.parse(data.rows[0].favorites);
        for (let i = 0; i < favArr.length; i++) {
            if (favArr[i] === id) return res.status(200).json({message: "already favorite"});
        }
        favArr.push(id);
    } else {
        favArr.push(id);
    }
    await db.query(`UPDATE users SET favorites = '${JSON.stringify(favArr)}' WHERE userid = ${req.user.userid}`);
    res.status(200).json({message: "200"});
});
router.get("/allFavorites", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(401).json({message: 'unauthorized'})
    }
    const data = await db.query('SELECT favorites FROM users WHERE userid = $1', [req.user.userid]);
    if (data.rows[0]) {
        return res.json({favorites: JSON.parse(data.rows[0].favorites)});
    } else {
        return res.json({favorites: []})
    }
});
router.delete("/removeFromFavorites", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(401).json({message: 'unauthorized'})
    }
    if (!req.query.id) {
        return res.status(401).json({message: "incorrect data"});
    }
    const id = req.query.id;
    const data = await db.query('SELECT favorites FROM users WHERE userid = $1', [req.user.userid]);
    let favArr = JSON.parse(data.rows[0].favorites);
    if (favArr.indexOf(id) !== -1) {
        favArr = delete favArr[id]
    } else res.status(200).json({message: "not a favorite"});
    await db.query(`UPDATE users SET favorites = '${JSON.stringify(favArr)}' WHERE userid = ${req.user.userid}`);
    res.status(200).json({message: "200"});
});

module.exports = router;