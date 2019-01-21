import t from "../actions/types";

const initialState = {
    isLoading: false,
};

const startLoadingReducer = (state, action) => ({
    ...state,
    isLoading: true,
});

const finishLoadingReducer = (state, action) => ({
    ...state,
    isLoading: false,
});

export default (state = initialState, action) => {
    switch (action.type) {
        case t.START_LOADING:
            return startLoadingReducer(state, action);
        case t.FINISH_LOADING:
            return finishLoadingReducer(state, action);
        default:
            return state;
    }
};