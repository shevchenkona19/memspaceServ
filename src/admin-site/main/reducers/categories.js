import t from "../actions/types";

const initialState = {
    categories: [],
    isError: false,
    error: "",
};

const getCategoriesSendReducer = (state, action) => ({
    ...state,
    isError: false,
    error: "",
});

const getCategoriesFailedReducer = (state, action) => ({
    ...state,
    isError: true,
    error: JSON.stringify(action.error),
});

const getCategoriesSuccessReducer = (state, action) => ({
    ...state,
    categories: action.data.categories.map(category => {
        category.checked = false;
        return category;
    })
});

export default (state = initialState, action) => {
    switch (action.type) {
        case t.GET_CATEGORIES_SEND:
            return getCategoriesSendReducer(state, action);
        case t.GET_CATEGORIES_FAILED:
            return getCategoriesFailedReducer(state, action);
        case t.GET_CATEGORIES_SUCCESS:
            return getCategoriesSuccessReducer(state, action);
        default:
            return state;
    }
};