import t from "./types";

const startLoading = dispatch => {
    dispatch({
        type: t.START_LOADING,
    })
};

const finishLoading = dispatch => {
    dispatch({
        type: t.FINISH_LOADING,
    });
};

export {
    startLoading,
    finishLoading
}