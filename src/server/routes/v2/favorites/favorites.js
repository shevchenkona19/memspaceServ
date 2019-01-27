const Controller = require("../../../controllers/favorites");

async function getAllFavorites(req, res, next) {
    const result = await Controller.getAllFavoritesV2(req.query.userId);
    if (result.success) {
        return res.json({
            favorites: result.favorites
        })
    } else {
        next(result.error);
    }
}

module.exports = {getAllFavorites};