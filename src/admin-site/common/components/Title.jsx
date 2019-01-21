import React from "react";
import PropTypes from "prop-types";
import Typography from '@material-ui/core/Typography';


class Title extends React.Component {
    render() {
        const {text, className} = this.props;
        return (
            <Typography
                className={className}
                variant='h6'
                color="inherit"
                margin={this.props.margin}
            >
                {text}
            </Typography>
        )
    }
}

Title.propTypes = {
    text: PropTypes.string,
    className: PropTypes.any,
    margin: PropTypes.string,
};

export default Title;