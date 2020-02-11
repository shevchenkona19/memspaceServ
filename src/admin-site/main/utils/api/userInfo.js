import {post} from "./api";

const getUserInfo = (pageNum, filter) => {
    return post("/info/users", {
        params: {
            page: pageNum,
            orderBy: filter.filter,
            order: filter.order,
            lastVisited: filter.lastVisited,
        }
    })
};

const banUser = userId => {
    return post("/reports/banUser", {
        userId
    })
};

const unbanUser = userId => {
    return post("/reports/unbanUser", {
        userId
    })
};

export {
    getUserInfo,
    banUser,
    unbanUser
}

