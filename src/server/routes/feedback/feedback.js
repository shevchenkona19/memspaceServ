const Controller = require("../../controllers/feedback");
const ErrorCodes = require("../../constants/errorCodes");
const firebase = require("firebase-admin");
const NOTIFICATION_TYPES = require("../../constants/notifications");

async function postLike(req, res) {
    if (!req.query.id) {
        return res.status(400).json({message: "incorrect query"});
    }
    const imageId = req.query.id;
    const result = await Controller.postLike(req.user, imageId);
    const {notification} = result;
    if (notification.isNotify) {
        const user = notification.user;
        if (user && user.fcmId) {
            const message = {
                data: {
                    type: NOTIFICATION_TYPES.NOTIFY_ABOUT_POSTED_MEME,
                    byUsername: req.user.username.toString(),
                    byUserId: req.user.userId.toString(),
                    myId: user.userId.toString(),
                    imageId: notification.imageId.toString()
                },
                token: user.fcmId
            };
            firebase.messaging().send(message)
                .catch(error => {
                    console.error("Error in notification send: ", error);
                });
        }
    }
    if (result.success) {
        return res.json({
            ...result.mem,
            achievementUpdate: result.achievementUpdate,
            achievement: result.achievement
        })
    } else {
        throw Error(ErrorCodes.INTERNAL_ERROR);
    }
}

async function postDislike(req, res) {
    if (!req.query.id) {
        return res.status(400).json({message: "incorrect query"});
    }
    const imageId = req.query.id;
    const result = await Controller.postDislike(req.user, imageId);
    if (result.success) {
        return res.json({
            ...result.mem,
            achievementUpdate: result.achievementUpdate,
            achievement: result.achievement
        })
    } else {
        throw Error(ErrorCodes.INTERNAL_ERROR);
    }
}

async function deleteLike(req, res) {
    if (!req.query.id) {
        return res.status(400).json({message: "incorrect query"});
    }
    const imageId = req.query.id;
    const result = await Controller.deleteLike(req.user, imageId);
    if (result.success) {
        return res.json(result.mem)
    } else {
        throw Error(ErrorCodes.INTERNAL_ERROR);
    }
}

async function deleteDislike(req, res) {
    if (!req.query.id) {
        return res.status(400).json({message: "incorrect query"});
    }
    const imageId = req.query.id;
    const result = await Controller.deleteDislike(req.user, imageId);
    if (result.success) {
        return res.json(result.mem)
    } else {
        throw Error(ErrorCodes.INTERNAL_ERROR);
    }
}

async function postComment(req, res) {
    if (!req.query.id || !req.body.text) {
        return res.status(400).json({message: ErrorCodes.INCORRECT_DATA});
    }
    const imageId = req.query.id;
    const text = req.body.text;
    const result = await Controller.postComment(req.user, imageId, text);
    if (result.success) {
        return res.json({
            message: result.message,
            achievementUpdate: result.achievementUpdate,
            achievement: result.achievement
        })
    } else {
        throw Error(ErrorCodes.INTERNAL_ERROR);
    }
}

async function postCommentRespond(req, res) {
    const imageId = req.query.id;
    const commentId = req.query.commentId;
    const text = req.body.text;
    const answerUserId = req.query.answerUserId;
    if (!imageId || !commentId || !text || !answerUserId) {
        return res.status(400).json({
            message: ErrorCodes.INCORRECT_DATA
        });
    }
    const result = await Controller.postCommentRespond(req.user, answerUserId, imageId, commentId, text);
    if (result.success) {
        if (result.sendNotification) {
            const sendUser = result.sendUser;
            if (sendUser) {
                if (sendUser.fcmId) {
                    console.log("ImageId: " + imageId + " -----------------------------------------");
                    const message = {
                        data: {
                            type: NOTIFICATION_TYPES.COMMENT_RESPOND,
                            username: req.user.username.charAt(0).toUpperCase() + req.user.username.slice(1),
                            text,
                            memId: imageId.toString(),
                            parentCommentId: commentId.toString(),
                            newCommentId: result.sendNewCommentId.toString(),
                        },
                        token: sendUser.fcmId
                    };
                    firebase.messaging().send(message)
                        .catch(error => {
                            console.error("Error in notification send: ", error);
                        });
                }
            }
        }
        return res.json({
            message: result.message,
            newCommentId: result.sendNewCommentId,
            achievementUpdate: result.achievementUpdate,
            achievement: result.achievement
        })
    } else {
        throw Error(ErrorCodes.INTERNAL_ERROR);
    }
}

async function getAnswersForComment(req, res) {
    const commentId = req.query.commentId;
    const limit = req.query.limit;
    const offset = req.query.offset;
    if (!commentId || !limit || !offset) {
        return res.status(400).json({
            message: ErrorCodes.INCORRECT_DATA
        });
    }
    const result = await Controller.getAnswersForComment(commentId, limit, offset);
    if (result.success) {
        return res.json({
            comments: result.comments,
        });
    } else {
        throw Error(ErrorCodes.INTERNAL_ERROR);
    }
}

async function getAnswersForCommentToId(req, res) {
    const parentCommentId = req.query.parentCommentId;
    const childCommentId = req.query.childCommentId;
    const imageId = req.query.imageId;
    if (!parentCommentId || !childCommentId || !imageId) {
        return res.status(400).json({
            message: ErrorCodes.INCORRECT_DATA
        });
    }
    const result = await Controller.getAnswersForCommentToId(parentCommentId, childCommentId, imageId);
    if (result.success) {
        return res.json({
            comments: result.comments,
            count: result.comments.length
        });
    } else throw Error(result.error);
}

async function getComments(req, res) {
    if (!req.query.id || !req.query.count || !req.query.offset) {
        return res.status(400).json({message: "incorrect query"});
    }
    const imageId = req.query.id;
    const count = req.query.count;
    const offset = req.query.offset;
    const result = await Controller.getComments(imageId, count, offset);
    if (result.success) {
        return res.json({
            comments: result.comments,
            count: result.count
        });
    } else {
        throw Error(ErrorCodes.INTERNAL_ERROR);
    }
}

async function getCommentsToCommentId(req, res) {
    const memId = req.query.memId;
    const toCommentId = req.query.toCommentId;
    if (!memId || !toCommentId) {
        return res.status(400).json({message: ErrorCodes.INCORRECT_DATA});
    }
    const result = await Controller.getCommentsToCommentId(memId, toCommentId);
    if (result.success) {
        return res.json({
            comments: result.comments,
            count: result.comments.length
        })
    } else {
        throw Error(result.errorCode)
    }
}

async function postMessageForDev(req, res) {
    const title = req.body.title;
    const message = req.body.message;
    if (!title || !message) {
        return res.body({success: false, message: ErrorCodes.INCORRECT_BODY});
    }
    const result = await Controller.writeMessageForDev(req.user.userId, title, message);
    if (result.success) {
        return res.json({
            success: true,
        })
    } else {
        return res.json({
            success: false,
            message: ErrorCodes.INTERNAL_ERROR
        })
    }
}

async function getAllDevFeedback(req, res) {
    const result = await Controller.getAllDevMessages();
    if (result.success) {
        return res.json({
            success: true,
            feedback: result.allFeedback
        })
    } else {
        return res.json({
            success: false,
            message: ErrorCodes.INTERNAL_ERROR
        })
    }
}

module.exports = {
    postLike,
    postDislike,
    deleteLike,
    deleteDislike,
    postComment,
    getComments,
    getCommentsToCommentId,
    postMessageForDev,
    getAllDevFeedback,
    postCommentRespond,
    getAnswersForComment,
    getAnswersForCommentToId,
};