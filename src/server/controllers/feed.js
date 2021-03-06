const ModelLocator = require("../model");
const Images = ModelLocator.getImagesModel();
const Favorites = ModelLocator.getFavoritesModel();
const Likes = ModelLocator.getLikesModel();
const UsersCategories = ModelLocator.getUsersCategoriesModel();
const Sequelize = require("sequelize").Op;
const db = ModelLocator.getDb().sequelize;
const Users = ModelLocator.getUsersModel();
const FeedTime = ModelLocator.getFeedTime();
const ErrorCodes = require("../constants/errorCodes");
const resolveViewAchievement = require("../utils/achievement/resolvers").resolveViewAchievement;
const images = require("../app").imageFolder;
const moment = require("moment-timezone");

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
    const feed = await db.query('SELECT images.\"imageId\", images.source, images.height, images.width, images.\"createdAt\" likes, dislikes, likes.opinion AS opinion, '
        + `(SELECT COUNT(*) FROM comments WHERE images.\"imageId\" = comments.\"imageId\") AS comments_count, `
        + `uploads."userId", uploads."uploadDate", users.username `
        + `FROM images LEFT OUTER JOIN likes ON likes.\"imageId\" = images.\"imageId\" AND likes.\"userId\" = ${userId} `
        + `LEFT OUTER JOIN uploads ON uploads.id = images."uploadId" `
        + `LEFT OUTER JOIN users ON users."userId" = uploads."userId" `
        + `WHERE images.\"isChecked\" = 1 `
        + `ORDER BY \"createdAt\" DESC LIMIT ${count} OFFSET ${offset}`, {model: Images});
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
    let isOne = false;
    let isTwo = false;
    selCategories.forEach(cat => {
        if (cat.categoryId === 1) isOne = true;
        if (cat.categoryId === 2) isTwo = true;
        catStr = catStr.concat(`imagesCategories.\"categoryId\" = ` + cat.categoryId + ` OR `);
    });
    if (!isOne) {
        catStr = catStr.concat(`imagesCategories.\"categoryId\" = 1 OR `)
    }
    if (!isTwo) {
        catStr = catStr.concat(`imagesCategories.\"categoryId\" = 2 OR `)
    }
    if (catStr === "") {
        return {
            success: false,
            errorCode: ErrorCodes.NO_CATEGORIES
        };
    }
    catStr = catStr.substring(0, catStr.length - 4);
    const feedTime = await getFeedTime(userId, offset, true, false, false);
    const memes = await db.query(`SELECT images.\"imageId\", images.\"source\", images.\"height\", images.\"width\",images.\"createdAt\", likes, dislikes, likes.\"opinion\" AS opinion, `
        + `(SELECT COUNT(*) FROM comments WHERE images.\"imageId\" = comments.\"imageId\") AS comments_count, `
        + `(select \"imageId\" from favorites where images.\"imageId\" = favorites.\"imageId\" and favorites.\"userId\" = ${userId} limit 1) is not null as "isFavourite", `
        + `uploads."userId", uploads."uploadDate", users.username `
        + `FROM images `
        + `LEFT OUTER JOIN likes ON likes.\"imageId\" = images.\"imageId\" AND likes.\"userId\" = ${userId} `
        + `LEFT OUTER JOIN uploads ON uploads.id = images."uploadId" `
        + `LEFT OUTER JOIN users ON uploads."userId" = users."userId" `
        + `WHERE EXISTS (SELECT * FROM imagesCategories WHERE images.\"imageId\" = imagesCategories.\"imageId\" AND (${catStr})) AND \"createdAt\" < TO_TIMESTAMP('${moment(feedTime.timestamp).format("YYYY/MM/DD HH:mm:ss")}', 'YYYY/MM/DD HH24:MI:SS') `
        + `ORDER BY \"createdAt\" DESC LIMIT ${count} OFFSET ${offset}`, {model: Images});
    const achievement = await resolveViewAchievement(user, count);
    return {
        success: true,
        memes: memes === null ? [] : memes,
        ...achievement
    }
}

async function getCategoryFeed(user, categoryId, count, offset) {
    const userId = user.userId;
    const feedTime = await getFeedTime(userId, offset, false, false, true);

    const memes = await db.query(`SELECT images.\"imageId\", images.source, images.height, images.width, images.\"createdAt\", likes, dislikes, likes.opinion AS opinion, `
        + `(SELECT COUNT(*) FROM comments WHERE images.\"imageId\" = comments.\"imageId\") AS comments_count, `
        + `(select \"imageId\" from favorites where images.\"imageId\" = favorites.\"imageId\" and favorites.\"userId\" = ${userId} limit 1) is not null as \"isFavourite\", `
        + `uploads."userId", uploads."uploadDate", users."username" `
        + `FROM images LEFT OUTER JOIN likes ON likes.\"imageId\" = images.\"imageId\" AND likes.\"userId\" = ${userId} `
        + `LEFT OUTER JOIN uploads ON uploads.id = images."uploadId" `
        + `LEFT OUTER JOIN users ON uploads."userId" = users."userId" `
        + `WHERE EXISTS (SELECT * FROM imagesCategories WHERE images.\"imageId\" = imagesCategories.\"imageId\" AND \"categoryId\" = ${categoryId}) AND \"createdAt\" < TO_TIMESTAMP('${moment(feedTime.timestamp).format("YYYY/MM/DD HH:mm:ss")}', 'YYYY/MM/DD HH24:MI:SS')`
        + `ORDER BY \"createdAt\" DESC LIMIT ${count} OFFSET ${offset}`, {model: Images});
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
    const feedTime = await getFeedTime(userId, offset, false, true, false);

    const memes = await db.query('SELECT images.\"imageId\", images.source, images.height, images.width, likes, dislikes, likes.opinion AS opinion, '
        + `(SELECT COUNT(*) FROM comments WHERE images.\"imageId\" = comments.\"imageId\") AS comments_count, `
        + `(select \"imageId\" from favorites where images.\"imageId\" = favorites.\"imageId\" and favorites.\"userId\" = ${userId} limit 1) is not null as \"isFavourite\", `
        + `uploads."userId", uploads."uploadDate", users."username" `
        + `FROM images LEFT OUTER JOIN likes ON likes.\"imageId\" = images.\"imageId\" AND likes.\"userId\" = ${userId} `
        + `LEFT OUTER JOIN uploads ON uploads.id = images."uploadId" `
        + `LEFT OUTER JOIN users ON uploads."userId" = users."userId" `
        + `WHERE \"createdAt\" > '${new Date(new Date() - 1000 * 60 * 60 * 24 * 3).toDateString()}' AND likes >= ${avg} AND \"createdAt\" < TO_TIMESTAMP('${moment(feedTime.timestamp).format("YYYY/MM/DD HH:mm:ss")}', 'YYYY/MM/DD HH24:MI:SS') `
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

async function getFeedTime(userId, offset, isFeed, isHot, isCategories) {
    let feedTime = await FeedTime.findOne({where: {userId, isFeed, isHot, isCategories}});
    if (parseInt(offset) === 0) {
        if (!feedTime) {
            feedTime = FeedTime.build({
                userId,
                isFeed,
                isHot,
                isCategories,
                timestamp: moment(new Date()).format("YYYY/MM/DD HH:mm:ss")
            });
        } else {
            feedTime.timestamp = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");
        }
        await feedTime.save();
    }
    return feedTime;
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



























