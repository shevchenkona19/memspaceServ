import {createStore, applyMiddleware, compose} from "redux";
import mainReducer from "../reducers"
import thunk from "redux-thunk";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer =composeEnhancers(applyMiddleware(thunk));
const store = createStore(
    mainReducer,
    enhancer
);

export default store;