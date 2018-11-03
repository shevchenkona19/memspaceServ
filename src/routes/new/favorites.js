const express = require('express');
const router = express.Router();
const Controller = require("../../controllers/favorites");
const ErrorCodes = require("../../constants/errorCodes");

router.get("/allFavorites", async (req, res) => {
    try {
        const result = await Controller.getAllFavorites(req.query.userId);
        if (result.success) {
            return res.json({
                favorites: result.favorites
            })
        } else {
            return res.status(500).json({
                message: ErrorCodes.INTERNAL_ERROR
            })
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({message: ErrorCodes.INTERNAL_ERROR});
    }
});


module.exports = router;