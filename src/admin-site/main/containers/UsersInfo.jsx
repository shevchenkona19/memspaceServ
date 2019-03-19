import React from "react";
import {withStyles} from '@material-ui/core/styles';
import {connect} from "react-redux";
import {KeyboardArrowLeft} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import {
    Avatar,
    Button,
    Card,
    CardContent,
    FormControlLabel,
    List,
    ListItem,
    ListItemText,
    Switch,
    TextField,
    Typography
} from "@material-ui/core";
import Spinner from "../../common/components/Spinner";
import UserInfoActions from "../actions/userInfo";
import PageComponent from "../components/PageComponent";
import imageLoader from "../utils/imageLoader";
import moment from "moment";
import DetailUserModal from "../components/DetailUserModal";
import FiltersComponent from "../components/FiltersComponent";
import FiltersDescriptor from "../utils/filterDescriptor";
import ListSelect from "../components/ListSelect";

const styles = {
    root: {
        height: '100%',
        margin: 'auto',
        width: '100%',
        marginBottom: 10,
        marginTop: 105,
    },
    title: {
        display: 'inline-block',
    },
    allText: {
        display: 'inline-block',
        float: 'right',
        fontSize: 14,
    },
    fullWidth: {
        width: '100%',
    },
    filtersCard: {
        display: 'inline-block',
        fontSize: 'medium',
        textAlign: 'left',
        marginLeft: '1%',
        marginRight: '1%',
        padding: 8,
        width: '28%',
    },
    userListCard: {
        textAlign: 'left',
        fontSize: 'medium',
        display: 'inline-block',
        width: '69%',
        marginRight: '1%',
    },
    wrapper: {
        display: 'flex'
    },
    datePicker: {
        display: 'inline-block',
        width: '80%'
    },
    applyBtn: {
        display: 'inline-block',
        width: '18%',
        marginLeft: '1%',
        marginRight: '1%'
    },
    headerBlock: {},
};

const filters = [
    "Likes count",
    "Dislikes count",
    "Comments count",
    "Favourites count",
    "Views count",
    "Referrals count",
    "Last online",
    "None"
];

const orders = [
    "ASC",
    "DESC"
];

class UsersInfo extends React.Component {

    state = {
        params: {
            filter: FiltersDescriptor(filters[filters.length - 1]),
            order: "DESC",
        },
        modalVisible: false,
        selectedUser: {},
        showLastVisited: false,
        lastVisited: "",
        selectedFilter: filters[filters.length - 1],
    };

    errorShown = false;

    componentDidMount() {
        this.getInfo(0);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.mainState.isError && !this.errorShown) {
            this.errorShown = true;
            // alert(nextProps.mainState.error);
        } else if (this.errorShown) {
            this.errorShown = false;
        }
    }

    onBackClicked = () => {
        this.props.history.goBack();
    };

    renderUsers = users => {
        return users ? users.map((user) => {
            return (
                <ListItem onClick={() => this.openModal(user)} button key={user.userId}>
                    <Avatar src={imageLoader.userLoader(user.username)} alt="user avatar"/>
                    <ListItemText primary={user.username}
                                  secondary={user.lastVisited ? "Last online: " + moment(user.lastVisited).format("HH:MM DD/MM/YYYY").toString() : ""}/>
                </ListItem>
            );
        }) : null;
    };

    onPageSelected = (page) => {
        this.getInfo(page);
    };

    closeModal = () => {
        this.setState({modalVisible: false, selectedUser: {}})
    };

    openModal = user => {
        this.setState({
            modalVisible: true,
            selectedUser: user,
        })
    };

    onChangeFilter = filter => {
        this.setState({
            selectedFilter: filter,
            params: {...this.state.params, filter: FiltersDescriptor(filter)}
        }, this.getInfo);
    };

    onChangeOrder = order => {
        this.setState(state => ({
            params: {
                ...state.params,
                order
            }
        }), this.getInfo);
    };

    getInfo = (page = this.props.mainState.currentPage) => {
        if (this.state.showLastVisited) {
            this.props.getUserInfoActionForPage({
                ...this.state.params,
                lastVisited: this.state.lastVisited,
            }, page);
        } else {
            this.props.getUserInfoActionForPage(this.state.params, page)
        }
    };

    onChangeShowLastVisited = e => {
        const showLastVisited = e.target.checked;
        this.setState({
            showLastVisited
        }, () => {
            if (!showLastVisited) {
                this.getInfo()
            }
        })
    };

    onChangeLastVisited = e => {
        this.setState({
            lastVisited: e.target.value
        })
    };

    applyLastOnline = () => {
        this.getInfo();
    };

    render() {
        const {classes, mainState: {users, allUsers, currentPage, allPages}, isLoading} = this.props;
        return (
            <div className={classes.root}>
                {this.state.modalVisible && <DetailUserModal
                    onClose={this.closeModal}
                    user={this.state.selectedUser}
                />}
                <IconButton onClick={this.onBackClicked} aria-label="Back">
                    <KeyboardArrowLeft/>
                </IconButton>
                <div className={classes.wrapper}>
                    <Card className={classes.filtersCard}>
                        <Typography variant={'h5'}>
                            Filters
                        </Typography>
                        <FiltersComponent
                            filters={filters}
                            onChangeFilter={this.onChangeFilter}
                            label={"Select a filter"}
                            selectedFilter={this.state.selectedFilter}
                        />
                        <br/>
                        <ListSelect
                            label={"Order"}
                            selectedValue={this.state.params.order}
                            items={orders}
                            onChange={this.onChangeOrder}
                        />
                        <FormControlLabel control={
                            <Switch
                                checked={this.state.showLastVisited}
                                onChange={this.onChangeShowLastVisited}
                            />
                        } label={"Use last online"}/>
                        {this.state.showLastVisited &&
                        <div><TextField
                            id="datetime-local"
                            label="Last online"
                            type="datetime-local"
                            onChange={this.onChangeLastVisited}
                            defaultValue={moment().subtract('24', 'days').format("YYYY-MM-DDTHH:MM").toString()}
                            className={classes.fullWidth}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        /><Button onClick={this.applyLastOnline}>Apply</Button></div>}
                    </Card>
                    <Card className={classes.userListCard}>
                        <Spinner isLoading={isLoading}/>
                        <CardContent>
                            <div className={classes.headerBlock}>
                                <Typography variant={'h5'} className={classes.title}>
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
                                onPageSelected={this.onPageSelected}
                            />
                        </CardContent>
                    </Card>
                </div>
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