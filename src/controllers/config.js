const ModelLocator = require("../model/index");
const ErrorCodes = require("../constants/errorCodes");
const Categories = ModelLocator.getCategoriesModel();
const UsersCategories = ModelLocator.getUsersCategoriesModel();
const ImagesCategories = ModelLocator.getImagesCategoriesModel();

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
        truncate: true
    });
    await UsersCategories.bulkCreate(usersCategories);
    return {
        success: true
    }
}

async function getPersonalCategories(userId) {
    const selCategories = await UsersCategories.findAll({where: {userId}});
    const allCategories = await Categories.findAll();

    if (selCategories.length === 0) return {success: true, categories: []};

    const categories = [];

    allCategories.forEach(category => {
        let isUsed = false;
        for (let i = 0; i < selCategories.length; i++) {
            if (category.get("categoryId") === selCategories[i].get("categoryId")) {
                isUsed = true;
                selCategories.splice(i, 1);
                break;
            }
        }
        categories.push({
            categoryName: category.get("categoryName"),
            categoryIsUsed: isUsed,
            categoryId: category.get("categoryId")
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

checkPrev = (arr, id) => {
    if (id === -1) return false;
    return arr.some(item => item.imageId === id)
};

module.exports = {
    getCategories,
    saveCategories,
    getPersonalCategories,
    getTest
};