const ErrorCodes = require("../constants/errorCodes");
const SuccessCodes = require("../constants/successCodes");
const Categories = require("../model").getCategoriesModel();
const ImagesCategories = require("../model").getImagesCategoriesModel();
const UsersCategories = require("../model").getUsersCategoriesModel();
const Images = require("../model").getImagesModel();
const fs = require("fs");
const FileRemover = require("../utils/files/FileRemover");

async function createCategory(categoryName) {
    const category = Categories.build({
        categoryName
    });
    await category.save();
    return {
        success: true,
        message: SuccessCodes.SUCCESS
    }
}

async function deleteCategory(categoryId) {
    await Categories.destroy({where: {categoryId}});
    await ImagesCategories.destroy({where: {categoryId}});
    await UsersCategories.destroy({where: {categoryId}});
    return {
        success: true,
        message: SuccessCodes.SUCCESS
    }
}

async function getNewMem() {
    const mem = await Images.findOne({
        where: {isChecked: '0'},
        attributes: ["imageId", "width", "height"],
        order: [
            ["imageId", "DESC"]
        ],
        limit: 1
    });
    if (mem === null) {
        return {
            success: false,
            message: ErrorCodes.MEMES_ENDED
        }
    }
    await mem.update({
        isChecked: '1'
    });
    return {
        success: true,
        mem
    }
}

async function discardMem(imageId) {
    const mem = await Images.findOne({where: {imageId}});
    if (mem === null) {
        return {success: true, message: SuccessCodes.SUCCESS}
    }
    if (fs.existsSync(mem.imageData)) {
        fs.unlinkSync(mem.imageData);
    }
    await Images.destroy({where: {imageId}});
    return {success: true, message: SuccessCodes.SUCCESS}
}

async function postMem(imageId, categoryIds) {
    const images = categoryIds.map(categoryId => {
        return {imageId, categoryId}
    });
    await ImagesCategories.bulkCreate(images);
    return {
        success: true,
        message: SuccessCodes.SUCCESS
    }
}

async function clearMemes() {
    const images = await Images.findAll({
        where: {
            isChecked: 0,
        },
        attributes: ["imageData"]
    });
    if (images) {
        FileRemover.deleteFiles(images.map(image => image.imageData));
        await Images.destroy({where: {isChecked: '0'}, truncate: false});
    }
    return {success: true, message: SuccessCodes.SUCCESS};

}

module.exports = {
    postMem,
    discardMem,
    getNewMem,
    deleteCategory,
    createCategory,
    clearMemes
};