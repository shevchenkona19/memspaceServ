const checkParameters = (body) => {
    const username = body.username;
    const password = body.password;
    const email = body.email;
    if (!username || !password || !email) {
        return {
            success: false,
            errorCode: ErrorCodes.INCORRECT_DATA
        }
    }
    if (username === "" || password === "" || email === "") {
        return {
            success: false,
            errorCode: ErrorCodes.INCORRECT_DATA
        }
    }
    return {success: true};
};

module.exports = {
    checkParameters
}