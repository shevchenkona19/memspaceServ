import React from "react";
import PropTypes from "prop-types";
import {KeyboardArrowLeft} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";

class BackButton extends React.Component {
    render() {
        return (
            <IconButton onClick={this.onBackClicked} aria-label="Back">
                <KeyboardArrowLeft/>
            </IconButton>
        )
    }
}

BackButton.propTypes = {
    onBackClick: PropTypes.func.isRequired,
};

export default (BackButton)