const ModelLocator = require("../model/index");
const ErrorCodes = require("../constants/errorCodes");
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const jwtOptions = require("../app").jwtOptions;
const Users = ModelLocator.getUsersModel();

async function login(body) {
    const username = body.username;
    const password = body.password;
    if (!username || !password) {
        throw new Error(ErrorCodes.INCORRECT_DATA);
    }
    const user = await Users.findOne({where: {username, password}});
    if (user === null) {
        throw new Error(ErrorCodes.NOT_REGISTERED)
    }
    const match = bcrypt.compareSync(password, user.get("password"));
    if (!match) {
        throw new Error(ErrorCodes.PASSWORDS_DONT_MATCH);
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

    const isEmailUnique = !!(await Users.findOne({where: {email}}));

    if (!isEmailUnique) {
        throw new Error(ErrorCodes.EMAIL_NOT_UNIQUE)
    }
    let image;
    try {
        image = fs.readFileSync("noimage.png");
    } catch (e) {
        return {
            success: false,
            errorCode: ErrorCodes.INTERNAL_ERROR
        };
    }
    if (!image) {
        throw new Error(ErrorCodes.INTERNAL_ERROR);
    }
    let user;
    try {
        const passwordToSave = bcrypt.hashSync(password);
        user = Users.build({username, password: passwordToSave, email, image});
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
    register
};