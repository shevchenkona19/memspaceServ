const ModelLocator = require("../model/index");
const ErrorCodes = require("../constants/errorCodes");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtOptions = require("../app").jwtOptions;
const Users = ModelLocator.getUsersModel();
const EmailValidator = require("../utils/validation/mailValidator");
const images = require("../app").imageFolder;
const saltRounds = 10;
const Achievements = require("../constants/achievementLevels");

async function login(body) {
    const username = body.username;
    const password = body.password;
    if (!username || !password) {
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
        id: user.get("userId")
    };
    const token = jwt.sign(payload, jwtOptions.secretOrKey);
    return {
        success: true,
        token,
        userId: user.userId
    };
}

async function register(body) {
    const username = body.username;
    const password = body.password;
    const email = body.email;


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
    const userImage = images + "/users/noimage.png";
    let user;
    try {
        const passwordToSave = await bcrypt.hash(password, saltRounds);
        user = Users.build({username, password: passwordToSave, email, imageData: userImage});
        await user.save();
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
    const username = body.username;
    const password = body.password;
    const email = body.email;

    const isEmailUnique = (await Users.findOne({where: {email}}));

    if (isEmailUnique !== null) {
        throw new Error(ErrorCodes.EMAIL_NOT_UNIQUE)
    }
    let image = images + "/users/noimage.png";
    let user;
    try {
        const passwordToSave = await bcrypt.hash(password, saltRounds);
        user = Users.build({username, password: passwordToSave, email, imageData: image, accessLvl: 3});
        await user.save();
    } catch (e) {
        console.log(e.message);
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
        throw new Error(ErrorCodes.NO_SUCH_USER)
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
        firstHundred: user.firstHundred,
        firstThousand: user.firstThousand
    };


}

async function getUsername(id) {
    return {username: (await Users.findById(id)).username, success: true}
}

async function setFcmId(fcmId, userId) {
    await Users.update(
        {fcmId},
        {where: {userId}}
    );
    return {
        success: true
    }
}

module.exports = {
    getUsername,
    getUserAchievementsById,
    login,
    register,
    registerModer,
    setFcmId
};