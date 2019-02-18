import {combineReducers} from "redux";
import categoriesReducer from "./categories";
import appReducer from "./app";
import memCheckerReducer from "./memChecker";
import userInfoReducer from "./userInfo";

export default combineReducers({
    categories: categoriesReducer,
    app: appReducer,
    memChecker: memCheckerReducer,
    userInfo: userInfoReducer,
});