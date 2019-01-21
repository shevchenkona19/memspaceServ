import React from "react";
import { withStyles } from '@material-ui/core/styles';
import {KeyboardArrowLeft} from "@material-ui/icons";
import {withRouter} from "react-router-dom";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Title from "../../common/components/Title";
import Card from "@material-ui/core/Card";
import Text from "../../common/components/Text";

const styles = {
    root: {
        margin: "0 auto",
        width: 300
    },
    grow: {
        flexGrow: 1,
        marginLeft: -15,
        marginTop: -3
    },
    doubleDistance: {
        display: "inline",
    },
};

class RegisterForm extends React.Component {

    onBackClicked = () => {
        this.props.history.goBack();
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Card>
                    <CardContent>
                        <IconButton className={classes.grow} onClick={this.onBackClicked} aria-label="Back">
                            <KeyboardArrowLeft/>
                        </IconButton>
                        <Title margin="normal" className={classes.doubleDistance} text={"Register:"}/>
                        <Text text={"Currently registration is disabled, contact admin for further instructions"}/>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(RegisterForm));