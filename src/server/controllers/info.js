const ModelLocator = require("../model");
const Users = ModelLocator.getUsersModel();
const db = ModelLocator.getDb();
const Images = ModelLocator.getImagesModel();
const moment = require("moment");

// username, userImage, lastVisited
// filter: lastVisited

/*
    select username, "imageData", "lastVisited" from users ${lastVisited ? "where \"lastVisited\" > to_date(" + moment(lastVisited).format("DD/MM/YYYY") + ") ") : ""}offset ${offset} limit ${limit} orderBy "lastVisited" desc;
 */
async function getUsersInfo(params) {
    const offset = params.page;
    const limit = 20;
    const lastVisited = params.lastVisited;
    const users = await db.query(`select username, "imageData", "lastVisited" from users ${lastVisited ? "where \"lastVisited\" > to_date(" + moment(lastVisited).format("DD/MM/YYYY") + ") " : ""}offset ${offset} limit ${limit} orderBy "lastVisited" desc;`);
    if (users[0].length) {
        return {
            success: true,
            users: users[0],
        }
    }
    return {
        success: false,
    }
}



module.exports = {
    getUsersInfo,
};