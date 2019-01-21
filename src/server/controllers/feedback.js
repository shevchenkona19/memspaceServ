const Likes = require("../model").getLikesModel();
const Images = require("../model").getImagesModel();
const Comments = require("../model").getCommentsModel();
const UserFeedback = require("../model").getUserFeedback();
const Users = require("../model").getUsersModel();
const db = require("../model").getDb().sequelize;
const ErrorCodes = require("../constants/errorCodes");
const SuccessCodes = require("../constants/successCodes");
const resolveLikesAchievement = require("../utils/achievement/resolvers").resolveLikesAchievement;
const resolveDislikesAchievement = require("../utils/achievement/resolvers").resolveDislikesAchievement;
const resolveCommentsAchievement = require("../utils/achievement/resolvers").resolveCommentsAchievement;

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
    const allLikes = (await Likes.findAll({where: {userId: user.userId, opinion: 1}})).length;
    const achievement = await resolveLikesAchievement(user, allLikes);
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
    const allDislikes = (await Likes.findAll({where: {userId: user.userId, opinion: 0}})).length;
    const achievement = await resolveDislikesAchievement(user, allDislikes);
    return {
        success: true,
        mem: await getFinalMem(userId, imageId),
        ...achievement
    };
}

async function deleteLike(user, imageId) {
    const userId = user.userId;
    const likes = await Likes.getOpinionByIds(userId, imageId);
    if (likes) {
        if (likes.opinion === 1) {
            await delLike(userId, imageId);
        }
    } else {
        throw new Error(ErrorCodes.INTERNAL_ERROR)
    }
    const allDislikes = (await Likes.findAll({where: {userId: user.userId, opinion: 0}})).length;
    const achievement = await resolveLikesAchievement(user, allDislikes);
    return {
        success: true,
        mem: await getFinalMem(userId, imageId),
        ...achievement
    }
}

