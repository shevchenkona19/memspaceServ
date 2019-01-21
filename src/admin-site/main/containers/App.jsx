import React from "react";
import Header from "../../common/components/Header";
import Footer from "../../common/components/Footer";
import ContentWrapper from "../../common/components/ContentWrapper";
import AppRouter from "./Router";
import {withStyles} from "@material-ui/core";
import MenuItem from "@material-ui/core/es/MenuItem/MenuItem";
import {connect} from "react-redux";
import Cookie from "js-cookie";


const styles = {
    root: {
        display: "flex",
        flexFlow: "column",
        height: "100%",
    }
};

class App extends React.Component {

    renderMenu = () => {
        return (
            <MenuItem onClick={this.onLogout}>Logout</MenuItem>
        );
    };

    onLogout = () => {
        Cookie.remove("token");
        window.location.href = "/admin/";
    };

    render() {
        const {classes, isLoading} = this.props;
        return (
            <div className={classes.root}>
                <Header
                    logged
                    showMenuOption
                    renderMenu={this.renderMenu}
                    isLoading={isLoading}
                />
                <ContentWrapper>
                    <AppRouter/>
                </ContentWrapper>
                <Footer/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isLoading: state.app.isLoading,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));