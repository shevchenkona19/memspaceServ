const Controller = require("../../../controllers/favorites");
const ErrorCodes = require("../../../constants/errorCodes");

async function getAllFavorites(req, res) {
    const result = await Controller.getAllFavorites(req.query.userId);
    if (result.success) {
        return res.json({
            favorites: result.favorites
        })
    } else {
        throw Error(ErrorCodes.INTERNAL_ERROR);
    }
}

module.exports = {getAllFavorites};