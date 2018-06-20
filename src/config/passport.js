const passportJWT = require("passport-jwt");
const jwt = require('jsonwebtoken');
const db = require("../model/index");

module.exports = function (passport, jwtOptions) {
    const ExtractJwt = passportJWT.ExtractJwt;
    const JwtStrategy = passportJWT.Strategy;

    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    jwtOptions.secretOrKey = process.env.SECRETORKEY || "tasmanianDevil";

    const strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
        try {
            var data = await db.query('SELECT * FROM users WHERE userid = $1', [jwt_payload.id]);
        }
        catch(err) {
            console.log(err.stack);
        }
        if (data.rows[0]) {
            next(null, data.rows[0]);
        } else {
            next(null, false);
        }
    });
    passport.use(strategy);
};