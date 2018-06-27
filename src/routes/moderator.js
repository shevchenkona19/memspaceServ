const express = require('express');
const router = express.Router();
const passport = require('../app').passport;
const ErrorCodes = require("../constants/errorCodes");
const Controller = require("../controllers/moderator");

router.post("/createCategory", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accessLvl < 2) {
        return res.status(401).json({message: 'unauthorized'})
    }
    if (!req.body.categoryName) {
        return res.status(400).json({message: "incorrect query"});
    }
    const categoryName = req.body.categoryName;
    try {
        const result = await Controller.createCategory(categoryName);
        if (result.success) {
            return res.json({message: result.message});
        } else {
            return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR});
        }
    } catch (e) {
        console.log(e.stack);
        return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR});
    }
});
router.get("/getImages", async (req, res) => {
    if (!req.query.offset) {
        return res.status(400).json({message: "incorrect data"});
    }
    let offset = req.query.offset;

    await require('../vk/api')(offset);
    return res.status(200).json({message: "200"});
});
router.delete("/category", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accessLvl < 2) {
        return res.status(401).json({message: 'unauthorized'})
    }
    if (!req.query.id) {
        return res.status(400).json({message: "incorrect data"});
    }
    const id = req.query.id;
    try {
        const result = await Controller.deleteCategory(id);
        if (result.success) {
            return res.json({message: result.message});
        } else {
            return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR});
        }
    } catch (e) {
        console.log(e.stack);
        return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR});
    }
});
router.get("/newMem", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accessLvl < 1) {
        return res.status(401).json({message: 'unauthorized'})
    }
    try {
        const result = await Controller.getNewMem();
        if (result.success) {
            return res.json(result.mem);
        } else {
            return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR});
        }
    } catch (e) {
        console.log(e.stack);
        return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR});
    }
});
router.post("/discardMem", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (req.user.accessLvl < 1) {
        return res.status(401).json({message: 'unauthorized'})
    }
    if (!req.query.id) {
        return res.status(400).json({message: 'incorrect quarry'})
    }
    const id = req.query.id;
    try {
        const result = await Controller.discardMem(id);
        if (result.success) {
            return res.json({message: result.message});
        } else {
            return res.status(500).json({
                message: ErrorCodes.INTERNAL_ERROR
            });
        }
    } catch (e) {
        console.log(e.stack);
        return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR});
    }
});
router.post("/mem", passport.authenticate('jwt', {session: false}), async (req, res) => {
    if (!(req.query.id && req.body.Ids)) {
        return res.status(400).json({message: "incorrect data"});
    }
    const id = req.query.id;
    const Ids = req.body.Ids;
    try {
        const result = await Controller.postMem(id, Ids);
        if (result.success) {
            return res.json({message: result.message});
        } else {
            return res.status(500).json({
                message: ErrorCodes.INTERNAL_ERROR
            });
        }
    } catch (e) {
        console.log(e.stack);
        return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR});
    }
});

module.exports = router;