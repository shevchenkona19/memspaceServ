const Favorites = require("../model").getFavoritesModel();
const db = require("../model").getDb().sequelize;
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
    const favs = await db.query(`select "imageId" from favorites where "userId" = ${userId} order by "imageId" desc;`);
    if (favs) {
        return {
            success: true,
            favorites: favs[0] || []
        }
    } else {
        throw new Error(ErrorCodes.INTERNAL_ERROR);
    }
}

async function getAllFavoritesV2(userId) {
    const favs = await db.query(`select * from favorites inner join images on favorites."imageId" = images."imageId" where favorites."userId" = ${userId} order by favorites."imageId" desc; `);
    if (favs) {
        return {
            success: true,
            favorites: favs[0].map(fav => {
                fav.isFavourite = true;
                return fav;
            }) || []
        }
    } else {
        return {
            success: false,
            error: ErrorCodes.INTERNAL_ERROR
        }
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
    getAllFavoritesV2,
    isFavorite
};