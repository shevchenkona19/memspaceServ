const Controller = require("../../controllers/feed");
const ErrorCodes = require("../../constants/errorCodes");

async function refreshMem(req, res) {
    if (!req.query.memId) {
        return res.status(400).json({message: 'incorrect query'})
    }
    const result = await Controller.refreshMem(req.query.memId, req.user.userId);
    if (result.success) {
        return res.json(result.memEntity);
    } else {
        return res.status(400).json({message: ErrorCodes.INTERNAL_ERROR});
    }
}

async function getMainFeed(req, res) {
    if (!req.query.count || !req.query.offset) {
        return res.status(400).json({message: "incorrect query"})
    }
    const result = await Controller.getMainFeed(req.user.userId, req.query.count, req.query.offset);
    if (result.success) {
        return res.json({memes: result.memes});
    } else {
        return res.status(400).json({message: ErrorCodes.INTERNAL_ERROR});
    }
}

async function getCategoriesFeed(req, res) {
    const count = req.query.count;
    const offset = req.query.offset;
    if (!count || !offset) {
        return res.status(400).json({message: "incorrect query"})
    }
    const result = await Controller.getCategoriesFeed(req.user, count, offset);
    if (result.success) {
        return res.json({
            memes: result.memes,
            achievementUpdate: result.achievementUpdate,
            achievement: result.achievement
        });
    } else {
        return res.json({message: result.errorCode, memes: []});
    }
}

async function getCategoryFeed(req, res) {
    const count = req.query.count;
    const offset = req.query.offset;
    const categoryId = req.query.categoryId;
    if (!count || !offset || !categoryId) {
        return res.status(400).json({message: "incorrect query"});
    }
    const result = await Controller.getCategoryFeed(req.user, categoryId, count, offset);
    if (result.success) {
        return res.json({
            memes: result.memes,
            achievementUpdate: result.achievementUpdate,
            achievement: result.achievement
        });
    } else {
        throw Error(ErrorCodes.INTERNAL_ERROR);
    }
}

async function getHotFeed(req, res) {
    const count = req.query.count;
    const offset = req.query.offset;
    if (!count || !offset) {
        return res.status(400).json({message: "incorrect query"});
    }
    const result = await Controller.getHotFeed(req.user, count, offset);
    if (result.success) {
        return res.json({
            memes: result.memes,
            achievementUpdate: result.achievementUpdate,
            achievement: result.achievement
        });
    } else {
        throw Error(ErrorCodes.INTERNAL_ERROR);
    }
}

async function getImgs(req, res, next) {
    if (!req.query.id) {
        return res.status(400).json({message: "incorrect query"});
    }
    const result = await Controller.getImage(req.query.id);
    if (result.success) {
        res.contentType('image/*');
        return res.sendFile(result.image);
    } else {
        next(new Error(ErrorCodes.INTERNAL_ERROR));
    }
}

async function getUserPhoto(req, res) {
    const targetUsername = req.query.targetUsername;
    if (!targetUsername) {
        return res.status(400).json({message: "incorrect query"});
    }
    const result = await Controller.getUserPhoto(targetUsername);
    if (result.success) {
        res.contentType('image/*');
        return res.sendFile(result.imageData, 'binary');
    } else {
        throw Error(ErrorCodes.INTERNAL_ERROR);
    }
}


async function getMemById(req, res) {
    const memId = req.query.memId;
    if (!memId) {
        return res.status(400).json({message: ErrorCodes.INCORRECT_DATA});
    }
    const mem = await Controller.getMemById(memId);
    if (mem) {
        const toSend = {
            imageId: mem.imageId,
            likes: mem.likes,
            dislikes: mem.dislikes,
            source: mem.source,
            width: mem.width,
            height: mem.height,
        };
        return res.json(toSend);
    } else {
        throw Error(ErrorCodes.NO_SUCH_MEM);
    }
}

module.exports = {
    refreshMem,
    getMainFeed,
    getCategoriesFeed,
    getCategoryFeed,
    getHotFeed,
    getImgs,
    getUserPhoto,
    getMemById
};