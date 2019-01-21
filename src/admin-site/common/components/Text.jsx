import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/es/Typography/Typography";


class Text extends React.Component {
    render() {
        const {text} = this.props;
        return (
            <Typography
                variant={"caption"}
            >
                {text}
            </Typography>
        )
    }
}

Text.propTypes = {
    text: PropTypes.string.isRequired
};

export default Text;