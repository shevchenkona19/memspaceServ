const Favorites = require("../model/index").getFavoritesModel();
const Users = require("../model/index").getUsersModel();
const ErrorCodes = require("../constants/errorCodes");
const SuccessCodes = require("../constants/successCodes");
const favouritesLvls = require("../constants/achievementLevels").favourites;

async function addToFavorites(imageId, user) {
    const userId = user.userId;
    try {
        const favorite = await Favorites.build({userId, imageId});
        await favorite.save();
        const allFavs = (await Favorites.findAll({where: {userId}})).length;
        let isAchievementUpdate = false;
        const currentLvl = user.favouritesAchievementLvl;
        if (allFavs < favouritesLvls[currentLvl].price) {
            user.favouritesCount = allFavs;
            await user.save();
        } else {
            user.favouritesCount = allFavs;
            if (currentLvl + 1 <= favouritesLvls.max) {
                user.favouritesAchievementLvl = favouritesLvls[currentLvl + 1].lvl;
                isAchievementUpdate = true;
            }
            await user.save();
        }
        return {
            success: true,
            message: SuccessCodes.SUCCESS,
            achievementUpdate: isAchievementUpdate,
            achievement: isAchievementUpdate ? {
                name: "favourites",
                newLvl: user.favouritesAchievementLvl,
                nextPrice: favouritesLvls[user.favouritesAchievementLvl].price,
                currentValue: user.favouritesCount,
                achievementName: favouritesLvls[user.favouritesAchievementLvl].name,
                isFinalLevel: favouritesLvls[user.favouritesAchievementLvl].isFinalLevel
            } : {}
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