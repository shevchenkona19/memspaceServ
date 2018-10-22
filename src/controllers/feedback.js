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
    const allLikes = (await Likes.findAll({where :{userId: user.userId, opinion: 1}})).length;
    let isAchievementUpdate = false;
    if (allLikes < likeLvls[likeLvls.max].price) {
        const currentLvl = user.likeAchievementLvl;
        if (allLikes < likeLvls[currentLvl].price) {
            user.likesCount = allLikes;
            await user.save();
        } else {
            user.likesCount = allLikes;
            if (currentLvl + 1 <= likeLvls.max) {
                user.likeAchievementLvl = likeLvls[currentLvl + 1].lvl;
                isAchievementUpdate = true;
            }
            await user.save();
        }
    }
    return {
        achievementUpdate: isAchievementUpdate,
        achievement: isAchievementUpdate ? {
            newLvl: user.likeAchievementLvl,
            nextPrice: likeLvls[user.viewsAchievementLvl].price,
            currentValue: user.likesCount
        } : {}
    }
}

async function resolveDislikesAchievement(user) {
    const allDislikes = (await Likes.findAll({where :{userId: user.userId, opinion: -1}})).length;
    let isAchievementUpdate = false;
    if (allDislikes < dislikeLvls[dislikeLvls.max].price) {
        const currentLvl = user.dislikesAchievementLvl;
        if (allDislikes < dislikeLvls[currentLvl].price) {
            user.dislikesCount = allDislikes;
            await user.save();
        } else {
            user.dislikesCount = allDislikes;
            if (currentLvl + 1 <= dislikeLvls.max) {
                user.dislikesAchievementLvl = dislikeLvls[currentLvl + 1].lvl;
                isAchievementUpdate = true;
            }
            await user.save();
        }
    }
    return {
        achievementUpdate: isAchievementUpdate,
        achievement: isAchievementUpdate ? {
            newLvl: user.dislikesAchievementLvl,
            nextPrice: dislikeLvls[user.viewsAchievementLvl].price,
            currentValue: user.dislikesCount
        } : {}
    }
}

async function resolveCommentsAchievement(user) {
    const allComments = (await Comments.findAll({where :{userId: user.userId}})).length;
    let isAchievementUpdate = false;
    if (allComments < commentsLvls[commentsLvls.max].price) {
        const currentLvl = user.commentsAchievementLvl;
        if (allComments < commentsLvls[currentLvl].price) {
            user.commentsCount = allComments;
            await user.save();
        } else {
            user.commentsCount = allComments;
            if (currentLvl + 1 <= commentsLvls.max) {
                user.commentsAchievementLvl = commentsLvls[currentLvl + 1].lvl;
                isAchievementUpdate = true;
            }
            await user.save();
        }
    }
    return {
        achievementUpdate: isAchievementUpdate,
        achievement: isAchievementUpdate ? {
            newLvl: user.commentsAchievementLvl,
            nextPrice: commentsLvls[user.viewsAchievementLvl].price,
            currentValue: user.commentsCount
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
    const comments = await db.query(`SELECT username, text, date FROM comments INNER JOIN users ON comments.\"userId\" = users.\"userId\" WHERE \"imageId\" = ${imageId} LIMIT ${count} OFFSET ${offset}`);
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