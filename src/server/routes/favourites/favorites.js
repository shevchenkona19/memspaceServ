const Controller = require("../../controllers/favorites");
const ErrorCodes = require("../../constants/errorCodes");

async function addToFavorites(req, res) {
    if (!req.query.id) {
        return res.status(401).json({message: "incorrect data"});
    }
    const result = await Controller.addToFavorites(req.query.id, req.user);
    if (result.success) {
        return res.json({
            message: result.message,
            achievementUpdate: result.achievementUpdate,
            achievement: result.achievement
        });
    } else {
        throw Error(result.errorCode);
    }
}

async function getAllFavorites(req, res) {
    const result = await Controller.getAllFavorites(req.user.userId);
    if (result.success) {
        return res.json({
            favorites: result.favorites
        })
    } else {
        throw Error(ErrorCodes.INTERNAL_ERROR);
    }
}

async function removeFromFavorites(req, res) {
    if (!req.query.id) {
        return res.status(401).json({message: "incorrect data"});
    }
    const result = await Controller.removeFromFavorites(req.user, req.query.id);
    if (result.success) {
        return res.json({
            message: result.message
        })
    } else {
        throw Error(ErrorCodes.INTERNAL_ERROR);
    }
}

async function isFavourite(req, res) {
    if (!req.query.id) {
        return res.status(401).json({message: "incorrect data"});
    }
    const result = await Controller.isFavorite(req.user.userId, req.query.id);
    if (result.success) {
        return res.json({
            isFavourite: result.isFavorite
        })
    } else {
        throw Error(ErrorCodes.INTERNAL_ERROR);
    }
}

module.exports = {
    addToFavorites,
    getAllFavorites,
    removeFromFavorites,
    isFavourite,
};