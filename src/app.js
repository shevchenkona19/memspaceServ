const passport = require("passport");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const PORT = process.env.PORT || 8888;
const imageDownloader = require("./vk/api");
const cleaner = require("./controllers/cleaner");
require("./model/index");

//Настройки авторизации
let jwtOptions = {};
require('./middleware/passport')(passport, jwtOptions);

const app = express();
app.use(helmet());
app.use(passport.initialize());

const imagePath = __dirname + "/public";
const policyPath = __dirname + "/public/policy/index.html";

module.exports = {
    imageFolder: imagePath,
    policy: policyPath,
    passport,
    jwtOptions
};

//Настройки bodyParser`a
app.use(bodyParser({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

const config = require('./routes/config');
const account = require('./routes/account');
const favorites = require('./routes/favourites/index');
const feed = require('./routes/feed');
const feedback = require('./routes/feedback');
const moderator = require('./routes/moderator');
const newAccount = require("./routes/new/account");
const newFavorites = require("./routes/new/favorites");
const errorHandler = require("./middleware/errorHandler");
//routes
app.use('/v1/account', newAccount);
app.use('/v1/favorites', newFavorites);
app.use('/config', config);
app.use('/feed', feed);
app.use('/favorites', favorites);
app.use('/account', account);
app.use('/feedback', feedback);
app.use('/moderator', moderator);
app.use(errorHandler);

setInterval(imageDownloader.getImages, process.env.VKDELAY || 3600000, 1);
setInterval(cleaner.clearOldMemes, process.env.CLEAR_DELAY || 3600000, 1);

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`MemSpace server is ready`);
});
