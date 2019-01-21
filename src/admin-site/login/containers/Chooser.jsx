import React from "react";
import {withStyles} from '@material-ui/core/styles';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Title from "../../common/components/Title";
import Text from "../../common/components/Text";
import CardActions from "@material-ui/core/es/CardActions/CardActions";
import Button from "@material-ui/core/es/Button/Button";
import {Link} from "react-router-dom";

const styles = {
    root: {
        margin: "0 auto",
    },
};

class Chooser extends React.Component {
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Card>
                    <CardContent>
                        <Title text={"Welcome to admin site!"}/>
                        <Text text={"Please, choose what you need below: "}/>
                    </CardContent>
                    <CardActions>
                        <Button
                            size={"small"}
                            component={Link}
                            to={"/login"}
                        >
                            Login
                        </Button>
                        <Button
                            size={"small"}
                            component={Link}
                            to={"/register"}
                        >
                            Register
                        </Button>
                    </CardActions>
                </Card>
            </div>
        )
    }
}

export default withStyles(styles)(Chooser)