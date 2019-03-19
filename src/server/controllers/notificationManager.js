const db = require("../model").getDb();
const moment = require("moment");
const firebase = require("firebase-admin");
const NOTIFICATION_TYPES = require("../constants/notifications");

async function notifyAboutMemes() {
    const userDate = moment().subtract(24, "hours").format("DD/MM/YYYY");
    const memeDate = moment().subtract(24, "years").format("DD/MM/YYYY");
    const users = await db.sequelize.query(`SELECT count(imagescategories."imageId") AS memesCount, users."fcmId" FROM users ` +
        `LEFT JOIN userscategories ON userscategories."userId" = users."userId" ` +
        `LEFT JOIN categories ON categories."categoryId" = userscategories."categoryId" ` +
        `LEFT JOIN imagescategories ON imagescategories."categoryId" = categories."categoryId" ` +
        `LEFT JOIN images ON imagescategories."imageId" = images."imageId" ` +
        `WHERE users."lastVisited" <= to_date('${userDate}', 'DD/MM/YYYY') ` +
        `AND images."createdAt" > to_date('${memeDate}', 'DD/MM/YYYY') ` +
        "AND users.\"fcmId\" IS NOT NULL " +
        "GROUP BY users.\"userId\" " +
        "HAVING count(imagescategories.\"imageId\") > 0;");
    const usersArr = users[0];
    for (let i = 0; i < usersArr.length; i++) {
        const user = usersArr[i];
        if (user.fcmId) {
            const message = {
                data: {
                    type: NOTIFICATION_TYPES.NEW_MEMES,
                    memesCount: user.memescount + ""
                },
                token: user.fcmId
            };
            firebase.messaging().send(message)
                .catch(error => {
                    console.error("Error in notification send: ", error);

                });
        }
    }
}

module.exports = {
    notifyAboutMemes,
};