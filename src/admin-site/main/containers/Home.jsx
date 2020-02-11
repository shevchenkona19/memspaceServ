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

    goToUsersInfo = () => {
        this.props.history.push("/usersInfo");
    };

    goToViewReports = () => {
        this.props.history.push("/viewReports");
    };

    gotoEditCategories = () => {
        this.props.history.push("/editCategories");
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
                        <Grid item>
                            <HomeCard
                                title={"Users info"}
                                subTitle={"Check users info and edit them"}
                                isButton
                                onClick={this.goToUsersInfo}
                                buttonText={"Go"}
                            />
                        </Grid>
                        <Grid item>
                            <HomeCard
                                title={"View reports"}
                                subTitle={"Delete memes if they are violating rules"}
                                isButton
                                onClick={this.goToViewReports}
                                buttonText={"Go"}
                            />
                        </Grid>
                        <Grid item>
                            <HomeCard
                                title={"Edit categories"}
                                subTitle={"Create and delete categories for memes"}
                                isButton
                                onClick={this.gotoEditCategories}
                                buttonText="Go"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(Home)