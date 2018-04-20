var https = require('https');
var url = require('url');
var db = require('../model');
var request = require('async-request');
var request1 = require('request');

var groups = {
    //'Борщ': 460389,
    //'ЁП': 12382740,
    //'Булдыга':154095846,
    'IGM': 30602036,
    //'Смс приколы:D': 30532220,
    '4ch': 45745333,
    //'MDK': 57846937,
    //'MXK': 41437811,
    //'Корпорация зла': 29246653
    // 31976785, //Наука и техника
    // 30277672, //iFace
    // 28950133, //Интеллектуальный юмор
    // 34491673, //Убойные приколы
    // 41594691, //Сука.
    // 36775802, //Орлёнок
    // 32015300, //Без кота и жизнь не та
    // 39822792, //Улыбнуло:D
    // 20744542, //FUN
    // 40800148, //Чёрный юмор
    // 67580761, //КБ
    // 60203425, //Злой Негр
    // 26419239, //Смейся до слёз:D
    // 29534144, //Лентач
    // 44781847, //Институт Благородных Девиц
    // 39444069, //C H O P - C H O P
    // 90937359, //O h , y e s
    // 32041317, //9GAG
    // 145954878,//English Memes
    // 139419686,//Dank English Memes
    // 50059483, //Чоткий Паца
    // 131348832,//Файнi меми про Укр.лiт
};
//Vkapi
var getImages = async (offset) => {
    let path, response;
    for (let groupName in groups) {
        let groupId = groups[groupName];
        path = `https://api.vk.com/method/wall.get?access_token=${process.env.VKTOKEN}&owner_id=-${groupId}&count=1&offset=${offset}&v=5.73`;

        try {
            console.log('attempting to GET %j', path);
            response = await request(path);
            let body = JSON.parse(response.body);

            if (body && body.response && body.response.items && body.response.items[0]
                && body.response.items[0].attachments && body.response.items[0].attachments[0]
                && body.response.items[0].attachments[0].photo && body.response.items[0].attachments[0].photo.photo_604) {

                const height = body.response.items[0].attachments[0].photo.height;
                const width = body.response.items[0].attachments[0].photo.width;
                path = body.response.items[0].attachments[0].photo.photo_604;

                console.log('attempting to GET %j', path);
                request1({ url: path, encoding: null }, async (error, response, body) => {
                    await db.query('INSERT INTO images(imagedata, source, width, height) VALUES($1, $2, $3, $4)', [body, groupName, width, height])
                    console.log(body);
                    console.log('image downloaded');
                });
                //response = await request(path);
                //let imagedata = response.body.replace(/\0/g, '');
                
            } else console.log('not full response')
        } catch (err) {
            console.log(err.stack); 
            console.log('download failed');
            continue;
        }
    }
}

module.exports = getImages;