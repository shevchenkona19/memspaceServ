const passportJWT = require("passport-jwt");
const jwt = require('jsonwebtoken');
const Users = require("../model/index").getUsersModel();

module.exports = function (passport, jwtOptions) {
    const ExtractJwt = passportJWT.ExtractJwt;
    const JwtStrategy = passportJWT.Strategy;

    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    jwtOptions.secretOrKey = process.env.SECRETORKEY || "tasmanianDevil";

    const strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
        const user = await Users.findById(jwt_payload.id);
        if (user) {
            next(null, user);
        } else {
            next(null, false);
        }
    });
    passport.use(strategy);
};