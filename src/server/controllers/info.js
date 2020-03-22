const ModelLocator = require("../model");
const Users = ModelLocator.getUsersModel();
const db = require("../model").getDb().sequelize;
const Images = ModelLocator.getImagesModel();
const moment = require("moment-timezone");

// username, userImage, lastVisited
// filter: lastVisited

/*
    select username, "imageData", "lastVisited" from users ${lastVisited ? "where \"lastVisited\" > to_date(" + moment(lastVisited).format("DD/MM/YYYY") + ") ") : ""}offset ${offset} limit ${limit} orderBy "lastVisited" desc;
 */
async function getUsersInfo(params) {
    const limit = 20;
    const offset = params.page * limit;
    const orderBy = params.orderBy ? params.orderBy : "userId";
    const order = params.order ? params.order : "DESC";
    const lastVisited = params.lastVisited;
    const users = await db.query(`select * from users ${lastVisited ? "where \"lastVisited\" > to_date('" + moment(lastVisited).format("DD/MM/YYYY HH:MM") + "', 'DD/MM/YYYY HH24:MM') " : ""}ORDER BY "${orderBy}" ${order} offset ${offset ? offset : 0} limit ${limit};`);
    const all = await db.query(`select count(*) from users${lastVisited ? " where \"lastVisited\" > to_date('" + moment(lastVisited).format("DD/MM/YYYY HH:MM") + "', 'DD/MM/YYYY HH24:MM') " : ""};`);
    if (users[0].length) {
        return {
            success: true,
            users: users[0],
            page: params.page || 0,
            allUsers: all[0][0].count,
        }
    }
    return {
        success: false,
    }
}


module.exports = {
    getUsersInfo,
};
