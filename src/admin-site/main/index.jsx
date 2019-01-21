import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import {MuiThemeProvider} from '@material-ui/core/styles';
import theme from "../common/utils/themeProvider";
import App from "./containers/App";
import {Provider} from "react-redux";
import store from "./store";

const MainApp = () => (
    <MuiThemeProvider theme={theme}>
        <Provider store={store}>
            <App/>
        </Provider>
    </MuiThemeProvider>
);


ReactDOM.render(<MainApp/>, document.getElementById('root'));
