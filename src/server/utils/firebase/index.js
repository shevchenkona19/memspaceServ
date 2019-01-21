const db = require("../../model").getDb().sequelize;

async function removeTokenForUser(userId) {
    await db.query(`update users set "fcmId" = null where "userId" = ${userId};`);
}

module.exports = {removeTokenForUser};