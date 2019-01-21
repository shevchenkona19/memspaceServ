import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import {MuiThemeProvider} from '@material-ui/core/styles';
import theme from "../common/utils/themeProvider";
import App from "./containers/App";

const MainApp = () => (
    <MuiThemeProvider theme={theme}>
        <App/>
    </MuiThemeProvider>
);


ReactDOM.render(<MainApp/>, document.getElementById('root'));
