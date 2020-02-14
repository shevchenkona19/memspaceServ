import t from "../actions/types";

const initialStore = {
    isError: false,
    error: "",
    memesWithoutImageData: []
};

const findMemesWithoutImageDataSend = (state, action) => ({
    ...state,
    isError: false,
    error: "",

});

const findMemesWithoutImageDataSuccess = (state, action) => ({
    ...state,
    memesWithoutImageData: action.data
});

const findMemesWithoutImageDataFailed = (state, action) => ({
    ...state,
    isError: true,
    error: action.data
});

export default function (state = initialStore, action) {
    switch (action.type) {
        case t.GET_MEMES_WITHOUTIMAGEDATA_SEND:
            return findMemesWithoutImageDataSend(state, action);
        case t.GET_MEMES_WITHOUTIMAGEDATA_SUCCESS:
            return findMemesWithoutImageDataSuccess(state, action);
        case t.GET_MEMES_WITHOUTIMAGEDATA_FAILED:
            return findMemesWithoutImageDataFailed(state, action);
        default:
            return state;
    }
}