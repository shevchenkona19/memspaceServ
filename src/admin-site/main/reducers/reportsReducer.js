import t from "../actions/types";

const initialState = {
    isError: false,
    error: "",
    currentPage: 0,
    allPages: 0,
    reports: []
};

const getAllReportsSendReducer = (state, action) => ({
    ...state,
    isError: false,
    error: ""
});

const getAllReportsFailedReducer = (state, action) => ({
    ...state,
    isError: true,
    error: action.error
});

const getAllReportsSuccessReducer = (state, action) => ({
    ...state,
    reports: action.data.reports,
    allPages: action.data.pageCount,
});

const setCurrentReportsPageReducer = (state, action) => ({
    ...state,
    currentPage: action.page,
});

const setErrorRead = (state, action) => ({
    ...state,
    isError: false,
    error: ""
});


export default (state = initialState, action) => {
    switch (action.type) {
        case t.GET_ALL_REPORTS_SEND:
            return getAllReportsSendReducer(state, action);
        case t.GET_ALL_REPORTS_FAILED:
            return getAllReportsFailedReducer(state, action);
        case t.GET_ALL_REPORTS_SUCCESS:
            return getAllReportsSuccessReducer(state, action);
        case t.SET_CURRENT_REPORTS_PAGE:
            return setCurrentReportsPageReducer(state, action);
        case t.SET_REPORT_ERROR_READ:
            return setErrorRead(state, action);
        default:
            return state;
    }
}