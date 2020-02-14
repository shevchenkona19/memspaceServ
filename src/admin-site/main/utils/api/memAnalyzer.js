import {get} from "./api";

function findMemesWithoutImageData() {
    return get("/moderator/findMemesWithoutImageData");
}

export default {
    findMemesWithoutImageData
}