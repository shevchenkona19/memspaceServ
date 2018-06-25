const ErrorCodes = require("../constants/errorCodes");
const SuccessCodes = require("../constants/successCodes");
const Categories = require("../model/index").getCategoriesModel();
const ImagesCategories = require("../model/index").getImagesCategoriesModel();
const UsersCategories = require("../model/index").getUsersCategoriesModel();
const Images = require("../model/index").getImagesModel();

async function createCategory(categoryName) {
    await Categories.build({
        categoryName
    }).save();
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
        attributes: ["imageId"],
        order: "imageId",
        limit: 1
    });
    if (!mem) {
        throw new Error(ErrorCodes.INTERNAL_ERROR);
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

module.exports = {
    postMem,
    discardMem,
    getNewMem,
    deleteCategory,
    createCategory
};