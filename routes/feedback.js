const db = require('../model');
const express = require('express');
const router = express.Router();
const passport = require('../app').passport;

router.post("/like", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(401).json({message: "unauthorized"});
    }
    console.warn("Query: " + req.query);
    console.warn("Body: " + req.body);
    if (!req.body.id) {
        return res.status(400).json({message: "incorrect query"});
    }
    const imageId = req.body.id;
    const userId = req.user.userid;
    const likes = await db.query('SELECT * FROM likes WHERE userId = $1 AND imageId = $2', [userId, imageId]);
    if (likes.rows[0]) {
        if (likes.rows[0].opinion === 0) {
            await delDislike(userId, imageId);
            await setLike(userId, imageId);
        }
    } else {
        await setLike(userId, imageId);
    }
    res.status(200).json({message: "200"});
});
router.post("/dislike", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(401).json({message: "unauthorized"});
    }
    if (!req.body.id) {
        return res.status(400).json({message: "incorrect query"});
    }
    const imageId = req.body.id;
    const userId = req.user.userid;
    const likes = await db.query('SELECT * FROM likes WHERE userId = $1 AND imageId = $2', [userId, imageId]);
    if (likes.rows[0]) {
        if (likes.rows[0].opinion === 1) {
            await delLike(userId, imageId);
            await setDislike(userId, imageId);
        }
    } else {
        await setDislike(userId, imageId);
    }
    res.status(200).json({message: "200"});
});
router.delete("/like", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(401).json({message: "unauthorized"});
    }
    if (!req.body.id) {
        return res.status(400).json({message: "incorrect query"});
    }
    const imageId = req.body.id;
    const userId = req.user.userid;
    const data = await db.query('SELECT * FROM likes WHERE userId = $1 AND imageId = $2', [userId, imageId]);
    if (data.rows[0]) {
        if (data.rows[0].opinion === 1) {
            await delLike(userId, imageId);
            return res.status(200).json({message: "200"});
        }
    }
    return res.status(200).json({message: "200"});
});
router.delete("/dislike", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(401).json({message: "unauthorized"});
    }
    if (!req.body.id) {
        return res.status(400).json({message: "incorrect query"});
    }
    const imageId = req.body.id;
    const userId = req.user.userid;
    const likes = await db.query('SELECT * FROM likes WHERE userId = $1 AND imageId = $2', [userId, imageId])
    if (likes.rows[0]) {
        if (likes.rows[0].opinion === 0) {
            await delDislike(userId, imageId);
            return res.status(200).json({message: "200"});
        }
    }
    return res.status(200).json({message: "200"});
});
router.post("/comment", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(401).json({message: "unauthorized"});
    }
    if (!(req.body.id && req.body.text)) {
        return res.status(400).json({message: "incorrect query"});
    }
    const imageId = req.body.id;
    const userId = req.user.userid;
    const text = req.body.text;
    const date = new Date().toLocaleString();
    await db.query('INSERT INTO comments(userId, imageId, text, date) VALUES($1, $2, $3, $4)', [userId, imageId, text, date])
    return res.status(200).json({message: "200"});
});
router.get("/comments", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accesslvl === -1) {
        return res.status(401).json({message: "unauthorized"});
    }
    if (!(req.query.id && req.query.count && req.query.offset)) {
        return res.status(400).json({message: "incorrect query"});
    }
    const imageId = req.query.id;
    const count = req.query.count;
    const offset = req.query.offset;
    const comments = await db.query('SELECT username, text, date FROM comments INNER JOIN users ON comments.userId = users.userId WHERE imageId = $1 LIMIT $2 OFFSET $3', [imageId, count, offset])
    res.status(200).json({"comments": comments.rows});
});

var setLike = async (userId, imageId) => {
    await db.query('INSERT INTO likes(userId, imageId, opinion) VALUES($1, $2, $3)', [userId, imageId, 1]);
    await db.query('UPDATE images SET likes = likes+1 WHERE imageId = $1', [imageId]);
};
var delLike = async (userId, imageId) => {
    await db.query('DELETE FROM likes WHERE userId = $1 AND imageId = $2', [userId, imageId]);
    await db.query('UPDATE images SET likes = likes-1 WHERE imageId = $1', [imageId]);
};
var setDislike = async (userId, imageId) => {
    await db.query('INSERT INTO likes(userId, imageId, opinion) VALUES($1, $2, $3)', [userId, imageId, 0]);
    await db.query('UPDATE images SET dislikes = dislikes+1 WHERE imageId = $1', [imageId]);
};
var delDislike = async (userId, imageId) => {
    await db.query('DELETE FROM likes WHERE userId = $1 AND imageId = $2', [userId, imageId]);
    await db.query('UPDATE images SET dislikes = dislikes-1 WHERE imageId = $1', [imageId]);
};

module.exports = router;