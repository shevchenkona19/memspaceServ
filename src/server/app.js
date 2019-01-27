const passport = require("passport");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const PORT = process.env.PORT || 8888;
const imageDownloader = require("./vk/api.js");
const cleaner = require("./controllers/cleaner");
const firebase = require("firebase-admin");
const serviceAccount = require("./firebase.json");
const notificationManager = require("./controllers/notificationManager");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

require("./model");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://memspace-809c5.firebaseio.com"
});

//Настройки авторизации
let jwtOptions = {};
require('./middleware/passport')(passport, jwtOptions);

const app = express();
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(passport.initialize());

const imagePath = __dirname + "/public";
const policyPath = __dirname + "/public/policy/index.html";
const main = path.join(__dirname, '../../dist/main.html');
const login = path.join(__dirname, '../../dist/login.html');


module.exports = {
    imageFolder: imagePath,
    policy: policyPath,
    main,
    login,
    passport,
    jwtOptions
};

//Настройки bodyParser`a
app.use(bodyParser({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

const config = require('./routes/config');
const account = require('./routes/account');
const favorites = require('./routes/favourites');
const feed = require('./routes/feed');
const feedback = require('./routes/feedback');
const moderator = require('./routes/moderator');
const newAccount = require("./routes/v1/account");
const newFavorites = require("./routes/v1/favorites");
const v2Favorites = require("./routes/v2/favorites");
const errorHandler = require("./middleware/errorHandler");
const admin = require("./routes/admin-site");
//routes
app.options('/*', cors());
app.use(express.static(path.join(__dirname, "../../dist")));
app.use('/v1/account', newAccount);
app.use('/v1/favorites', newFavorites);
app.use('/v2/favorites', v2Favorites);
app.use('/config', config);
app.use('/feed', feed);
app.use('/favorites', favorites);
app.use('/account', account);
app.use('/feedback', feedback);
app.use('/moderator', moderator);
app.use("/admin", admin);
app.use(errorHandler);

setInterval(imageDownloader.getImages, process.env.VKDELAY || 3600000, 1);
setInterval(cleaner.clearOldMemes, process.env.CLEAR_DELAY || 3600000, 1);
setInterval(notificationManager.notifyAboutMemes, process.env.NOTIFICATION_DELAY || 43200000, 1);

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`MemSpace server is ready`);
});
