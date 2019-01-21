import {get, post} from "./api";

const getNewMem = () => {
    return get("/moderator/newMem");
};

const postMem = memInfo => {
    return post("/moderator/mem?id=" + memInfo.imageId, {Ids: memInfo.checkedIds});
};

const discardMem = memId => {
    return post("/moderator/discardMem?id=" + memId);
};

export {
    getNewMem,
    postMem,
    discardMem
}