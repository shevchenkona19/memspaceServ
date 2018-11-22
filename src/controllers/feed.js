const Images = require("../model/index").getImagesModel();
const Favorites = require("../model/index").getFavoritesModel();
const Likes = require("../model/index").getLikesModel();
const UsersCategories = require("../model/index").getUsersCategoriesModel();
const Sequelize = require("sequelize").Op;
const db = require("../model/index").getDb().sequelize;
const Users = require("../model/index").getUsersModel();
const ErrorCodes = require("../constants/errorCodes");
const resolveViewAchievement = require("../utils/achievement/resolvers").resolveViewAchievement;

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
    const feed = await db.query('SELECT images.\"imageId\", images.source, images.height, images.width, likes, dislikes, likes.opinion AS opinion, '
        + `(SELECT COUNT(*) FROM comments WHERE images.\"imageId\" = comments.\"imageId\") AS comments_count `
        + `FROM images LEFT OUTER JOIN likes ON likes.\"imageId\" = images.\"imageId\" AND likes.\"userId\" = ${userId} `
        + `ORDER BY \"imageId\" DESC LIMIT ${count} OFFSET ${offset}`, {model: Images});
    return {
        success: true,
        memes: feed === null ? [] : feed
    }
}

async function getCategoriesFeed(user, count, offset) {
    const userId = user.userId;
    const selCategories = await UsersCategories.findAll({
        where: {userId},
        attributes: [
            "categoryId"
        ]
    });
    let catStr = "";
    selCategories.forEach(cat => catStr = catStr.concat(`imagesCategories.\"categoryId\" = ` + cat.categoryId + ` OR `));
    if (catStr === "") {
        return {
            success: false,
            errorCode: ErrorCodes.NO_CATEGORIES
        };
    }
    catStr = catStr.substring(0, catStr.length - 4);
    const memes = await db.query(`SELECT images.\"imageId\", images.\"source\", images.\"height\", images.\"width\", likes, dislikes, likes.\"opinion\" AS opinion, `
        + `(SELECT COUNT(*) FROM comments WHERE images.\"imageId\" = comments.\"imageId\") AS comments_count FROM images `
        + `LEFT OUTER JOIN likes ON likes.\"imageId\" = images.\"imageId\" AND likes.\"userId\" = ${userId} `
        + `WHERE EXISTS (SELECT * FROM imagesCategories WHERE images.\"imageId\" = imagesCategories.\"imageId\" AND (${catStr})) `
        + `ORDER BY \"imageId\" DESC LIMIT ${count} OFFSET ${offset}`, {model: Images});
    const achievement = await resolveViewAchievement(user, count);
    return {
        success: true,
        memes: memes === null ? [] : memes,
        ...achievement
    }
}

async function getCategoryFeed(user, categoryId, count, offset) {
    const userId = user.userId;
    const memes = await db.query(`SELECT images.\"imageId\", images.source, images.height, images.width, likes, dislikes, likes.opinion AS opinion, `
        + `(SELECT COUNT(*) FROM comments WHERE images.\"imageId\" = comments.\"imageId\") AS comments_count `
        + `FROM images LEFT OUTER JOIN likes ON likes.\"imageId\" = images.\"imageId\" AND likes.\"userId\" = ${userId} WHERE `
        + `EXISTS (SELECT * FROM imagesCategories WHERE images.\"imageId\" = imagesCategories.\"imageId\" AND \"categoryId\" = ${categoryId}) `
        + `ORDER BY \"imageId\" DESC LIMIT ${count} OFFSET ${offset}`, {model: Images});
    const achievement = await resolveViewAchievement(user, count);
    return {
        success: true,
        memes: memes === null ? [] : memes,
        ...achievement
    }
}

async function getHotFeed(user, count, offset) {
    const userId = user.userId;
    const images = await Images.findAll({
        where: {
            createdAt: {
                [Sequelize.gt]: new Date(new Date() - 1000 * 60 * 60 * 24 * 3)
            }
        }
    });
    let avg = 0;
    images.forEach(image => {
        avg += image.likes;
        avg += image.comments;
        avg -= image.dislikes;
    });
    avg = Math.ceil(avg / images.length);
    const memes = await db.query('SELECT images.\"imageId\", images.source, images.height, images.width, likes, dislikes, likes.opinion AS opinion, '
        + `(SELECT COUNT(*) FROM comments WHERE images.\"imageId\" = comments.\"imageId\") AS comments_count `
        + `FROM images LEFT OUTER JOIN likes ON likes.\"imageId\" = images.\"imageId\" AND likes.\"userId\" = ${userId} WHERE \"createdAt\" > '${new Date(new Date() - 1000 * 60 * 60 * 24 * 3).toDateString()}' AND likes >= ${avg} `
        + `ORDER BY \"likes\" DESC, images.\"imageId\" LIMIT ${count} OFFSET ${offset}`, {model: Images});
    const achievement = await resolveViewAchievement(user, count);
    return {
        success: true,
        memes: memes === null ? [] : memes,
        ...achievement
    }
}

async function getImage(id) {
    const filename = await Images.findOne({where: {imageId: id}});
    if (filename === null) {
        throw new Error(ErrorCodes.NO_SUCH_IMAGE)
    }
    return {
        success: true,
        image: filename.imageData
    }
}

async function getUserPhoto(username) {
    const image = (await Users.findOne({where: {username}, attributes: ["imageData"]}));
    if (!image) {
        throw new Error(ErrorCodes.NO_SUCH_USER)
    }
    return {
        success: true,
        imageData: image.imageData
    }
}

async function getMemById(memId) {
    return await Images.findById(memId);
}

module.exports = {
    getImage,
    refreshMem,
    getMainFeed,
    getHotFeed,
    getCategoriesFeed,
    getCategoryFeed,
    getUserPhoto,
    getMemById
};



























