import React from "react";
import {withStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import HomeCard from "../components/HomeCard";

const styles = {
    root: {
        margin: 10,
    }
};

class Home extends React.Component {

    goToMemesChecker = () => {
        this.props.history.push("/mem");
    };

    render() {
        const {classes} = this.props;
        return (
            <Grid container className={classes.root} spacing={16}>
                <Grid item xs={12}>
                    <Grid container justify={"center"} spacing={40}>
                        <Grid item>
                            <HomeCard
                                title={"Check memes"}
                                subTitle={"Here you can check memes for categories"}
                                isButton
                                onClick={this.goToMemesChecker}
                                buttonText={"Go"}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(Home)