const passport = require("passport");
const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8888;

const app = express();

//Настройки авторизации
let jwtOptions = {};
require('./src/config/passport')(passport, jwtOptions);
app.use(passport.initialize());

module.exports.passport = passport;
module.exports.jwtOptions = jwtOptions;

//Настройки bodyParser`a
app.use(bodyParser({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

const config = require('./src/routes/config');
const account = require('./src/routes/account');
const favorites = require('./src/routes/favorites');
const feed = require('./src/routes/feed');
const feedback = require('./src/routes/feedback');
const moderator = require('./src/routes/moderator');

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