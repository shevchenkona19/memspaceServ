const Likes = require("../model/index").getLikesModel();
const Images = require("../model/index").getImagesModel();
const Comments = require("../model/index").getCommentsModel();
const Users = require("../model/index").getUsersModel();
const db = require("../model/index").getDb().sequelize;
const ErrorCodes = require("../constants/errorCodes");
const SuccessCodes = require("../constants/successCodes");

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

async function postLike(userId, imageId) {
    const likes = await Likes.getOpinionByIds(userId, imageId);
    if (likes) {
        if (likes.opinion === 0) {
            await delDislike(userId, imageId);
            await setLike(userId, imageId);
        }
    } else {
        await setLike(userId, imageId);
    }
    return {
        success: true,
        mem: await getFinalMem(userId, imageId)
    };
}

async function postDislike(userId, imageId) {
    const likes = await Likes.getOpinionByIds(userId, imageId);
    if (likes) {
        if (likes.opinion === 1) {
            await delLike(userId, imageId);
            await setDislike(userId, imageId);
        }
    } else {
        await setDislike(userId, imageId);
    }
    return {
        success: true,
        mem: await getFinalMem(userId, imageId)
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

async function postComment(userId, imageId, text) {
    await Comments.build({
        userId,
        imageId,
        text,
        date: Date.now()
    }).save();
    return {
        success: true,
        message: SuccessCodes.SUCCESS
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

module.exports = {
    postLike,
    deleteLike,
    postDislike,
    deleteDislike,
    postComment,
    getComments
};