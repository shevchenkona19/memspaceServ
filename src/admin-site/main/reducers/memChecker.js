import t from "../actions/types";

const initialState = {
    currentMem: {
        imageId: -1,
        width: 0,
        height: 0,
    },
    gettingMem: false,
    gettingSuccess: false,
    isError: false,
    isPosting: false,
    postingSuccess: false,
    isDiscarding: false,
    discardSuccess: false,
    error: "",
};

const getNewMemSendReducer = (state, action) => ({
    ...state,
    gettingMem: true,
    gettingSuccess: false,
    isError: false,
    error: "",
});

const getNewMemFailedReducer = (state, action) => ({
    ...state,
    gettingMem: false,
    isError: true,
    error: JSON.stringify(action.error),
});

const getNewMemSuccessReducer = (state, action) => ({
    ...state,
    gettingMem: false,
    gettingSuccess: true,
    currentMem: action.data,
});

const postMemSendReducer = (state, action) => ({
    ...state,
    isPosting: true,
    postingSuccess: false,
    isError: false,
    error: "",
});

const postMemSuccessReducer = (state, action) => ({
    ...state,
    isPosting: false,
    postingSuccess: true,
    currentMemId: "",
});

const postMemFailedReducer = (state, action) => ({
    ...state,
    isPosting: false,
    postingSuccess: false,
    isError: true,
    error: JSON.stringify(action.error),
});

const discardMemSendReducer = (state, action) => ({
    ...state,
    isError: false,
    isDiscarding: true,
    discardSuccess: false,
    error: "",

});

const discardMemSuccessReducer = (state, action) => ({
    ...state,
    isDiscarding: false,
    discardSuccess: true,
});

const discardMemFailedReducer = (state, action) => ({
    ...state,
    isDiscarding: false,
    discardSuccess: false,
    isError: true,
    error: JSON.stringify(action.error),
});


export default (state = initialState, action) => {
    switch (action.type) {
        case t.GET_NEW_MEM_SEND:
            return getNewMemSendReducer(state, action);
        case t.GET_NEW_MEM_FAILED:
            return getNewMemFailedReducer(state, action);
        case t.GET_NEW_MEM_SUCCESS:
            return getNewMemSuccessReducer(state, action);
        case t.POST_MEM_FAILED:
            return postMemFailedReducer(state, action);
        case t.POST_MEM_SUCCESS:
            return postMemSuccessReducer(state, action);
        case t.POST_MEM_SEND:
            return postMemSendReducer(state, action);
        case t.DISCARD_MEM_SEND:
            return discardMemSendReducer(state, action);
        case t.DISCARD_MEM_SUCCESS:
            return discardMemSuccessReducer(state, action);
        case t.DISCARD_MEM_FAILED:
            return discardMemFailedReducer(state, action);
        default:
            return state;
    }
};