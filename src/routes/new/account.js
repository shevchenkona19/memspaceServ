const express = require('express');
const router = express.Router();
const Controller = require('../../controllers/account');

router.get("/username", async (req, res) => {
    try {
        const result = await Controller.getUsername(req.query.userId);
        if (result.success) {
            return res.json({
                username: result.username
            })
        } else {
            return res.status(500).json({
                message: result.errorCode
            })
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: e
        })

    }
});

module.exports = router;