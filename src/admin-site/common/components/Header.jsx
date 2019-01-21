import React, {Component} from 'react';
import AppBar from "@material-ui/core/es/AppBar/AppBar";
import {withStyles} from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/es/Toolbar/Toolbar";
import PropTypes from "prop-types";
import Title from "./Title";
import IconButton from "@material-ui/core/IconButton";
import MoreIcon from '@material-ui/icons/MoreVert';
import Menu from "@material-ui/core/es/Menu/Menu";
import Spinner from "./Spinner";

const styles = {
    root: {
        flex: "0 1 auto",
    },
    menu: {
        position: "absolute",
        right: 0,
    }
};

class Header extends Component {

    state = {
        anchorEl: null,
    };

    openMenu = e => {
        this.setState({
            anchorEl: e.currentTarget,
        })
    };

    closeMenu = () => {
        this.setState({
            anchorEl: null,
        })
    };

    render() {
        const {classes, logged, showMenuOption, renderMenu, isLoading} = this.props;
        return (
            <div className={classes.root}>
                <AppBar position={"static"} color={"primary"}>
                    <Toolbar>
                        <Title
                            text="MemSpace admin"
                        />
                        {showMenuOption &&
                        <React.Fragment>
                            <IconButton className={classes.menu} color="inherit" onClick={this.openMenu}>
                                <MoreIcon/>
                            </IconButton>
                            <Menu
                                anchorEl={this.state.anchorEl}
                                open={Boolean(this.state.anchorEl)}
                                onClose={this.closeMenu}
                            >
                                {renderMenu()}
                            </Menu>
                        </React.Fragment>
                        }
                        <Spinner isLoading={isLoading}/>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Header.propTypes = {
    logged: PropTypes.bool,
    showMenuOption: PropTypes.bool,
    renderMenu: PropTypes.func,
    isLoading: PropTypes.bool,
};

export default withStyles(styles)(Header);