import React, {Component} from 'react';
import '../styles/components/App.css';
import Header from "../../common/components/Header";
import ContentWrapper from "../../common/components/ContentWrapper";
import Footer from "../../common/components/Footer";
import {withStyles} from '@material-ui/core/styles';
import AppRouter from "./AppRouter";

const styles = {
    main: {
        display: "flex",
        flexFlow: "column",
        height: "100%",
    }
};

class App extends Component {
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.main}>
                <Header/>
                <ContentWrapper>
                    <AppRouter/>
                </ContentWrapper>
                <Footer/>
            </div>
        );
    }
}

export default withStyles(styles)(App);
