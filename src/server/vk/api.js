const Images = require("../model").getImagesModel();
const MemeIds = require("../model").getMemeIdsModel();
const request = require('async-request');
const request1 = require('request');
const fs = require("fs");
const images = require("../public/paths").imageFolder;
const Op = require("sequelize").Op;
const FileRemover = require("../utils/files/FileRemover");

const groups = {
    'Борщ': 460389,
    'ЁП': 12382740,
    'IGM': 30602036,
    'Смс приколы:D': 30532220,
    '4ch': 45745333,
    'MDK': 57846937,
    'MXK': 41437811,
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
    'Файнi меми про Укр.лiт': 131348832,
    'ilita': 73319310,
    'FTP': 65596623,
    'Torch': 61967245
};
//https://api.vk.com/method/wall.get?access_token=95a54f6595a54f6595a54f656195fbcdfd995a595a54f65cc607ae98ed1123046344d8f&owner_id=-61967245&count=5&v=5.73
//Vkapi
const getImages = async (offset) => {
    await deleteImages();
    let path, response;
    for (let groupName in groups) {
        const groupId = groups[groupName];
        path = `https://api.vk.com/method/wall.get?access_token=${process.env.VKTOKEN}&owner_id=-${groupId}&count=5&v=5.73`;
        try {
            console.log('attempting to GET %j', path);
            response = await request(path);
            let body = JSON.parse(response.body);
            if (body && body.response && body.response.items && body.response.items.length) {
                const {response: {items}} = body;
                items.forEach(item => {
                   if (item.attachments && item.attachments.length) {
                       const post = item.attachments[0];
                       if (post.photo) {
                           const path = post.photo.photo_807 || post.photo.photo_604;
                           const height = post.photo.height;
                           const width = post.photo.width;
                           const id = post.photo.id;
                           const ownerId = post.photo.owner_id;
                           const doesExists = MemeIds.findOne({
                               where: {
                                   memeId: id,
                                   groupId
                               }
                           });
                           if (doesExists !== null) {
                               console.log("image already exists");
                               return;
                           }
                           request1({url: path, encoding: null}, async (err, res, body) => {
                               if (!fs.existsSync(images + "/memes")) {
                                   await new Promise(((resolve, reject) => {
                                       fs.mkdir(images + "/memes", err => {
                                           if (err) reject(err);
                                           resolve();
                                       });
                                   }))
                               }
                               const filename = images + "/memes/" + id + ownerId + ".jpg";
                               if (!fs.existsSync(filename)) {
                                   fs.writeFileSync(filename, body);
                                   MemeIds.build({
                                       groupId,
                                       memeId: id,
                                   });
                                   Images.build({
                                       imageData: filename,
                                       source: groupName,
                                       width,
                                       height
                                   }).save()
                                       .then(() => console.log("image downloaded"))
                                       .catch(e => console.error(e));
                               }
                           });
                       }
                   }
                });
            }
        } catch (err) {
            console.log(err.stack);
            console.log('download failed');
        }
    }
};

const deleteImages = async () => {
    const date = new Date(new Date() - 60000 * 60 * 5);
    const images = await Images.findAll({
        where: {
            isChecked: 0,
            createdAt: {
                [Op.lt]: date
            }
        },
        attributes: ["imageData"]
    });
    if (images) {
        FileRemover.deleteFiles(images.map(image => image.imageData));
        await Images.destroy({
            where: {
                isChecked: 0,
                createdAt: {
                    [Op.lt]: date
                }
            }
        });
    }
};

module.exports = {getImages};