async function deleteDislike(user, imageId) {
    const userId = user.userId;
    const likes = await Likes.getOpinionByIds(userId, imageId);
    if (likes) {
        if (likes.opinion === 0) {
            await delDislike(userId, imageId);
        }
    } else {
        throw new Error(ErrorCodes.INTERNAL_ERROR);
    }
    const allDislikes = (await Likes.findAll({where: {userId: user.userId, opinion: 0}})).length;
    const achievement = await resolveDislikesAchievement(user, allDislikes);
    return {
        success: true,
        mem: await getFinalMem(userId, imageId),
        ...achievement
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
    const allComments = (await Comments.findAll({where: {userId: user.userId}})).length;
    const achievement = await resolveCommentsAchievement(user, allComments);
    return {
        success: true,
        message: SuccessCodes.SUCCESS,
        ...achievement
    }
}

async function getComments(imageId, count, offset) {
    const comments = await db.query(`SELECT users.\"userId\" as \"userId\", users.\"likeAchievementLvl\" as \"likeAchievementLvl\", users.\"dislikesAchievementLvl\" as \"dislikesAchievementLvl\", users.\"commentsAchievementLvl\" as \"commentsAchievementLvl\", users.\"favouritesAchievementLvl\" as \"favouritesAchievementLvl\", users.\"viewsAchievementLvl\" as \"viewsAchievementLvl\", users.\"firstHundred\" as \"firstHundred\", users.\"firstThousand\" as \"firstThousand\", users.username as username, text, answers, \"parentId\", \"answerUserId\", date, id FROM comments INNER JOIN users ON comments.\"userId\" = users.\"userId\" WHERE \"imageId\" = ${imageId} AND \"parentId\" IS NULL ORDER BY comments.date ASC LIMIT ${count} OFFSET ${offset};`);
    return {
        success: true,
        comments: comments[0] || [],
        count: comments[0].length || 0
    }
}

async function getAnswersForComment(commentId, limit, offset) {
    const comments = await db.query(`SELECT users.\"userId\" as \"userId\", users.\"likeAchievementLvl\" as \"likeAchievementLvl\", users.\"dislikesAchievementLvl\" as \"dislikesAchievementLvl\", users.\"commentsAchievementLvl\" as \"commentsAchievementLvl\", users.\"favouritesAchievementLvl\" as \"favouritesAchievementLvl\", users.\"viewsAchievementLvl\" as \"viewsAchievementLvl\", users.\"firstHundred\" as \"firstHundred\", users.\"firstThousand\" as \"firstThousand\", users.username as username, text, \"parentId\", \"answerUserId\", date, id FROM comments INNER JOIN users ON comments.\"userId\" = users.\"userId\" WHERE \"parentId\" = ${commentId} ORDER BY comments.date ASC LIMIT ${limit} OFFSET ${offset};`);

    return {
        success: true,
        comments: comments[0] || [],
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

async function postCommentRespond(user, answerUserId, imageId, commentId, text) {
    const newComment = Comments.build({
        userId: user.userId,
        imageId,
        parentId: commentId,
        text,
        answerUserId,
        date: Date.now()
    });
    await newComment.save();
    const comment = await Comments.findById(commentId);
    if (comment.answers === null) comment.answers = 1;
    else comment.answers = comment.answers + 1;
    await comment.save();
    const allComments = (await Comments.findAll({where: {userId: user.userId}})).length;
    const achievement = await resolveCommentsAchievement(user, allComments);
    let sendNotification = true;
    let sendUser = false;
    if (user.userId === answerUserId) {
        sendNotification = false;
    }
    if (sendNotification) {
        sendUser = await Users.findById(answerUserId);
    }
    return {
        success: true,
        message: SuccessCodes.SUCCESS,
        sendNotification,
        sendUser,
        sendNewCommentId: newComment.id,
        ...achievement
    }
}

async function getCommentsToCommentId(memId, commentId) {
    const comments = await db.query(`select users."userId" as "userId", users."likeAchievementLvl" as "likeAchievementLvl", users."dislikesAchievementLvl" as "dislikesAchievementLvl", users."commentsAchievementLvl" as "commentsAchievementLvl", users."favouritesAchievementLvl" as "favouritesAchievementLvl", users."viewsAchievementLvl" as "viewsAchievementLvl", users."firstHundred" as "firstHundred", users."firstThousand" as "firstThousand", users.username as username, text, answers, "parentId", "answerUserId", date, id FROM comments INNER JOIN users ON comments."userId" = users."userId" where id <= ${commentId} AND "parentId" IS NULL AND "imageId" = ${memId} ORDER BY comments.date ASC;`);
    if (comments) {
        return {
            success: true,
            comments: comments[0] || []
        }
    } else {
        return {
            success: false,
            errorCode: ErrorCodes.NO_SUCH_COMMENT
        }
    }
}

async function getAnswersForCommentToId(parentCommentId, childCommentId, imageId) {
    const comments = await db.query(`select users."userId" as "userId", users."likeAchievementLvl" as "likeAchievementLvl", users."dislikesAchievementLvl" as "dislikesAchievementLvl", users."commentsAchievementLvl" as "commentsAchievementLvl", users."favouritesAchievementLvl" as "favouritesAchievementLvl", users."viewsAchievementLvl" as "viewsAchievementLvl", users."firstHundred" as "firstHundred", users."firstThousand" as "firstThousand", users.username as username, text, answers, "parentId", "answerUserId", date, id FROM comments INNER JOIN users ON comments."userId" = users."userId" where id <= ${childCommentId} AND "parentId" = ${parentCommentId} AND "imageId" = ${imageId} ORDER BY comments.date ASC;`);
    if (comments) {
        return {
            success: true,
            comments: comments[0] || []
        }
    } else {
        return {
            success: false,
            errorCode: ErrorCodes.NO_SUCH_COMMENT
        }
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
    getAllDevMessages,
    postCommentRespond,
    getCommentsToCommentId,
    getAnswersForComment,
    getAnswersForCommentToId,
};