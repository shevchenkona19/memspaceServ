import {get} from "./api";

function getCategories() {
    return get("/config/categories")
}

export {
    getCategories
}