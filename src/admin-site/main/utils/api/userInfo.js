import {post, get} from "./api";

const getUserInfo = (pageNum, filter) => {
    return post("/info/users", {params: {page: pageNum}})
};

export {
    getUserInfo
}

