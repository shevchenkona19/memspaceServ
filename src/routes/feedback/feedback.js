const Controller = require("../../controllers/feedback");
const ErrorCodes = require("../../constants/errorCodes");

async function postLike(req, res) {
    if (!req.query.id) {
        return res.status(400).json({message: "incorrect query"});
    }
    const imageId = req.query.id;
    const result = await Controller.postLike(req.user, imageId);
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
        return res.status(400).json({message: "incorrect query"});
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
    postMessageForDev,
    getAllDevFeedback,
};