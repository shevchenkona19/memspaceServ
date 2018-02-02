var passportJWT = require("passport-jwt");
var jwt = require('jsonwebtoken');
var db = require("../model/db");

module.exports = function(passport, jwtOptions){
  var ExtractJwt = passportJWT.ExtractJwt;
  var JwtStrategy = passportJWT.Strategy;

  jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  jwtOptions.secretOrKey = process.env.SECRETORKEY;
  
  var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    db.query('SELECT * FROM users WHERE userid = $1', [jwt_payload.id], (err, data) => {
      if(data.rows[0]){
        next(null, data.rows[0]);
      } else {
        next(null, false);
      }
    })
  });
  passport.use(strategy);
};