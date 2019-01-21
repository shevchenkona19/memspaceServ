import React, {Component} from 'react';
import {connect} from "react-redux";
import {withStyles} from '@material-ui/core/styles';

const styles = {
    root: {
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        "overflow-y": "auto"
    },
};

class ContentWrapper extends Component {
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                {this.props.children}
            </div>
        );
    }
}

export default withStyles(styles)(ContentWrapper);