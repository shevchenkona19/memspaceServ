import {combineReducers} from "redux";
import categoriesReducer from "./categories";
import appReducer from "./app";
import memCheckerReducer from "./memChecker";
import userInfoReducer from "./userInfo";
import reportsReducer from "./reportsReducer";
import categoryEditing from "./categoryEditing";

export default combineReducers({
    categories: categoriesReducer,
    app: appReducer,
    memChecker: memCheckerReducer,
    userInfo: userInfoReducer,
    reports: reportsReducer,
    editCategories: categoryEditing,
});