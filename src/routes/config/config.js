const images = require("../../app").imageFolder;
const Controller = require("../../controllers/config");
const ErrorCodes = require("../../constants/errorCodes");
const SuccessCodes = require("../../constants/successCodes");

async function getCategories(req, res) {
    const categories = await Controller.getCategories();
    return res.json({
        categories
    });
}

async function setSelectedCategories(req, res) {
    await Controller.saveCategories(req.body, req.user.userId);
    res.json({
        message: SuccessCodes.SUCCESS
    })
}

async function postPhoto(req, res) {
    if (!req.body.photo) {
        return res.status(401).json({message: 'incorrect quarry'})
    }
    const photo = req.body.photo;
    const mime = req.body.mime || "jpg";
    const filename = images + "/users/" + req.user.userId + req.user.username + mime;
    const result = await Controller.postPhoto(req.user.userId, filename, photo);
    if (result.success) {
        return res.json({message: SuccessCodes.SUCCESS})
    } else {
        return res.json({message: ErrorCodes.INTERNAL_ERROR})
    }
}

async function getPersonalCategories(req, res) {
    const result = await Controller.getPersonalCategories(req.user.userId);
    if (result.success) {
        res.json({
            categories: result.categories
        });
    }
}

async function getTest(req, res) {
    const result = await Controller.getTest();
    if (result.success) {
        res.json({
            test: result.test
        })
    }
}

module.exports = {
    getCategories,
    setSelectedCategories,
    postPhoto,
    getPersonalCategories,
    getTest
};