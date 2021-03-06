const achievements = require("../../constants/achievementLevels");
const favouritesLvls = achievements.favourites;
const viewLvls = achievements.views;
const likeLvls = achievements.likes;
const dislikeLvls = achievements.dislikes;
const commentsLvls = achievements.comments;
const referralLvls = achievements.referral;

async function resolveFavouritesAchievementLevel(user, allFavs) {
    let isAchievementUpdate = false;
    const currentLvl = user.favouritesAchievementLvl;
    if (currentLvl !== favouritesLvls.max) {
        for (let i = currentLvl; i < favouritesLvls.max; i++) {
            if (allFavs < favouritesLvls.levels[i].price) {
                break;
            } else {
                user.favouritesAchievementLvl = i + 1;
                isAchievementUpdate = true;
            }
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
    if (currentLvl !== viewLvls.max) {
        for (let i = currentLvl; i < viewLvls.max; i++) {
            if (allViews < viewLvls.levels[i].price) {
                break;
            } else {
                user.viewsAchievementLvl = i + 1;
                isAchievementUpdate = true;
            }
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
    if (currentLvl !== favouritesLvls.max) {
        for (let i = currentLvl; i < likeLvls.max; i++) {
            if (allLikes < likeLvls.levels[i].price) {
                break;
            } else {
                user.likeAchievementLvl = i + 1;
                isAchievementUpdate = true;
            }
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
    if (currentLvl !== favouritesLvls.max) {
        for (let i = currentLvl; i < dislikeLvls.max; i++) {
            if (allDislikes < dislikeLvls.levels[i].price) {
                break;
            } else {
                user.dislikesAchievementLvl = i + 1;
                isAchievementUpdate = true;
            }
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
    if (currentLvl !== favouritesLvls.max) {
        for (let i = currentLvl; i < commentsLvls.max; i++) {
            if (allComments < commentsLvls.levels[i].price) {
                break;
            } else {
                user.commentsAchievementLvl = i + 1;
                isAchievementUpdate = true;
            }
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

async function resolveReferralAchievement(user, refCount) {
    let isAchievementUpdate = false;
    const currentLvl = user.referralAchievementLvl;
    if (currentLvl !== referralLvls.max) {
        for (let i = currentLvl; i < referralLvls.max; i++){
            if (refCount < referralLvls.levels[i].price) {
                break;
            }
            user.referralAchievementLvl =  i + 1;
            isAchievementUpdate = true;
        }
    }
    user.referralCount = refCount;
    await user.save();
    const achievement = referralLvls.levels[user.referralAchievementLvl];
    return {
      achievementUpdate: isAchievementUpdate,
      achievement: isAchievementUpdate ? {
          newLvl: user.referralAchievementLvl,
          nextPrice: achievement.price,
          currentValue: user.referralCount,
          name: "referral",
          achievementName: achievement.name,
          isFinalLevel: achievement.isFinalLevel
      } : {}
    };
}

module.exports = {
    resolveFavouritesAchievementLevel,
    resolveViewAchievement,
    resolveLikesAchievement,
    resolveDislikesAchievement,
    resolveCommentsAchievement,
    resolveReferralAchievement,
};