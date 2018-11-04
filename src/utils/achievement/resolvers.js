const favouritesLvls = require("../../constants/achievementLevels").favourites;
const viewLvls = require("../../constants/achievementLevels").views;
const likeLvls = require("../../constants/achievementLevels").likes;
const dislikeLvls = require("../../constants/achievementLevels").dislikes;
const commentsLvls = require("../../constants/achievementLevels").comments;

async function resolveFavouritesAchievementLevel(user, allFavs) {
    let isAchievementUpdate = false;
    const currentLvl = user.favouritesAchievementLvl;
    for (let i = currentLvl; i < favouritesLvls.max + 1; i++) {
        if (!favouritesLvls.levels[i].isFinalLevel && allFavs < favouritesLvls.levels[i].price) {
            break;
        } else {
            user.favouritesAchievementLvl = i;
            isAchievementUpdate = true;
        }
    }
    user.favouritesCount = allFavs;
    await user.save();
    const achievement = favouritesLvls.levels[user.favouritesAchievementLvl];
    return {
        achievementUpdate: isAchievementUpdate,
        achievement: isAchievementUpdate ? {
            name: "favourites",
            newLvl: user.favouritesAchievementLvl,
            nextPrice: achievement.price,
            currentValue: user.favouritesCount,
            achievementName: achievement.name,
            isFinalLevel: achievement.isFinalLevel
        } : {}
    }
}

async function resolveViewAchievement(user, count) {
    const allViews = user.viewsCount + parseInt(count);
    let isAchievementUpdate = false;
    const currentLvl = user.viewsAchievementLvl;
    for (let i = currentLvl; i < viewLvls.max + 1; i++) {
        if (!viewLvls.levels[i].isFinalLevel && allViews < viewLvls.levels[i].max) {
            break;
        } else {
            user.viewsAchievementLvl = i;
            isAchievementUpdate = true;
        }
    }
    user.viewsCount = allViews;
    await user.save();
    const achievement = viewLvls.levels[user.viewsAchievementLvl];
    return {
        achievementUpdate: isAchievementUpdate,
        achievement: isAchievementUpdate ? {
            newLvl: user.viewsAchievementLvl,
            nextPrice: achievement.price,
            currentValue: user.viewsCount,
            name: "views",
            achievementName: achievement.name,
            isFinalLevel: achievement.isFinalLevel
        } : {}
    }
}

async function resolveLikesAchievement(user, allLikes) {
    let isAchievementUpdate = false;
    const currentLvl = user.likeAchievementLvl;
    for (let i = currentLvl; i < likeLvls.max + 1; i++) {
        if (!likeLvls.levels[i].isFinalLevel && allLikes < likeLvls[currentLvl].price) {
            break;
        } else {
            user.likeAchievementLvl = i;
            isAchievementUpdate = true;
        }
    }
    user.likesCount = allLikes;
    await user.save();
    const achievement = likeLvls.levels[user.likeAchievementLvl];
    return {
        achievementUpdate: isAchievementUpdate,
        achievement: isAchievementUpdate ? {
            newLvl: user.likeAchievementLvl,
            nextPrice: achievement.price,
            currentValue: user.likesCount,
            name: "likes",
            achievementName: achievement.name,
            isFinalLevel: achievement.isFinalLevel
        } : {}
    }
}

async function resolveDislikesAchievement(user, allDislikes) {
    let isAchievementUpdate = false;
    const currentLvl = user.dislikesAchievementLvl;
    for (let i = currentLvl; i < dislikeLvls.max + 1; i++) {
        if (!dislikeLvls.levels[i].isFinalLevel && allDislikes < dislikeLvls[currentLvl].price) {
            break;
        } else {
            user.dislikesAchievementLvl = i;
            isAchievementUpdate = true;
        }
    }
    user.dislikesCount = allDislikes;
    await user.save();
    const achievement = dislikeLvls.levels[user.dislikesAchievementLvl];
    return {
        achievementUpdate: isAchievementUpdate,
        achievement: isAchievementUpdate ? {
            newLvl: user.dislikesAchievementLvl,
            nextPrice: achievement.price,
            currentValue: user.dislikesCount,
            name: "dislikes",
            achievementName: achievement.name,
            isFinalLevel: achievement.isFinalLevel
        } : {}
    }
}


async function resolveCommentsAchievement(user, allComments) {
    let isAchievementUpdate = false;
    const currentLvl = user.commentsAchievementLvl;
    for (let i = currentLvl; i < commentsLvls.max + 1; i++) {
        if (!commentsLvls.levels[i].isFinalLevel && allComments < commentsLvls[currentLvl].price) {
            break;
        } else {
            user.commentsAchievementLvl = i;
            isAchievementUpdate = true;
        }
    }
    user.commentsCount = allComments;
    await user.save();
    const achievement = commentsLvls.levels[user.commentsAchievementLvl];
    return {
        achievementUpdate: isAchievementUpdate,
        achievement: isAchievementUpdate ? {
            newLvl: user.commentsAchievementLvl,
            nextPrice: achievement.price,
            currentValue: user.commentsCount,
            name: "comments",
            achievementName: achievement.name,
            isFinalLevel: achievement.isFinalLevel
        } : {}
    }
}

module.exports = {
    resolveFavouritesAchievementLevel,
    resolveViewAchievement,
    resolveLikesAchievement,
    resolveDislikesAchievement,
    resolveCommentsAchievement,
};