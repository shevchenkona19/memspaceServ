const ModelLocator = require("../model");
const ErrorCodes = require("../constants/errorCodes");
const Categories = ModelLocator.getCategoriesModel();
const UsersCategories = ModelLocator.getUsersCategoriesModel();
const ImagesCategories = ModelLocator.getImagesCategoriesModel();
const Users = ModelLocator.getUsersModel();
const fs = require("fs");

async function getCategories() {
    return await Categories.findAll();
}

async function saveCategories(body, userId) {
    const ids = body.Ids;
    if (!ids) {
        throw new Error(ErrorCodes.INCORRECT_DATA);
    }
    const usersCategories = ids.map(categoryId => {
        return {userId, categoryId}
    });
    await UsersCategories.destroy({
        where: {userId},
        truncate: false
    });
    await UsersCategories.bulkCreate(usersCategories);
    return {
        success: true
    }
}

async function getPersonalCategories(userId) {
    let selCategories = await UsersCategories.findAll({where: {userId}});
    const allCategories = await Categories.findAll();
    if (selCategories === null) selCategories = [];

    const categories = [];

    allCategories.forEach(category => {
        let isUsed = false;
        if (selCategories.length > 0) {
            for (let i = 0; i < selCategories.length; i++) {
                if (category.categoryId === selCategories[i].categoryId) {
                    isUsed = true;
                    selCategories.splice(i, 1);
                    break;
                }
            }
        }
        categories.push({
            categoryName: category.categoryName,
            categoryIsUsed: isUsed,
            categoryId: category.categoryId
        })
    });

    return {
        success: true,
        categories
    }
}


async function getTest() {
    const categories = await Categories.findAll();
    let limit = 1;
    let offset = 0;
    let id = -1;
    let arr = [];

    for (let i = 0; i < categories.length; i++) {
        do {
            id = -1;
            const image = await ImagesCategories.getTest(categories[i], limit, offset);
            if (image !== null) {
                id = image.imageId;
                offset++;
            }
        } while (checkPrev(arr, id));
        if (id !== -1) {
            arr.push({
                imageId: id,
                categoryName: categories[i].categoryName
            });
            offset = 0;
        }
    }
    return {
        success: true,
        test: arr
    }
}

async function postPhoto(userId, filename, image) {
    const user = await Users.findOne({where: {userId}, attributes: ["imageData"]});
    const prevImage = user.imageData;
    if (!prevImage.includes("noimage.png"))
        fs.unlinkSync(prevImage);
    fs.writeFileSync(filename, image, "base64");
    await Users.update({
        imageData: filename
    }, {where: {userId}});
    return {
        success: true
    }
}

checkPrev = (arr, id) => {
    if (id === -1) return false;
    return arr.some(item => item.imageId === id)
};

module.exports = {
    getCategories,
    saveCategories,
    getPersonalCategories,
    getTest,
    postPhoto
};