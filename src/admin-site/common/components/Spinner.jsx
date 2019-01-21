import React from "react";
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";

const styles = {
    visible: {
        opacity: 1
    },
    gone: {
        opacity: 0
    },
    anim: {
        transition: "all 0.5s ease"
    }
};

class Spinner extends React.Component {
    render() {
        const {classes, isLoading} = this.props;
        return (
            <LinearProgress className={[isLoading ? classes.visible : classes.gone, classes.anim].join(" ")}/>
        )
    }
}

Spinner.propTypes = {
    isLoading: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Spinner)