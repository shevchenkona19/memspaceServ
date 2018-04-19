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
router.get("/mainFeed", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (!req.query.count || !req.query.offset) {
        return res.status(400).json({message: "incorrect query"})
    }
    const count = req.query.count;
    const offset = req.query.offset;
    const data = await db.query('SELECT images.imageid, images.source, images.height, images.width, likes, dislikes, likes.opinion AS opinion '
        + 'FROM images LEFT OUTER JOIN likes ON likes.imageid = images.imageid AND likes.userid = $1 '
        + 'ORDER BY imageid DESC LIMIT $2 OFFSET $3', [req.user.userid, count, offset]);
    return res.status(200).json({memes: data.rows});
});
router.get("/categoriesFeed", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (!req.query.count || !req.query.offset || !req.user.accesslvl === -1) {
        return res.status(400).json({message: "incorrect query"})
    }
    const count = req.query.count;
    const offset = req.query.offset;
    const data = await db.query('SELECT categoryname FROM categories');
    if (!data.rows[0]) {
        return res.status(400).json({message: "no categories"});
    }
    let catsString = '';
    for (let i = 0; i < data.rows.length; i++) {
        catsString += `"` + data.rows[i].categoryname + `"`;
        if (i !== data.rows.length - 1) {
            catsString += ', ';
        }
    }
    const categories = await db.query(`SELECT ${catsString} FROM users WHERE userid = ${req.user.userid}`);
    if (!data.rows[0]) {
        return res.status(200).json({memes: {}});
    }
    const obj = categories.rows[0];
    let str = '';
    for (let prop in obj) {
        if (obj[prop].toString() === '1') {
            str += `"` + prop + `"` + " = '" + obj[prop] + "'";
            str += ' OR ';
        }
    }
    str = str.substring(0, str.length - 4);
    const memes = await db.query('SELECT images.imageid, images.source, images.height, images.width, likes, dislikes, likes.opinion AS opinion '
        + `FROM images LEFT OUTER JOIN likes ON likes.imageid = images.imageid AND likes.userid = $1 WHERE ${str} `
        + 'ORDER BY imageid DESC LIMIT $2 OFFSET $3', [req.user.userid, count, offset])
    if (memes.rows[0]) {
        return res.status(200).json({memes: memes.rows});
    } else return res.status(200).json({memes: {}});
});
router.get("/categoryFeed", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (!req.query.count || !req.query.offset || !req.query.categoryName) {
        return res.status(400).json({message: "incorrect query"});
    }
    const count = req.query.count;
    const offset = req.query.offset;
    const categoryName = req.query.categoryName;
    const memes = await db.query(`SELECT images.imageid, images.source, images.height, images.width, likes, dislikes, likes.opinion AS opinion `
        + `FROM images LEFT OUTER JOIN likes ON likes.imageid = images.imageid AND likes.userid = ${req.user.userid} WHERE ${categoryName} = '1' `
        + `ORDER BY imageid DESC LIMIT ${count} OFFSET ${offset}`);
    if (memes.rows[0]) {
        return res.json({memes: memes.rows});
    } else return res.json({memes: {}});
});
router.get("/hotFeed", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (!req.query.count || !req.query.offset || !req.query.categoryName) {
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
    } else return res.json({memes: {}});
});
router.get("/userPhoto", async (req, res) => {
    if (!req.query.targetUsername) {
        return res.status(400).json({message: "incorrect query"});
    }
    const targetUsername = req.query.targetUsername;
    const image = await db.query('SELECT imagedata FROM users WHERE username = $1', [targetUsername])
    if (image.rows[0]) {
        res.contentType('image/*');
        return res.end(image.rows[0].imagedata, 'binary');
    } else return res.status(400).json({message: "no image found"});
});

module.exports = router;