var passport = require("passport");
var express = require("express");
var bodyParser = require("body-parser");
const PORT = process.env.PORT || 8888;

var app = express();

//Настройки авторизации
var jwtOptions = {};
require('./config/passport')(passport, jwtOptions);
app.use(passport.initialize());

module.exports.passport = passport;
module.exports.jwtOptions = jwtOptions;

//Настройки bodyParser`a
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var config = require('./routes/config');
var account = require('./routes/account');
var favorites = require('./routes/favorites');
var feed = require('./routes/feed');
var feedback = require('./routes/feedback');
var moderator = require('./routes/moderator');

//routes
app.use('/config', config);
app.use('/feed', feed);
app.use('/favorites', favorites);
app.use('/account', account);
app.use('/feedback', feedback);
app.use('/moderator', moderator);
//require('./routes')(app, passport, jwtOptions);

//getapi(154095846, 8, 1);
//setInterval(func, process.env.VKDELAY);

app.listen(PORT, function(){
    console.log(`Server is waiting for requests on port ${PORT}...`);
});