const Images = require("../model/index").getImagesModel();
const request = require('async-request');
const request1 = require('request');
const fs = require("fs");
const images = require("../app").imageFolder;

const groups = {
    'Борщ': 460389,
    'ЁП': 12382740,
    'IGM': 30602036,
    'Смс приколы:D': 30532220,
    '4ch': 45745333,
    'MDK': 57846937,
    'MXK': 41437811,
    'Корпорация зла': 29246653,
    'Наука и техника': 31976785, 
    'iFace': 30277672, //iFace
    'Интеллектуальный юмор': 28950133,
    'Убойные приколы': 34491673, 
    'Сука.': 41594691, 
    'Орлёнок': 36775802, 
    'Без кота и жизнь не та': 32015300, 
    'Улыбнуло:D': 39822792,
    'FUN': 20744542, 
    'Чёрный юмор': 40800148,
    'КБ': 67580761,
    'Злой Негр': 60203425,
    'Смейся до слёз:D': 26419239, 
    'Лентач': 29534144,
    'Институт Благородных Девиц': 44781847, 
    'C H O P - C H O P': 39444069,
    'O h , y e s': 90937359, 
    '9GAG': 32041317, 
    'English Memes': 145954878,
    'Dank English Memes': 139419686,
    'Чоткий Паца': 50059483, 
    'Файнi меми про Укр.лiт': 131348832
};
//Vkapi
const getImages = async (offset) => {
    let path, response;
    for (let groupName in groups) {
        let groupId = groups[groupName];
        path = `https://api.vk.com/method/wall.get?access_token=${process.env.VKTOKEN}&owner_id=-${groupId}&count=1&offset=${offset}&v=5.73`;

        try {
            console.log('attempting to GET %j', path);
            response = await request(path);
            let body = JSON.parse(response.body);
            console.warn(body.response.items[0].attachments[0].photo);

            if (body && body.response && body.response.items && body.response.items[0]
                && body.response.items[0].attachments && body.response.items[0].attachments[0]
                && body.response.items[0].attachments[0].photo && body.response.items[0].attachments[0].photo.photo_604 &&  body.response.items[0].attachments[0].photo.pid) {

                const height = body.response.items[0].attachments[0].photo.height;
                const width = body.response.items[0].attachments[0].photo.width;
                const id =  body.response.items[0].attachments[0].photo.pid;
                const ownerId =  body.response.items[0].attachments[0].photo.owner_id;
                path = body.response.items[0].attachments[0].photo.photo_604;

                console.log('attempting to GET %j', path);
                request1({url: path, encoding: null}, async (error, response, body) => {
                    if (!fs.existsSync(images + "/memes")) {
                        await new Promise(((resolve, reject) => {
                            fs.mkdir(images + "/memes", err => {
                                if (err) reject(err);
                                resolve();
                            });
                        }))
                    }
                    const filename = images + "/memes/"  + id + ownerId + ".jpg";
                    fs.writeFileSync(filename, body);
                    Images.build({
                        imageData: filename,
                        source: groupName,
                        width,
                        height
                    }).save()
                        .then(() => console.log("image downloaded"))
                        .catch(e => console.error(e));
                    // await db.query(`INSERT INTO images(imagedata, source, width, height) VALUES(${body}, ${groupName}, ${width}, ${height})`);
                });
                //response = await request(path);
                //let imagedata = response.body.replace(/\0/g, '');

            } else console.log('not full response')
        } catch (err) {
            console.log(err.stack);
            console.log('download failed');
        }
    }
};

module.exports = getImages;