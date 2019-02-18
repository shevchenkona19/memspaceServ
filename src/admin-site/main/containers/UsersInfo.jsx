import React from "react";
import {withStyles} from '@material-ui/core/styles';
import {connect} from "react-redux";
import {KeyboardArrowLeft} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import {Card, CardContent, List, Typography} from "@material-ui/core";
import Spinner from "../../common/components/Spinner";
import UserInfoActions from "../actions/userInfo";
import PageComponent from "../components/PageComponent";

const styles = {
    root: {
        height: '100%',
        margin: 'auto',
        width: '90%',
        marginBottom: 10,
    },
    title: {
        fontSize: 14,
        display: 'inline-block',
    },
    allText: {
        display: 'inline-block',
        float: 'right',
        fontSize: 14,
    },
    headerBlock: {},
};

class UsersInfo extends React.Component {

    state = {
        params: {}
    };

    componentDidMount() {
        this.props.getUserInfoActionForPage(this.state.params, 0);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.mainState.isError) {
            alert(nextProps.mainState.error);
        }
    }

    onBackClicked = () => {
        this.props.history.goBack();
    };

    renderUsers = users => {
        return users ? users.map((user) => {
            return (
                <div>{user.name}</div>
            );
        }) : null;
    };

    onPageSelected = (page) => {
        this.props.getUserInfoActionForPage(this.state.params, page);
    };

    render() {
        const {classes, mainState: {users, allUsers, currentPage, allPages}, isLoading} = this.props;
        return (
            <div className={classes.root}>
                <IconButton onClick={this.onBackClicked} aria-label="Back">
                    <KeyboardArrowLeft/>
                </IconButton>
                <Card>
                    <Spinner isLoading={isLoading}/>
                    <CardContent>
                        <div className={classes.headerBlock}>
                            <Typography className={classes.title}>
                                Users
                            </Typography>
                            <Typography className={classes.allText}>
                                All: {allUsers ? allUsers : 0}
                            </Typography>
                        </div>
                        <List>
                            {this.renderUsers(users)}
                        </List>
                        <PageComponent
                            allPages={allPages}
                            currentPage={currentPage}
                            showArrows
                            onPageSelected={this.onPageSelected()}
                        />
                    </CardContent>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isLoading: state.app.isLoading,
    mainState: {...state.userInfo}
});

const mapDispatchToProps = dispatch => ({
    getUserInfoActionForPage: (params, forPage) => dispatch(UserInfoActions.getUserInfoAction(params, forPage))
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(UsersInfo));