import {finishLoading, startLoading} from "./loading";
import MemAnalyzerApi from "../utils/api/memAnalyzer";
import t from "./types";

const findMemesWithoutImageData = () => dispatch => {
    startLoading(dispatch);
    dispatch({
        type: t.GET_MEMES_WITHOUTIMAGEDATA_SEND
    });
    MemAnalyzerApi.findMemesWithoutImageData().then(res => {
        finishLoading(dispatch);
        if (res.success) {
            dispatch({
                type: t.GET_MEMES_WITHOUTIMAGEDATA_SUCCESS,
                data: res.memesWithoutImageData
            });
        } else {
            dispatch({
                type: t.GET_MEMES_WITHOUTIMAGEDATA_FAILED,
                data: res.message
            });
        }
    }).catch(error => {
        dispatch({
            type: t.GET_MEMES_WITHOUTIMAGEDATA_FAILED,
            data: error.toString()
        });
    });
};

export default {
    findMemesWithoutImageData
}