import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Link from "@material-ui/core/es/Link/Link";

const styles = {};

class NotFound extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div>
                No such page. <Link to={"/"}>Go home</Link>
            </div>
        )
    }
}

export default withStyles(styles)(NotFound)