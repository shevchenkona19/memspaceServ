var https = require('https');
var url = require('url');
//var HttpsProxyAgent = require('https-proxy-agent');
var db = require('../model');
var request = require('request');

var groups = {
    'Борщ': 460389,
    'ЁП': 12382740,
    //'Булдыга':154095846,
    'IGM': 30602036,
    'Смс приколы:D': 30532220,
    '4ch': 45745333,
    'MDK': 57846937,
    'MXK': 41437811,
    'Корпорация зла': 29246653
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
var getImages = function (offset) {
    var path;
    for (let key in groups) {
        let value = groups[key];
        path = `https://api.vk.com/method/wall.get?access_token=${process.env.VKTOKEN}&owner_id=-${value}&count=${process.env.POSTS_COUNT}&offset=${offset}&v=5.73`;

        console.log('attempting to GET %j', path);

        try {
            request({ url: path, encoding: null }, function (error, response, body) {
                body = JSON.parse(body);

                if (body && body.response && body.response.items && body.response.items[0]
                    && body.response.items[0].attachments && body.response.items[0].attachments[0]
                    && body.response.items[0].attachments[0].photo && body.response.items[0].attachments[0].photo.photo_604) {
                    path = body.response.items[0].attachments[0].photo.photo_604;
                    request({ url: path, encoding: null }, function (error, response, body) {
<<<<<<< HEAD
                        db.query('INSERT INTO images(imagedata, source) VALUES($1, $2)', [body, key], (err, data) => {
                            if (err) {
                                console.log(err.stack);
                            }
                            console.log('image downloaded');
                        })
=======
                        async () => {
                            try {
                                await db.query('INSERT INTO images(imagedata, source) VALUES($1, $2)', [body, key])
                            } catch (err) {
                                console.log(err.stack);
                            }
                        }
                        console.log('image downloaded');
>>>>>>> f006481d3aa49f31e3db712ff4be4d51ad370cb1
                    });
                } else console.log('not full response')
            });
        } catch (err) { continue; }
        // https.get(path, function (res) {
        //     var body = '';
        //     res.on('data', function (chunk) {
        //         try{
        //             body = JSON.parse(chunk);
        //         }
        //         catch(err) { return; }
        //         if(body && body.response && body.response[1].attachment && body.response[1].attachment.photo && body.response[1].attachment.photo.src_big){
        //             path = body.response[1].attachment.photo.src_big;
        //             https.get(path, function (res) {
        //                 res.on('data', function (chunk) {
        //                     //console.log(chunk);
        //                     db.query('INSERT INTO images(imagedata, source) VALUES($1, $2)', [chunk, key], (err, data) => { 

        //                     }) 
        //                 });
        //             });
        //         }
        //     });
        // });
    }
    // var proxy = process.env.HTTP_PROXY;
    // var path = `https://api.vk.com/method/wall.get?access_token=${process.env.VKTOKEN}&owner_id=-154095846&count=${process.env.POSTS_COUNT}&offset=0`;
    // // HTTPS endpoint for the proxy to connect to
    // var endpoint = path;
    // console.log('attempting to GET %j', endpoint);
    // var options = url.parse(endpoint);

    // // create an instance of the `HttpsProxyAgent` class with the proxy server information
    // var agent = new HttpsProxyAgent(proxy);
    // options.agent = agent;
    // https.get(options, function (res) {
    //     var body = '';
    //     res.on('data', function (chunk) {
    //         body = JSON.parse(chunk);
    //         endpoint = body.response[1].media.thumb_src;
    //         options = url.parse(endpoint);
    //         options.agent = agent;
    //         https.get(options, function (res) {
    //             res.on('data', function (chunk) {
    //                 console.log(chunk);
    //             });
    //         });
    //     });
    //     //console.log(res.body);
    //     //var body = '';
    //     //var body = res.pipe(process.stdout);
    // });
}
module.exports = getImages;