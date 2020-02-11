import t from "./types";
import {finishLoading, startLoading} from "./loading";
import {banUser,unbanUser, getUserInfo} from "../utils/api/userInfo";

const getUserInfoAction = (params, forPage) => dispatch => {
    startLoading(dispatch);
    dispatch({
        type: t.GET_USERINFO_SEND
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

const banUserAction = userId => dispatch => {
    startLoading(dispatch);
    dispatch({
        type: t.BAN_USER_SEND
    });
    banUser(userId).then(() => {
        finishLoading(dispatch);
        dispatch({
            type: t.BAN_USER_SUCCESS
        })
    }).catch(e => {
        finishLoading(dispatch);
        dispatch({
            data: e,
            type: t.BAN_USER_FAILED
        })
    })
};

const unbanUserAction = userId => dispatch => {
    startLoading(dispatch);
    dispatch({
        type: t.UNBAN_USER_SEND
    });
    unbanUser(userId).then(() => {
        finishLoading(dispatch);
        dispatch({
            type: t.UNBAN_USER_SUCCESS
        })
    }).catch(e => {
        finishLoading(dispatch);
        dispatch({
            data: e,
            type: t.UNBAN_USER_FAILED
        })
    })
};

export default {
    getUserInfoAction,
    banUserAction,
    unbanUserAction
};