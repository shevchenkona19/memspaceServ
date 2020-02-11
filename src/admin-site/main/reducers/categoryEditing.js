import t from "../actions/types";

const initialState = {
    categories: [],
    isError: false,
    error: ""
};

const getCategoriesSendReducer = (state, action) => ({
    ...state,
    isError: false,
    error: ""
});

const getCategoriesSuccessReducer = (state, action) => ({
    ...state,
    categories: action.data.categories
});

const getCategoriesFailedReducer = (state, action) => ({
    ...state,
    isError: true,
    error: action.error
});

export default (state = initialState, action) => {
    switch (action.type) {
        case t.GET_CATS_SEND:
            return getCategoriesSendReducer(state, action);
        case t.GET_CATS_SUCCESS:
            return getCategoriesSuccessReducer(state, action);
        case t.GET_CATS_FAILED:
            return getCategoriesFailedReducer(state, action);
        default:
            return state;
    }
}