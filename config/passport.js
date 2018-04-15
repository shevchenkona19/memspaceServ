const passportJWT = require("passport-jwt");
const jwt = require('jsonwebtoken');
const db = require("../model");

module.exports = function (passport, jwtOptions) {
    const ExtractJwt = passportJWT.ExtractJwt;
    const JwtStrategy = passportJWT.Strategy;

    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    jwtOptions.secretOrKey = process.env.SECRETORKEY || "tasmanianDevil";

    const strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
        const data = await db.query('SELECT * FROM users WHERE userid = $1', [jwt_payload.id]);
        if (data.rows[0]) {
            next(null, data.rows[0]);
        } else {
            next(null, false);
        }
    });
    passport.use(strategy);
};