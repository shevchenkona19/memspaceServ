import {getCategories} from "../utils/api/categories";
import t from "./types";
import {startLoading, finishLoading} from "./loading";

const getCategoriesAction = () => dispatch => {
    startLoading(dispatch);
    getCategories().then(res => {
        finishLoading(dispatch);
        dispatch({
            data: res,
            type: t.GET_CATEGORIES_SUCCESS
        })
    }).catch(err => {
        finishLoading(dispatch);
        dispatch({
            error: err,
            type: t.GET_CATEGORIES_FAILED
        });
    });
};

export default {
    getCategoriesAction
}