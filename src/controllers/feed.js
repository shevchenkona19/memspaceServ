const Images = require("../model/index").getImagesModel();
const Favorites = require("../model/index").getFavoritesModel();
const Likes = require("../model/index").getLikesModel();
const UsersCategories = require("../model/index").getUsersCategoriesModel();
const db = require("../model/index").getDb();
const Users = require("../model/index").getUsersModel();
const ErrorCodes = require("../constants/errorCodes");

async function getImage(id) {
    const imageData = (await Images.findOne({where: {imageId: id}})).get("imageData");
    if (!imageData) {
        throw new Error(ErrorCodes.NO_SUCH_IMAGE)
    }
    return {
        success: true,
        imageData
    }
}

async function refreshMem(memId, userId) {
    const isFavorite = !!(await Favorites.findOne({where: {userId, imageId: memId}}));
    const memData = await Images.findOne({
        attributes: [
            "likes",
            "dislikes",
        ],
        where: {
            imageId: memId
        },
        include: [{
            model: Likes,
            attributes: [
                "opinion"
            ],
            required: false
        }],
    });
    if (!memData) {
        throw new Error(ErrorCodes.INCORRECT_DATA);
    }
    const memEnitiy = {
        likes: memData.get("likes"),
        dislikes: memData.get("dislikes"),
        opinion: memData.get("opinion"),
        isFavorite
    };

    return {
        success: true,
        memEnitiy
    }
}

async function getMainFeed(userId, count, offset) {
    const feed = await Images.findAll({
        attributes: [
            "imageId",
            "source",
            "height",
            "width",
            "likes",
            "dislikes",
        ],
        include: [{
            model: Likes,
            attributes: [
                "opinion"
            ],
            required: false,
            where: {
                userId
            }
        }],
        order: db.literal("imageId DESC"),
        limit: count,
        offset
    });
    return {
        success: true,
        memes: feed
    }
}

async function getCategoriesFeed(userId, count, offset) {
    const selCategories = await UsersCategories.findAll({
        where: {userId},
        attributes: [
            "categoryId"
        ]
    });
    let catStr = "";
    selCategories.forEach(cat => catStr.concat(`imagesCategories.categoryid = ` + cat.get("categoryId") + ` OR `));
    catStr = catStr.substring(0, catStr.length - 4);
    const memes = await db.query(`SELECT images.imageId, images.source, images.height, images.width, likes, dislikes, likes.opinion AS opinion FROM images `
        + `LEFT OUTER JOIN likes ON likes.imageId = images.imageId AND likes.userId = ${userId} `
        + `WHERE EXISTS (SELECT * FROM imagesCategories WHERE images.imageId = imagesCategories.imageId AND (${catStr})) `
        + `ORDER BY imageId DESC LIMIT ${count} OFFSET ${offset}`, {model: Images});
    return {
        success: true,
        memes
    }
}

async function getCategoryFeed(userId, categoryId, count, offset) {
    const memes = await db.query(`SELECT images.imageId, images.source, images.height, images.width, likes, dislikes, likes.opinion AS opinion `
        + `FROM images LEFT OUTER JOIN likes ON likes.imageId = images.imageId AND likes.userId = ${userId} WHERE `
        + `EXISTS (SELECT * FROM imagesCategories WHERE images.imageId = imagesCategories.imageId AND categoryId = ${categoryId}) `
        + `ORDER BY imageId DESC LIMIT ${count} OFFSET ${offset}`, {model: Images});
    return {
        success: true,
        memes
    }
}

async function getHotFeed(userId, count, offset) {
    const filter = process.env.HOTFILTER || 100;
    const memes = await db.query(`SELECT images.imageId, images.source, images.height, images.width, likes, dislikes, likes.opinion AS opinion '
        + 'FROM images LEFT OUTER JOIN likes ON likes.imageId = images.imageId AND likes.userId = ${userId} WHERE likes >= ${filter} '
        + 'ORDER BY imageId DESC LIMIT ${count} OFFSET ${offset}`, {model: Images});
    return {
        success: true,
        memes
    }
}

async function getUserPhoto(username) {
    const image = await Users.findOne({attributes: ["imageData"], where: {username}});
    if (!image) {
        throw new Error(ErrorCodes.NO_SUCH_USER)
    }
    return {
        success: true,
        image: image.get("imageDataa")
    }
}

module.exports = {
    getImage,
    refreshMem,
    getMainFeed,
    getHotFeed,
    getCategoriesFeed,
    getCategoryFeed,
    getUserPhoto
};



























