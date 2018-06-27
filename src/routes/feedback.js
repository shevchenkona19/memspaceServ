const express = require('express');
const router = express.Router();
const passport = require('../app').passport;
const Controller = require("../controllers/feedback");
const ErrorCodes = require("../constants/errorCodes");

router.post("/like", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accessLvl === -1) {
        return res.status(401).json({message: "unauthorized"});
    }
    if (!req.query.id) {
        return res.status(400).json({message: "incorrect query"});
    }
    const imageId = req.query.id;
    const userId = req.user.userId;
    try {
        const result = await Controller.postLike(userId, imageId);
        if (result.success) {
            return res.json(result.mem)
        } else {
            return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR})
        }
    } catch (e) {
        console.log(e.stack);
        return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR});
    }
});
router.post("/dislike", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accessLvl === -1) {
        return res.status(401).json({message: "unauthorized"});
    }
    if (!req.query.id) {
        return res.status(400).json({message: "incorrect query"});
    }
    const imageId = req.query.id;
    const userId = req.user.userId;
    try {
        const result = await Controller.postDislike(userId, imageId);
        if (result.success) {
            return res.json(result.mem)
        } else {
            return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR})
        }
    } catch (e) {
        console.log(e.stack);
        return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR});
    }
});
router.delete("/like", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accessLvl === -1) {
        return res.status(401).json({message: "unauthorized"});
    }
    if (!req.query.id) {
        return res.status(400).json({message: "incorrect query"});
    }
    const imageId = req.query.id;
    const userId = req.user.userId;
    try {
        const result = await Controller.deleteLike(userId, imageId);
        if (result.success) {
            return res.json(result.mem)
        } else {
            return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR})
        }
    } catch (e) {
        console.log(e.stack);
        return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR});
    }
});
router.delete("/dislike", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accessLvl === -1) {
        return res.status(401).json({message: "unauthorized"});
    }
    if (!req.query.id) {
        return res.status(400).json({message: "incorrect query"});
    }
    const imageId = req.query.id;
    const userId = req.user.userId;
    try {
        const result = await Controller.deleteDislike(userId, imageId);
        if (result.success) {
            return res.json(result.mem)
        } else {
            return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR})
        }
    } catch (e) {
        console.log(e.stack);
        return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR});
    }
});
router.post("/comment", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accessLvl === -1) {
        return res.status(401).json({message: "unauthorized"});
    }
    if (!req.query.id || !req.body.text) {
        return res.status(400).json({message: "incorrect query"});
    }
    const imageId = req.query.id;
    const userId = req.user.userId;
    const text = req.body.text;
    try {
        const result = await Controller.postComment(userId, imageId, text);
        if (result.success) {
            return res.json({message: result.message})
        } else {
            return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR})
        }
    } catch (e) {
        console.log(e.stack);
        return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR});
    }
});
router.get("/comments", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accessLvl === -1) {
        return res.status(401).json({message: "unauthorized"});
    }
    if (!req.query.id || !req.query.count || !req.query.offset) {
        return res.status(400).json({message: "incorrect query"});
    }
    const imageId = req.query.id;
    const count = req.query.count;
    const offset = req.query.offset;
    try {
        const result = await Controller.getComments(req.user.userId, imageId, count, offset);
        if (result.success) {
            return res.json({
                comments: result.comments,
                count: result.count
            });
        } else {
            return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR});
        }
    } catch (e) {
        console.log(e.stack);
        return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR});
    }
});

module.exports = router;