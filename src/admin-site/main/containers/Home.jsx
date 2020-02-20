import React from "react";
import {withStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import HomeCard from "../components/HomeCard";
import {get, post} from "../utils/api/api";
import CreateNoRegistrationUserModal from "../components/CreateNoRegistrationUserModal";
import NoRegistrationInfoModal from "../components/NoRegistrationInfoModal";

const styles = {
    root: {
        margin: 10,
    }
};

class Home extends React.Component {

    state = {
        noRegistrationModalVisible: false,
        noRegistrationInfoModalVisible: false,
    };

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

    gotoMemAnalyzer = () => {
        this.props.history.push("/memAnalyzer")
    };

    createNoRegistration = () => {
        this.setState({noRegistrationModalVisible: true})
    };

    closeNoRegistrationModal = () => {
        this.setState({noRegistrationModalVisible: false})
    };

    openNoRegistrationInfoModal = () => {
        this.setState({noRegistrationInfoModalVisible: true})
    };

    closeNoRegistrationInfoModal = () => {
        this.setState({noRegistrationInfoModalVisible: false})
    };

    createNoRegistrationUser(body) {
        post("/account/createNoRegistrationUser", body)
            .then(res => {
                if (res.success) {
                    alert("Success!")
                } else {
                    alert("Error: " + res.message);
                }
            }).catch(err => {
            alert("Error: " + err.toString())
        })
    }

    getNewMemes = () => {
        get("/moderator/getImages?offset=0")
            .then(res => {
                if (res.success) {
                    alert("Success!")
                } else {
                    alert("Error: " + res.message);
                }
            }).catch(err => {
            alert("Error: " + err.toString());
        })
    };

    render() {
        const {classes} = this.props;
        return (
            <Grid container className={classes.root} spacing={16}>
                {this.state.noRegistrationModalVisible &&
                <CreateNoRegistrationUserModal onClose={this.closeNoRegistrationModal}
                                               save={this.createNoRegistrationUser}/>}
                {this.state.noRegistrationInfoModalVisible &&
                <NoRegistrationInfoModal onClose={this.closeNoRegistrationInfoModal}/>
                }
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
                        <Grid item>
                            <HomeCard
                                title={"Meme Analyzer"}
                                subTitle={"Find broken memes"}
                                isButton
                                onClick={this.gotoMemAnalyzer}
                                buttonText="Go"
                            />
                        </Grid>
                        <Grid item>
                            <HomeCard
                                title="Get new memes"
                                subTitle="Manually get new memes"
                                isButton
                                onClick={this.getNewMemes}
                                buttonText="Go"
                            />
                        </Grid>
                        <Grid item>
                            <HomeCard
                                title="Create no registration user"
                                isButton
                                onClick={this.createNoRegistration}
                                buttonText="Create"
                                useSecondButton
                                secondButtonText="Info"
                                secondButtonAction={this.openNoRegistrationInfoModal}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(Home)