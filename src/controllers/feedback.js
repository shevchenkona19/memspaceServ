const Likes = require("../model/index").getLikesModel();
const Images = require("../model/index").getImagesModel();
const Comments = require("../model/index").getCommentsModel();
const UserFeedback = require("../model/index").getUserFeedback();
const db = require("../model/index").getDb().sequelize;
const ErrorCodes = require("../constants/errorCodes");
const SuccessCodes = require("../constants/successCodes");
const likeLvls = require("../constants/achievementLevels").likes;
const dislikeLvls = require("../constants/achievementLevels").dislikes;
const commentsLvls = require("../constants/achievementLevels").comments;

const getFinalMem = async (userId, imageId) => {
    const refreshedMem = await Images.findById(imageId, {attributes: ["likes", "dislikes"]});
    const finalOpinion = await Likes.findOne({where: {userId, imageId}, attributes: ["opinion"]});
    return {
        likes: refreshedMem.likes,
        dislikes: refreshedMem.dislikes,
        opinion: finalOpinion.opinion
    };
};

const setLike = async (userId, imageId) => {
    await Likes.build({userId, imageId, opinion: 1}).save();
    await (await Images.findById(imageId)).increment('likes', {by: 1});
};
const delLike = async (userId, imageId) => {
    await Likes.destroy({where: {userId, imageId}});
    await (await Images.findById(imageId)).decrement('likes', {by: 1});
};
const setDislike = async (userId, imageId) => {
    await Likes.build(({userId, imageId, opinion: 0})).save();
    await (await Images.findById(imageId)).increment('dislikes', {by: 1});
};
const delDislike = async (userId, imageId) => {
    await Likes.destroy({where: {userId, imageId}});
    await (await Images.findById(imageId)).decrement('dislikes', {by: 1});
};

async function resolveLikesAchievement(user) {
    const allLikes = (await Likes.findAll({where: {userId: user.userId, opinion: 1}})).length;
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

async function resolveDislikesAchievement(user) {
    const allDislikes = (await Likes.findAll({where: {userId: user.userId, opinion: 0}})).length;
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

async function resolveCommentsAchievement(user) {
    const allComments = (await Comments.findAll({where: {userId: user.userId}})).length;
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

async function postLike(user, imageId) {
    const userId = user.userId;
    const likes = await Likes.getOpinionByIds(userId, imageId);
    if (likes) {
        if (likes.opinion === 0) {
            await delDislike(userId, imageId);
            await setLike(userId, imageId);
        }
    } else {
        await setLike(userId, imageId);
    }
    const achievement = await resolveLikesAchievement(user);
    return {
        success: true,
        mem: await getFinalMem(userId, imageId),
        ...achievement
    };
}

async function postDislike(user, imageId) {
    const userId = user.userId;
    const likes = await Likes.getOpinionByIds(userId, imageId);
    if (likes) {
        if (likes.opinion === 1) {
            await delLike(userId, imageId);
            await setDislike(userId, imageId);
        }
    } else {
        await setDislike(userId, imageId);
    }
    const achievement = await resolveDislikesAchievement(user);
    return {
        success: true,
        mem: await getFinalMem(userId, imageId),
        ...achievement
    };
}

async function deleteLike(userId, imageId) {
    const likes = await Likes.getOpinionByIds(userId, imageId);
    if (likes) {
        if (likes.opinion === 1) {
            await delLike(userId, imageId);
        }
    } else {
        throw new Error(ErrorCodes.INTERNAL_ERROR)
    }
    await resolveLikesAchievement(user);
    return {
        success: true,
        mem: await getFinalMem(userId, imageId)
    }
}

async function deleteDislike(userId, imageId) {
    const likes = await Likes.getOpinionByIds(userId, imageId);
    if (likes) {
        if (likes.opinion === 0) {
            await delDislike(userId, imageId);
        }
    } else {
        throw new Error(ErrorCodes.INTERNAL_ERROR);
    }
    await resolveDislikesAchievement(user);
    return {
        success: true,
        mem: await getFinalMem(userId, imageId)
    }
}

async function postComment(user, imageId, text) {
    const userId = user.userId;
    await Comments.build({
        userId,
        imageId,
        text,
        date: Date.now()
    }).save();
    const achievement = await resolveCommentsAchievement(user);
    return {
        success: true,
        message: SuccessCodes.SUCCESS,
        ...achievement
    }
}

async function getComments(userId, imageId, count, offset) {
    const comments = await db.query(`SELECT users.\"userId\" as \"userId\", users.\"likeAchievementLvl\" as \"likeAchievementLvl\", users.\"dislikesAchievementLvl\" as \"dislikesAchievementLvl\", users.\"commentsAchievementLvl\" as \"commentsAchievementLvl\", users.\"favouritesAchievementLvl\" as \"favouritesAchievementLvl\", users.\"viewsAchievementLvl\" as \"viewsAchievementLvl\", users.\"firstHundred\" as \"firstHundred\", users.\"firstThousand\" as \"firstThousand\", username, text, date FROM comments INNER JOIN users ON comments.\"userId\" = users.\"userId\" WHERE \"imageId\" = ${imageId} LIMIT ${count} OFFSET ${offset}`);
    return {
        success: true,
        comments: comments[0] || [],
        count: comments[0].length || 0
    }
}

async function writeMessageForDev(userId, title, message) {
    const feedback = UserFeedback.build({userId, title, message});
    await feedback.save();
    return {
        success: true
    }
}

async function getAllDevMessages() {
    const allFeedback = await UserFeedback.findAll();
    return {
        success: true,
        allFeedback
    }
}

module.exports = {
    postLike,
    deleteLike,
    postDislike,
    deleteDislike,
    postComment,
    getComments,
    writeMessageForDev,
    getAllDevMessages
};