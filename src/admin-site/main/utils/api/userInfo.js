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

export {
    getUserInfo
}

