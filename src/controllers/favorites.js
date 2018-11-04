const Favorites = require("../model/index").getFavoritesModel();
const ErrorCodes = require("../constants/errorCodes");
const SuccessCodes = require("../constants/successCodes");
const resolveFavouritesAchievement = require("../utils/achievement/resolvers").resolveFavouritesAchievementLevel;

async function addToFavorites(imageId, user) {
    const userId = user.userId;
    const favorite = await Favorites.build({userId, imageId});
    await favorite.save();
    const allFavs = (await Favorites.findAll({where: {userId}})).length;
    const achievement = await resolveFavouritesAchievement(user, allFavs);
    return {
        success: true,
        message: SuccessCodes.SUCCESS,
        ...achievement
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

async function removeFromFavorites(user, imageId) {
    const userId = user.userId;
    await Favorites.destroy({where: {userId, imageId}});
    user.favouritesCount = (await Favorites.findAll({where: {userId}})).length;
    await user.save();
    return {
        success: true,
        message: SuccessCodes.SUCCESS
    }
}

async function isFavorite(userId, imageId) {
    const favorite = await Favorites.findOne({where: {userId, imageId}});
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