const ErrorCodes = require("../../constants/errorCodes");
const Controller = require("../../controllers/moderator");
const imageDownloader = require("../../vk/api");

async function createCategory(req, res) {
    if (!req.body.categoryName) {
        return res.status(400).json({message: "incorrect query"});
    }
    const categoryName = req.body.categoryName;
    const result = await Controller.createCategory(categoryName);
    if (result.success) {
        return res.json({success: true});
    } else {
        throw Error(ErrorCodes.INTERNAL_ERROR);
    }
}

async function getImages(req, res) {
    if (!req.query.offset) {
        return res.status(400).json({message: "incorrect data"});
    }
    let offset = req.query.offset;

    await imageDownloader.getImages(offset);
    return res.status(200).json({message: "200"});
}

async function deleteCategory(req, res) {
    if (!req.query.id) {
        return res.status(400).json({message: "incorrect data"});
    }
    const id = req.query.id;
    const result = await Controller.deleteCategory(id);
    if (result.success) {
        return res.json({success: true});
    } else {
        throw Error(ErrorCodes.INTERNAL_ERROR);
    }
}

async function getNewMem(req, res, next) {
    const result = await Controller.getNewMem();
    if (result.success) {
        return res.json(result.mem);
    } else {
        next(new Error(ErrorCodes.INTERNAL_ERROR));
    }
}

async function discardMem(req, res, next) {
    if (!req.query.id) {
        return res.status(400).json({message: 'incorrect quarry'})
    }
    const id = req.query.id;
    const result = await Controller.discardMem(id);
    if (result.success) {
        return res.json({message: result.message});
    } else {
        next(new Error(ErrorCodes.INTERNAL_ERROR));
    }
}

async function postMem(req, res, next) {
    if (!(req.query.id && req.body.Ids)) {
        return res.status(400).json({message: "incorrect data"});
    }
    const id = req.query.id;
    const Ids = req.body.Ids;
    const result = await Controller.postMem(id, Ids);
    if (result.success) {
        return res.json({message: result.message});
    } else {
        next(new Error(ErrorCodes.INTERNAL_ERROR));
    }
}

async function clearMemes(req, res) {
    const result = await Controller.clearMemes();
    if (result.success) {
        return res.json({message: result.message});
    } else {
        throw Error(ErrorCodes.INTERNAL_ERROR);
    }
}

module.exports = {
    createCategory,
    getImages,
    deleteCategory,
    getNewMem,
    discardMem,
    postMem,
    clearMemes
};