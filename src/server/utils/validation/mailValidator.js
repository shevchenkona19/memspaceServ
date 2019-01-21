const hostnameValidator = require("./hostnameValidator");

const isEmail = function (value) {
    if (typeof value !== "string") {
        return false;
    }

    if ((value.indexOf("..") !== -1) || !(/^(.+)@([^@]+)$/.test(value))) {
        return false;
    }

    const emailParts = {
        localPart: value.match(/^(.+)@([^@]+)$/)[1],
        hostname: value.match(/^(.+)@([^@]+)$/)[2]
    };

    if ((emailParts.localPart.length > 64) || (emailParts.hostname.length > 255)) {
        return false;
    }

    const hostname = hostnameValidator.isValid(emailParts.hostname);
    const local = /^[a-zA-Z0-9%\-_!?^`}{|~#$&\'()*+/=]+(\x2e+[a-zA-Z0-9%-_!?^`}{|~#$&\'()*+/=]+)*$/.test(emailParts.localPart);

    return local && hostname;
};

module.exports = {
    isEmail
};
