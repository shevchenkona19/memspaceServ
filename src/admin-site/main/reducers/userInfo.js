import t from "../actions/types";

const initialState = {
    isError: false,
    error: "",
    users: [],
    allUsers: 0,
    currentPage: 0,
    allPages: 1,
};

const getUserInfoSendReducer = (state, action) => ({
    ...state,
    isError: false,
    error: "",
});

const getUserInfoFailedReducer = (state, action) => ({
    ...state,
    isError: true,
    error: action
});

const getUserInfoSuccessReducer = (state, action) => {
    return ({
        ...state,
        users: action.data.users,
        allUsers: action.data.allUsers,
        currentPage: action.data.page,
        allPages: Math.floor(action.data.allUsers / 20)
    });
};

export default (state = initialState, action) => {
    switch (action.type) {
        case t.GET_USERINFO_FAILED:
            return getUserInfoFailedReducer(state, action);
        case t.GET_USERINFO_SUCCESS:
            return getUserInfoSuccessReducer(state, action);
        case t.GET_NEW_MEM_SEND:
            return getUserInfoSendReducer(state, action);
        default:
            return state;
    }
};