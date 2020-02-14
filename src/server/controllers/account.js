const ModelLocator = require("../model");
const ErrorCodes = require("../constants/errorCodes");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtOptions = require("../app").jwtOptions;
const Users = ModelLocator.getUsersModel();
const EmailValidator = require("../utils/validation/mailValidator");
const images = require("../app").imageFolder;
const saltRounds = 10;
const Achievements = require("../constants/achievementLevels");
const Referral = ModelLocator.getReferral();
const codeGen = require("../utils/referral/codeGen");
const AccessLevels = require("../constants/accessLevels");
const Images = ModelLocator.getImagesModel();
const ImagesCategories = ModelLocator.getImagesCategoriesModel();
const Uploads = ModelLocator.getUploads();
const db = ModelLocator.getDb().sequelize;
const fs = require("fs");
const resolveReferralAchievement = require("../utils/achievement/resolvers").resolveReferralAchievement;
const Validator = require("../utils/validation/registerValidator");

async function login(body) {
    const username = body.username;
    const password = body.password;
    if (!username || !password) {
        return {
            success: false,
            errorCode: ErrorCodes.INCORRECT_DATA
        }
    }
    if (username === "" || password === "") {
        return {
            success: false,
            errorCode: ErrorCodes.INCORRECT_DATA
        }
    }
    const user = await Users.findOne({where: {username}});
    if (user === null) {
        return {
            success: false,
            errorCode: ErrorCodes.NOT_REGISTERED
        };
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return {
            success: false,
            errorCode: ErrorCodes.PASSWORDS_DONT_MATCH
        }
    }
    const payload = {
        id: user.userId
    };
    const token = jwt.sign(payload, jwtOptions.secretOrKey);
    return {
        success: true,
        token,
        userId: user.userId
    };
}

async function register(body) {
    const res = Validator.checkParameters(body);
    if (!res.success) return res;

    const username = body.username;
    const password = body.password;
    const email = body.email;

    const isReferralRegister = Boolean(body.referral) && body.referral.length > 0;
    const referral = body.referral.toUpperCase();

    if (!EmailValidator.isEmail(email)) {
        return {
            success: false,
            errorCode: ErrorCodes.EMAIL_NOT_VALID
        };
    }

    const isEmailUnique = (await Users.findOne({where: {email}}));
    if (isEmailUnique !== null) {
        return {
            success: false,
            errorCode: ErrorCodes.EMAIL_NOT_UNIQUE
        };
    }
    const isUsernameUnique = await Users.findOne({where: {username}});
    if (isUsernameUnique !== null) {
        return {
            success: false,
            errorCode: ErrorCodes.USERNAME_NOT_VALID
        }
    }
    if (isReferralRegister) {
        const isReferralPresent = await Referral.findOne({where: {myCode: referral}});
        if (isReferralPresent === null) {
            return {
                success: false,
                errorCode: ErrorCodes.REFERRAL_NOT_PRESENT
            }
        }
        const user = await Users.findOne({where: {userId: isReferralPresent.userId}});
        await resolveReferralAchievement(user, user.referralCount + 1);
    }
    const userImage = images + "/users/noimage.png";
    let user;
    try {
        const passwordToSave = await bcrypt.hash(password, saltRounds);
        user = Users.build({username, password: passwordToSave, email, imageData: userImage});
        await user.save();
        let myCode = "";
        do {
            myCode = codeGen.genStringId();
        } while (Boolean(await Referral.findOne({where: {myCode}})));
        const referralRef = Referral.build({
            userId: user.userId,
            myCode,
            usedCode: isReferralRegister ? referral : null
        });
        await referralRef.save();
    } catch (e) {
        console.error(e);
        return {
            success: false,
            errorCode: ErrorCodes.INTERNAL_ERROR
        }
    }
    const token = jwt.sign({
        id: user.userId
    }, jwtOptions.secretOrKey);

    return {
        success: true,
        token,
        userId: user.userId,
    };
}

async function registerModer(body) {
    const res = Validator.checkParameters(body);
    if (!res.success) return res;

    const username = body.username;
    const password = body.password;
    const email = body.email;

    const isEmailUnique = (await Users.findOne({where: {email}}));

    if (isEmailUnique !== null) {
        return {
            success: false,
            errorCode: ErrorCodes.EMAIL_NOT_UNIQUE
        };
    }
    let image = images + "/users/noimage.png";
    let user;
    try {
        const passwordToSave = await bcrypt.hash(password, saltRounds);
        user = Users.build({username, password: passwordToSave, email, imageData: image, accessLvl: 3});
        await user.save();
    } catch (e) {
        return {
            success: false,
            errorCode: ErrorCodes.INTERNAL_ERROR
        }
    }
    const token = jwt.sign({
        id: user.get("userId")
    }, jwtOptions.secretOrKey);

    return {
        success: true,
        token
    };
}

