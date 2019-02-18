import t from "./types";
import {finishLoading, startLoading} from "./loading";
import {getUserInfo} from "../utils/api/userInfo";

const getUserInfoAction = (params, forPage) => dispatch => {
    startLoading(dispatch);
    dispatch({
        type: t.GET_USERINFO_FAILED
    });
    getUserInfo(forPage, params).then(res => {
        finishLoading(dispatch);
        dispatch({
            data: {page: forPage, ...res},
            type: t.GET_USERINFO_SUCCESS
        })
    }).catch(e => {
        finishLoading(dispatch);
        dispatch({
            data: e,
            type: t.GET_USERINFO_FAILED
        })
    })
};

export default {
    getUserInfoAction,
};