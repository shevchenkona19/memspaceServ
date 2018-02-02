//cd D:\OneDrive\Dust IT\MemSpace Server\serverapp
//localhost:3000/

//TODO:
// Разобрать bcrypt
// Разобрать .env
// Добавить return в методы
// Добавить колонки с категориями
// В getfeed отправлять Opinion (1 -1 0)
// error handler
// переписать с async await
var passport = require("passport");
var express = require("express");
var bodyParser = require("body-parser");
const PORT = process.env.PORT || 8888

var app = express();

//Настройки авторизации
var jwtOptions = {};
require('./config/passport')(passport, jwtOptions);
app.use(passport.initialize());

//Настройки bodyParser`a
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())

//routes
require('./routes/main')(app, passport, jwtOptions);

//vkapi
require('./vk/api')();
//getapi(154095846, 8, 1);
//setInterval(func, process.env.VKDELAY);

app.listen(PORT, function(){
    console.log(`Server is waiting for requests on port ${PORT}...`);
});