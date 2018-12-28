const db = require("../../model/index").getDb().sequelize;

async function removeTokenForUser(userId) {
    await db.query(`update users set "fcmId" = null where "userId" = ${userId};`);
}

module.exports = {removeTokenForUser};