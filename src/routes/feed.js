const express = require('express');
const router = express.Router();
const passport = require('../app').passport;
const Controller = require("../controllers/feed");
const ErrorCodes = require("../constants/errorCodes");

router.get("/refreshMem", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (!req.query.memId) {
        return res.status(400).json({message: 'incorrect query'})
    }
    try {
        const result = await Controller.refreshMem(req.query.memId, req.user.userId);
        if (result.success) {
            return res.json(result.memEntity);
        } else {
            return res.status(400).json({message: ErrorCodes.INTERNAL_ERROR});
        }
    } catch (e) {
        console.log(e.stack);
        return res.status(400).json({
            message: e.message
        })
    }
});
router.get("/mainFeed", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (!req.query.count || !req.query.offset) {
        return res.status(400).json({message: "incorrect query"})
    }
    try {
        const result = await Controller.getMainFeed(req.user.userId, req.query.count, req.query.offset);
        if (result.success) {
            return res.json({memes: result.memes});
        } else {
            return res.status(400).json({message: ErrorCodes.INTERNAL_ERROR});
        }
    } catch (e) {
        console.log(e.stack);
        return res.status(400).json({
            message: e.message
        });
    }
});
router.get("/categoriesFeed", passport.authenticate('jwt', {session: false}), async (req, res) => {
    const count = req.query.count;
    const offset = req.query.offset;
    if (!count || !offset || !req.user.accessLvl === -1) {
        return res.status(400).json({message: "incorrect query"})
    }
    try {
        const result = await Controller.getCategoriesFeed(req.user.userId, count, offset);
        if (result.success) {
            return res.json({memes: result.memes});
        } else {
            return res.status(400).json({message: ErrorCodes.INTERNAL_ERROR});
        }
    } catch (e) {
        console.log(e.stack);
        return res.status(400).json({
            message: e.message
        });
    }
});
router.get("/categoryFeed", passport.authenticate('jwt', {session: false}), async (req, res) => {
    const count = req.query.count;
    const offset = req.query.offset;
    const categoryId = req.query.categoryId;
    if (!count || !offset || !categoryId) {
        return res.status(400).json({message: "incorrect query"});
    }
    try {
        const result = await Controller.getCategoryFeed(req.user.userId, categoryId, count, offset);
        if (result.success) {
            return res.json({memes: result.memes});
        } else {
            return res.status(400).json({message: ErrorCodes.INTERNAL_ERROR});
        }
    } catch (e) {
        console.log(e.stack);
        return res.status(400).json({
            message: e.message
        });
    }
});
router.get("/hotFeed", passport.authenticate('jwt', {session: false}), async (req, res) => {
    const count = req.query.count;
    const offset = req.query.offset;
    if (!count || !offset) {
        return res.status(400).json({message: "incorrect query"});
    }
    try {
        const result = await Controller.getHotFeed(req.user.userId, count, offset);
        if (result.success) {
            return res.json({memes: result.memes});
        } else {
            return res.status(400).json({message: ErrorCodes.INTERNAL_ERROR});
        }
    } catch (e) {
        console.log(e.stack);
        return res.status(400).json({
            message: e.message
        });
    }
});

router.get("/imgs", async (req, res) => {
    if (!req.query.id) {
        return res.status(400).json({message: "incorrect query"});
    }
    try {
        const result = await Controller.getImage(req.query.id);
        if (result.success) {
            res.contentType('image/*');
            return res.end(result.imageData, 'binary');
        } else {
            return res.status(400).json({message: ErrorCodes.INTERNAL_ERROR});
        }
    } catch (e) {
        console.log(e.stack);
        return res.status(400).json({message: e.message});
    }
});

router.get("/userPhoto", async (req, res) => {
    const targetUsername = req.query.targetUsername;
    if (!targetUsername) {
        return res.status(400).json({message: "incorrect query"});
    }
    try {
        const result = await Controller.getUserPhoto(targetUsername);
        if (result.success) {
            res.contentType('image/*');
            return res.end(result.image, 'binary');
        } else {
            return res.status(400).json({message: ErrorCodes.INTERNAL_ERROR});
        }
    } catch (e) {
        console.log(e.stack);
        return res.status(400).json({
            message: e.message
        });
    }
});

module.exports = router;