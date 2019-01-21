import React, {Component} from 'react';
import PropTypes from "prop-types";
import Typography from '@material-ui/core/Typography';


class SmallText extends Component {
    render() {
        const {text} = this.props;
        return (
                <Typography
                    variant="caption"
                >
                    {text}
                </Typography>
        );
    }
}

SmallText.propTypes = {
    text: PropTypes.string,
};

export default SmallText;