async function getUserAchievementsById(id) {
    const user = await Users.findById(id);
    if (user === null) {
        return {
            success: false,
            errorCode: ErrorCodes.NO_SUCH_USER
        };
    }

    return {
        likes: {
            lvl: user.likeAchievementLvl,
            count: user.likesCount,
            nextPrice: Achievements.likes.levels[user.likeAchievementLvl].price,
            isFinalLevel: Achievements.likes.levels[user.likeAchievementLvl].isFinalLevel,
            name: "likes",
            achievementName: Achievements.likes.levels[user.likeAchievementLvl].name,
            allNames: Achievements.likes.allNames
        },
        dislikes: {
            lvl: user.dislikesAchievementLvl,
            count: user.dislikesCount,
            nextPrice: Achievements.dislikes.levels[user.dislikesAchievementLvl].price,
            isFinalLevel: Achievements.dislikes.levels[user.dislikesAchievementLvl].isFinalLevel,
            name: "dislikes",
            achievementName: Achievements.dislikes.levels[user.dislikesAchievementLvl].name,
            allNames: Achievements.dislikes.allNames
        },
        comments: {
            lvl: user.commentsAchievementLvl,
            count: user.commentsCount,
            nextPrice: Achievements.comments.levels[user.commentsAchievementLvl].price,
            isFinalLevel: Achievements.comments.levels[user.commentsAchievementLvl].isFinalLevel,
            name: "comments",
            achievementName: Achievements.comments.levels[user.commentsAchievementLvl].name,
            allNames: Achievements.comments.allNames
        },
        favourites: {
            lvl: user.favouritesAchievementLvl,
            count: user.favouritesCount,
            nextPrice: Achievements.favourites.levels[user.favouritesAchievementLvl].price,
            isFinalLevel: Achievements.favourites.levels[user.favouritesAchievementLvl].isFinalLevel,
            name: "favourites",
            achievementName: Achievements.favourites.levels[user.favouritesAchievementLvl].name,
            allNames: Achievements.favourites.allNames
        },
        views: {
            lvl: user.viewsAchievementLvl,
            count: user.viewsCount,
            nextPrice: Achievements.views.levels[user.viewsAchievementLvl].price,
            isFinalLevel: Achievements.views.levels[user.viewsAchievementLvl].isFinalLevel,
            name: "views",
            achievementName: Achievements.views.levels[user.viewsAchievementLvl].name,
            allNames: Achievements.views.allNames
        },
        referral: {
            lvl: user.referralAchievementLvl,
            count: user.referralCount,
            nextPrice: Achievements.referral.levels[user.referralAchievementLvl].price,
            isFinalLevel: Achievements.referral.levels[user.referralAchievementLvl].isFinalLevel,
            name: "referral",
            achievementName: Achievements.referral.levels[user.referralAchievementLvl].name,
            allNames: Achievements.referral.allNames
        },
        firstHundred: user.firstHundred,
        firstThousand: user.firstThousand
    };


}

async function getUsername(id) {
    return {username: (await Users.findById(id)).username, success: true}
}

async function setFcmId(fcmId, userId) {
    if (fcmId === "") fcmId = null;
    await Users.update(
        {fcmId},
        {where: {userId}}
    );
    return {
        success: true
    }
}

async function getMyReferralInfo(user) {
    const ref = await Referral.findOne({where: {userId: user.userId}});
    if (ref === null) {
        return {
            success: false,
            message: ErrorCodes.NO_SUCH_USER
        }
    }
    return {
        success: true,
        ref: {
            userId: ref.userId,
            myCode: ref.myCode,
            usedCode: ref.usedCode,
        }
    }
}

async function uploadMeme(user, categories, imageData) {
    let imageId;
    let filename;
    do {
        imageId = codeGen.getIntId(10);
    } while (await Images.findById(imageId));
    filename = `${images}/memes/${imageId}--${user.userId}.jpg`;
    if (!fs.existsSync(images + "/memes")) {
        await new Promise(((resolve, reject) => {
            fs.mkdir(images + "/memes", err => {
                if (err) reject(err);
                resolve();
            });
        }))
    }
    if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename, imageData, "base64");
        const uploadInstance = Uploads.build({
            userId: user.userId,
            imageId: null
        });
        await uploadInstance.save();
        const image = Images.build({
            imageId,
            imageData: filename,
            source: "",
            isChecked: 1,
            uploadId: uploadInstance.id,
        });
        await image.save();
        uploadInstance.imageId = imageId;
        await uploadInstance.save();
        categories = categories.charAt(categories.length - 1) === ' ' ? categories.slice(0, categories.length - 1) : categories;
        const imagesCategories = categories.split(" ").map(categoryId => {
            return {imageId: image.imageId, categoryId}
        });
        await ImagesCategories.bulkCreate(imagesCategories);
        return {
            success: true,
        }
    }
    return {
        success: false,
        message: ErrorCodes.IMAGE_ALREADY_EXISTS,
    }
}

async function getUserUploads(userId, offset, limit, me) {
    const isRegistered = me.accessLvl !== AccessLevels.NOT_REGISTERED;
    const query = `SELECT images."imageId", likes, dislikes, likes.opinion AS opinion, `
        + `(SELECT COUNT(*) FROM comments WHERE images."imageId" = comments."imageId") AS comments_count, `
        + (isRegistered ? `(select "imageId" from favorites where images."imageId" = favorites."imageId" and favorites."userId" = ${me.userId} limit 1) is not null as "isFavourite", ` : "")
        + `users.username, uploads."userId", uploads."uploadDate" `
        + `FROM images LEFT OUTER JOIN likes ON likes."imageId" = images."imageId" AND likes."userId" = ${userId} `
        + `INNER JOIN uploads ON images."uploadId" = uploads.id `
        + `LEFT OUTER JOIN users ON users."userId" = uploads."userId" `
        + `WHERE images."isChecked" = 1 AND uploads."userId" = ${userId} ORDER BY uploads."uploadDate" DESC LIMIT ${limit} OFFSET ${offset};`;
    const uploadsData = (await db.query(query));
    if (uploadsData[0].length) {
        const uploads = uploadsData[0];
        return {
            success: true,
            uploads
        }
    } else {
        return {
            success: true,
            uploads: []
        }
    }
}

module.exports = {
    getUsername,
    getUserAchievementsById,
    login,
    register,
    registerModer,
    setFcmId,
    getMyReferralInfo,
    uploadMeme,
    getUserUploads
};