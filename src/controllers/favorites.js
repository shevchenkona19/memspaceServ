const Favorites = require("../model/index").getFavoritesModel();
const ErrorCodes = require("../constants/errorCodes");
const SuccessCodes = require("../constants/successCodes");

async function addToFavorites(userId, imageId) {
    try {
        const favorite = await Favorites.build({userId, imageId});
        await favorite.save();
        return {
            success: true,
            message: SuccessCodes.SUCCESS
        }
    } catch (e) {
        console.error(e.stack);
        return {
            success: false,
            errorCode: ErrorCodes.INTERNAL_ERROR
        }
    }
}

async function getAllFavorites(userId) {
    const favorites = await Favorites.findAll({where: {userId}, attributes: ["imageId"]});
    if (favorites) {
        return {
            success: true,
            favorites
        }
    } else {
        throw new Error(ErrorCodes.INTERNAL_ERROR);
    }
}

async function removeFromFavorites(userId, imageId) {
    await Favorites.destroy({where:{userId, imageId}});
    return {
        success: true,
        message: SuccessCodes.SUCCESS
    }
}

async function isFavorite(userId, imageId) {
    const favorite = await Favorites.findOne({where:{userId, imageId}});
    return {
        success: true,
        isFavorite: !!favorite
    }
}

module.exports = {
    addToFavorites,
    getAllFavorites,
    removeFromFavorites,
    isFavorite
};