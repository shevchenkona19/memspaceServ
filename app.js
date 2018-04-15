const passport = require("passport");
const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8888;

const app = express();

//Настройки авторизации
let jwtOptions = {};
require('./config/passport')(passport, jwtOptions);
app.use(passport.initialize());

module.exports.passport = passport;
module.exports.jwtOptions = jwtOptions;

//Настройки bodyParser`a
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const config = require('./routes/config');
const account = require('./routes/account');
const favorites = require('./routes/favorites');
const feed = require('./routes/feed');
const feedback = require('./routes/feedback');
const moderator = require('./routes/moderator');

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