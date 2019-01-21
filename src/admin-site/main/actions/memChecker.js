import t from "./types";
import {startLoading, finishLoading} from "./loading";
import {discardMem, getNewMem, postMem} from "../utils/api/memChecker";

const getNewMemAction = () => dispatch => {
    startLoading(dispatch);
    dispatch({
        type: t.GET_NEW_MEM_SEND
    });
    getNewMem().then(res => {
        finishLoading(dispatch);
        dispatch({
            type: t.GET_NEW_MEM_SUCCESS,
            data: res,
        })
    }).catch(err => {
        finishLoading(dispatch);
        dispatch({
            type: t.GET_NEW_MEM_FAILED,
            error: err
        })
    });
};

const postMemAction = (memInfo) => dispatch => {
    startLoading(dispatch);
    dispatch({type: t.POST_MEM_SEND});
    postMem(memInfo).then(res => {
        finishLoading(dispatch);
        dispatch({
            type: t.POST_MEM_SUCCESS
        })
    }).catch(error => {
        finishLoading(dispatch);
        dispatch({
            error,
            type: t.POST_MEM_FAILED
        })
    })
};

const discardMemAction = memId => dispatch => {
    startLoading(dispatch);
    dispatch({type: t.DISCARD_MEM_SEND});
    discardMem(memId).then(() => {
        finishLoading(dispatch);
        dispatch({type: t.DISCARD_MEM_SUCCESS})
    }).catch(error => {
        finishLoading(dispatch);
        dispatch({error, type: t.DISCARD_MEM_FAILED});
    })
};

export default {
    getNewMemAction,
    postMemAction,
    discardMemAction
}