const passport = require("passport");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
require("./model/index");
const helmet = require("helmet");
const PORT = process.env.PORT || 8888;
const imageDownloader = require("./vk/api");
const cleaner = require("./controllers/cleaner");

const app = express();
app.use(helmet());

//Настройки авторизации
let jwtOptions = {};
require('./config/passport')(passport, jwtOptions);
app.use(passport.initialize());

const imagePath = __dirname + "/public";

module.exports = {
    imageFolder: imagePath,
    passport,
    jwtOptions
};

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

setInterval(imageDownloader.getImages, process.env.VKDELAY || 3600000, 1);
setInterval(cleaner.clearOldMemes, process.env.CLEAR_DELAY || 3600000, 1);

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`MemSpace server is ready`);
});
