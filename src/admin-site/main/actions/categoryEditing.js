import {finishLoading, startLoading} from "./loading";
import {getCategories} from "../utils/api/categories";
import t from "./types";

const getCategoriesAction = () => dispatch => {
  startLoading(dispatch);
  dispatch({
     type: t.GET_CATS_SEND
  });
  getCategories().then(res => {
      finishLoading(dispatch);
      dispatch({
          data: res,
          type: t.GET_CATS_SUCCESS
      })
  }).catch(e => {
     finishLoading(dispatch);
     dispatch({
         error: e,
         type: t.GET_CATS_FAILED
     })
  });
};

export default {
    getCategoriesAction
};