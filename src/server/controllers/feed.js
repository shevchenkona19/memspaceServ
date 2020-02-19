const Images = require("../model").getImagesModel();
const Favorites = require("../model").getFavoritesModel();
const Likes = require("../model").getLikesModel();
const UsersCategories = require("../model").getUsersCategoriesModel();
const Sequelize = require("sequelize").Op;
const db = require("../model").getDb().sequelize;
const Users = require("../model").getUsersModel();
const ErrorCodes = require("../constants/errorCodes");
const resolveViewAchievement = require("../utils/achievement/resolvers").resolveViewAchievement;
const images = require("../app").imageFolder;

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
        + `(SELECT COUNT(*) FROM comments WHERE images.\"imageId\" = comments.\"imageId\") AS comments_count, `
        + `uploads."userId", uploads."uploadDate", users.username `
        + `FROM images LEFT OUTER JOIN likes ON likes.\"imageId\" = images.\"imageId\" AND likes.\"userId\" = ${userId} `
        + `LEFT OUTER JOIN uploads ON uploads.id = images."uploadId" `
        + `LEFT OUTER JOIN users ON users."userId" = uploads."userId" `
        + `WHERE images.\"isChecked\" = 1 `
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
        + `(SELECT COUNT(*) FROM comments WHERE images.\"imageId\" = comments.\"imageId\") AS comments_count, `
        + `(select \"imageId\" from favorites where images.\"imageId\" = favorites.\"imageId\" and favorites.\"userId\" = ${userId} limit 1) is not null as "isFavourite", `
        + `uploads."userId", uploads."uploadDate", users.username `
        + `FROM images `
        + `LEFT OUTER JOIN likes ON likes.\"imageId\" = images.\"imageId\" AND likes.\"userId\" = ${userId} `
        + `LEFT OUTER JOIN uploads ON uploads.id = images."uploadId" `
        + `LEFT OUTER JOIN users ON uploads."userId" = users."userId" `
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
        + `(SELECT COUNT(*) FROM comments WHERE images.\"imageId\" = comments.\"imageId\") AS comments_count, `
        + `(select \"imageId\" from favorites where images.\"imageId\" = favorites.\"imageId\" and favorites.\"userId\" = ${userId} limit 1) is not null as \"isFavourite\", `
        + `uploads."userId", uploads."uploadDate", users."username" `
        + `FROM images LEFT OUTER JOIN likes ON likes.\"imageId\" = images.\"imageId\" AND likes.\"userId\" = ${userId} `
        + `LEFT OUTER JOIN uploads ON uploads.id = images."uploadId" `
        + `LEFT OUTER JOIN users ON uploads."userId" = users."userId" `
        + `WHERE EXISTS (SELECT * FROM imagesCategories WHERE images.\"imageId\" = imagesCategories.\"imageId\" AND \"categoryId\" = ${categoryId}) `
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
    if (!avg) avg = 0;
    const memes = await db.query('SELECT images.\"imageId\", images.source, images.height, images.width, likes, dislikes, likes.opinion AS opinion, '
        + `(SELECT COUNT(*) FROM comments WHERE images.\"imageId\" = comments.\"imageId\") AS comments_count, `
        + `(select \"imageId\" from favorites where images.\"imageId\" = favorites.\"imageId\" and favorites.\"userId\" = ${userId} limit 1) is not null as \"isFavourite\", `
        + `uploads."userId", uploads."uploadDate", users."username" `
        + `FROM images LEFT OUTER JOIN likes ON likes.\"imageId\" = images.\"imageId\" AND likes.\"userId\" = ${userId} `
        + `LEFT OUTER JOIN uploads ON uploads.id = images."uploadId" `
        + `LEFT OUTER JOIN users ON uploads."userId" = users."userId" `
        + `WHERE \"createdAt\" > '${new Date(new Date() - 1000 * 60 * 60 * 24 * 3).toDateString()}' AND likes >= ${avg} `
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
        return {
            success: false, errorCode: (ErrorCodes.NO_SUCH_IMAGE)
        };
    }
    return {
        success: true,
        image: filename.imageData
    }
}

async function getUserPhoto(username) {
    let image = await Users.findOne({where: {username}, attributes: ["imageData"]});
    if (!image) {
        if (image.imageData === "")
            image = {
                imageData: images + "/users/noimage.png"
            };
    }
    return {
        success: true,
        imageData: image.imageData
    }
}

async function getMemById(memId) {
    return await Images.findById(memId);
}

async function searchUser(username) {
    const foundUsers = await Users.findAll({
        where: {username: {$like: '%' + username + '%'}},
        limit: 10,
        attributes: ["username", "userId"]
    });
    return {
        success: true,
        foundUsers
    }
}

module.exports = {
    getImage,
    refreshMem,
    getMainFeed,
    getHotFeed,
    getCategoriesFeed,
    getCategoryFeed,
    getUserPhoto,
    getMemById,
    searchUser
};



























