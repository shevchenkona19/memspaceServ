import t from "../actions/types";

const initialState = {
    isError: false,
    error: "",
    users: [],
    allUsers: 0,
    currentPage: 0,
    allPages: 1,
};

const banWorksSendReducer = (state, action) => ({
    ...state,
    isError: false,
    error: "",
});

const banWorksFailedReducer = (state, action) => ({
    ...state,
    isError: true,
    error: action,
});

const banWorksSuccessReducer = (state, action) => ({
    ...state,
});

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
        case t.UNBAN_USER_SEND:
        case t.BAN_USER_SEND:
            return banWorksSendReducer(state, action);
        case t.BAN_USER_FAILED:
        case t.UNBAN_USER_FAILED:
            return banWorksFailedReducer(state, action);
        case t.BAN_USER_SUCCESS:
        case t.UNBAN_USER_SUCCESS:
            return banWorksSuccessReducer(state, action);
        default:
            return state;
    }
};