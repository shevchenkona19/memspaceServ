var passportJWT = require("passport-jwt");
var jwt = require('jsonwebtoken');
var db = require("../model");

module.exports = function (passport, jwtOptions) {
  var ExtractJwt = passportJWT.ExtractJwt;
  var JwtStrategy = passportJWT.Strategy;

  jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  jwtOptions.secretOrKey = process.env.SECRETORKEY || "tasmanianDevil";

  var strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
    var data = await db.query('SELECT * FROM users WHERE userid = $1', [jwt_payload.id])
    if (data.rows[0]) {
      next(null, data.rows[0]);
    } else {
      next(null, false);
    }
  });
  passport.use(strategy);
};