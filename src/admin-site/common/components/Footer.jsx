import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import SmallText from "./SmallText";

const styles = {
    footer: {
        flex: "0 1 40px",
        textAlign: 'center'
    }
};

class Footer extends Component {
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.footer}>
                <SmallText
                    text="MemSpace@ All rights reserved"
                />
            </div>
        );
    }
}

export default withStyles(styles)(Footer);