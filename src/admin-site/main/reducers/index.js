import {combineReducers} from "redux";
import categoriesReducer from "./categories";
import appReducer from "./app";
import memCheckerReducer from "./memChecker";

export default combineReducers({
    categories: categoriesReducer,
    app: appReducer,
    memChecker: memCheckerReducer,
});