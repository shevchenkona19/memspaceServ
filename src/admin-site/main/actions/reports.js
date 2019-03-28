import t from "./types";
import {finishLoading, startLoading} from "./loading";
import API from "../utils/api/reports";

const getReportsAction = (count, offset) => dispatch => {
    startLoading(dispatch);
    dispatch({
        type: t.GET_ALL_REPORTS_SEND
    });
    API.getReports(count, offset).then(res => {
        finishLoading(dispatch);
        dispatch({
            type: t.GET_ALL_REPORTS_SUCCESS,
            data: {
                reports: res.data.reports,
                pageCount: res.data.pageCount,
            }
        })
    }).catch(error => {
        finishLoading(dispatch);
        dispatch({
            type: t.GET_ALL_REPORTS_FAILED,
            error
        })
    });
};

const setCurrentPageAction = (page) => dispatch => {
    dispatch({
        type: t.SET_CURRENT_REPORTS_PAGE,
        page
    })
};

const setErrorRead = () => dispatch => dispatch({type: t.SET_REPORT_ERROR_READ});

export default {
    getReportsAction,
    setCurrentPageAction,
    setErrorRead
}

