const passport = require("passport");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
require("./model/index");
const PORT = process.env.PORT || 8888;
const HOST = process.env.SERVER_URL || 'localhost';

const app = express();

//Настройки авторизации
let jwtOptions = {};
require('./config/passport')(passport, jwtOptions);
app.use(passport.initialize());

module.exports.passport = passport;
module.exports.jwtOptions = jwtOptions;

//Настройки bodyParser`a
app.use(bodyParser({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

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
setInterval(require('./vk/api'), process.env.VKDELAY || 3600000, 1);

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`MemSpace server is ready`);
});

module.exports.imageFolder =  __dirname + "/public";