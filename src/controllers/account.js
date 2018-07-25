const ModelLocator = require("../model/index");
const ErrorCodes = require("../constants/errorCodes");
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const jwtOptions = require("../app").jwtOptions;
const Users = ModelLocator.getUsersModel();
const EmailValidator = require("../utils/validation/mailValidator");
const images = require("../app").imageFolder;

async function login(body) {
    const username = body.username;
    const password = body.password;
    if (!username || !password) {
        return {
            success: false,
            errorCode: ErrorCodes.INCORRECT_DATA
        }
    }
    const user = await Users.findOne({where: {username, password}});
    if (user === null) {
        return {
            success: false,
            errorCode: ErrorCodes.NOT_REGISTERED
        };
    }
    const match = bcrypt.compareSync(password, user.get("password"));
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
        token
    };
}

async function register(body) {
    const username = body.username;
    const password = body.password;
    const email = body.email;

    console.warn("Registering: ",username,password,email);

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
        const passwordToSave = await new Promise((resolve, reject) => {
            bcrypt.hash(password, undefined, undefined, function (err, hash) {
                if (err) reject(err);
                resolve(hash)
            });
        });
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
        token
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
        const passwordToSave = bcrypt.hashSync(password);
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

module.exports = {
    login,
    register,
    registerModer
};