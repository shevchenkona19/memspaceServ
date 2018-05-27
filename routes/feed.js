const db = require('../model');
const express = require('express');
const router = express.Router();
const passport = require('../app').passport;
//let fs = require('fs');

router.get("/imgs", async (req, res) => {
    if (!req.query.id) {
        return res.status(400).json({message: "incorrect query"});
    }
    const id = req.query.id;
    const data = await db.query('SELECT imagedata FROM images WHERE imageId = $1', [id])
    if (data.rows[0]) {
        res.contentType('image/*');
        return res.end(data.rows[0].imagedata, 'binary');
    } else return res.status(400).json({message: "no image found"});
});
router.get("/refreshMem", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (!req.query.memId) {
        return res.status(400).json({message: 'incorrect query'})
    }
    let isFavorite = false;
    const memId = req.query.memId;
    const allFavorites = await db.query('SELECT imageid FROM favorites WHERE userid = $1', [req.user.userid]);
    for (let i = 0; i < allFavorites.rows.length; i++) {
        if (allFavorites.rows[i].imageid == memId) {
            isFavorite = true;
            break;
        }
    }
    const data = await db.query('SELECT images.likes, images.dislikes, likes.opinion AS opinion FROM images LEFT OUTER JOIN likes ON likes.imageid = images.imageid WHERE images.imageid = $1', [memId])
    const obj = {...data.rows[0], isFavorite};
    console.warn(obj);
    if (data.rows[0]) {
        return res.status(200).json(obj)
    } else return res.status(401).json({message: 'no such mem'})
});
router.get("/mainFeed", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (!req.query.count || !req.query.offset) {
        return res.status(400).json({message: "incorrect query"})
    }
    const count = req.query.count;
    const offset = req.query.offset;
    const data = await db.query('SELECT images.imageid, images.source, images.height, images.width, likes, dislikes, likes.opinion AS opinion '
        + 'FROM images LEFT OUTER JOIN likes ON likes.imageid = images.imageid AND likes.userid = $1 '
        + 'ORDER BY imageid DESC LIMIT $2 OFFSET $3', [req.user.userid, count, offset]);
    return res.status(200).json({memes: data.rows ? data.rows : []});
});
router.get("/categoriesFeed", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (!req.query.count || !req.query.offset || !req.user.accesslvl === -1) {
        return res.status(400).json({message: "incorrect query"})
    }
    const count = req.query.count;
    const offset = req.query.offset;
    let catstr = '';
    try {
        const selCats = await db.query('SELECT categoryid FROM usersCategories WHERE userid = $1', [req.user.userid]);
        selCats.rows.forEach(cat => catstr += `imagesCategories.categoryid = ` + cat.categoryid + ` OR `);
        catstr = catstr.substring(0, catstr.length - 4);
        const memes = await db.query(`SELECT images.imageid, images.source, images.height, images.width, likes, dislikes, likes.opinion AS opinion FROM images `
            + `LEFT OUTER JOIN likes ON likes.imageid = images.imageid AND likes.userid = $1 `
            + `WHERE EXISTS (SELECT * FROM imagesCategories WHERE images.imageid = imagesCategories.imageid AND (${catstr})) `
            + `ORDER BY imageid DESC LIMIT $2 OFFSET $3`, [req.user.userid, count, offset]);
        if (memes.rows[0]) {
            return res.status(200).json({memes: memes.rows});
        } else return res.status(200).json({memes: []});
    }
    catch (err) {
        console.log(err.stack);
        return res.status(500).json({message: "BD error"});
    }

});
router.get("/categoryFeed", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (!req.query.count || !req.query.offset || !req.query.categoryid) {
        return res.status(400).json({message: "incorrect query"});
    }
    const count = req.query.count;
    const offset = req.query.offset;
    const categoryid = req.query.categoryid;
    let memes;
    try {
        memes = await db.query(`SELECT images.imageid, images.source, images.height, images.width, likes, dislikes, likes.opinion AS opinion `
            + `FROM images LEFT OUTER JOIN likes ON likes.imageid = images.imageid AND likes.userid = ${req.user.userid} WHERE `
            + `EXISTS (SELECT * FROM imagesCategories WHERE images.imageid = imagesCategories.imageid AND categoryid = ${categoryid}) `
            + `ORDER BY imageid DESC LIMIT ${count} OFFSET ${offset}`);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({message: "BD error"});
    }
    if (memes.rows[0]) {
        return res.json({memes: memes.rows});
    } else return res.json({memes: []});
});
router.get("/hotFeed", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (!req.query.count || !req.query.offset) {
        return res.status(400).json({message: "incorrect query"});
    }
    const count = req.query.count;
    const offset = req.query.offset;
    const filter = process.env.HOTFILTER;
    const memes = await db.query('SELECT images.imageid, images.source, images.height, images.width, likes, dislikes, likes.opinion AS opinion '
        + 'FROM images LEFT OUTER JOIN likes ON likes.imageid = images.imageid AND likes.userid = $1 WHERE likes >= $2 '
        + 'ORDER BY imageid DESC LIMIT $3 OFFSET $4', [req.user.userid, filter, count, offset])
    if (memes.rows[0]) {
        return res.json({memes: memes.rows});
    } else return res.json({memes: []});
});
router.get("/userPhoto", async (req, res) => {
    if (!req.query.targetUsername) {
        return res.status(400).json({message: "incorrect query"});
    }
    const targetUsername = req.query.targetUsername;
    const image = await db.query('SELECT imagedata FROM users WHERE username = $1', [targetUsername]);
    if (image.rows[0]) {
        res.contentType('image/*');
        return res.end(image.rows[0].imagedata, 'binary');
    } else return res.status(400).json({message: "no image found"});
});

module.exports = router;