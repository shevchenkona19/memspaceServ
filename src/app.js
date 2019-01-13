const passport = require("passport");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const PORT = process.env.PORT || 8888;
const imageDownloader = require("./vk/api");
const cleaner = require("./controllers/cleaner");
const firebase = require("firebase-admin");
const serviceAccount = require("./firebase.json");
const notificationManager = require("./controllers/notificationManager");
const cors = require("cors");
require("./model/index");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://memspace-809c5.firebaseio.com"
});

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

const config = require('./routes/config/index');
const account = require('./routes/account/index');
const favorites = require('./routes/favourites/index');
const feed = require('./routes/feed/index');
const feedback = require('./routes/feedback/index');
const moderator = require('./routes/moderator/index');
const newAccount = require("./routes/new/account/index");
const newFavorites = require("./routes/new/favorites/index");
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
setInterval(notificationManager.notifyAboutMemes, process.env.NOTIFICATION_DELAY || 43200000, 1);

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`MemSpace server is ready`);
});
