import React from "react";
import {withStyles} from '@material-ui/core/styles';
import PropTypes from "prop-types";
import Card from "@material-ui/core/es/Card/Card";
import CardMedia from "@material-ui/core/es/CardMedia/CardMedia";
import GridList from "@material-ui/core/es/GridList/GridList";
import {connect} from "react-redux";
import memChecker from "../actions/memChecker";
import categories from "../actions/categories";
import GridListTile from "@material-ui/core/es/GridListTile/GridListTile";
import imageLoader from "../utils/imageLoader";
import CardActions from "@material-ui/core/es/CardActions/CardActions";
import Button from "@material-ui/core/es/Button/Button";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from "@material-ui/core/es/FormControlLabel/FormControlLabel";
import CardContent from "@material-ui/core/es/CardContent/CardContent";
import {KeyboardArrowLeft} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";


const styles = theme => ({
    root: {
        height: "100%",
        margin: "auto",
        marginTop: 100,
        marginBottom: 10,
        [theme.breakpoints.down("sm")]: {
            width: "95%"
        },
        [theme.breakpoints.up("md")]: {
            width: "90%"
        },
        [theme.breakpoints.up("lg")]: {
            width: "50%"
        },
        [theme.breakpoints.between("lg", "xl")]: {
            width: "40%"
        },
        [theme.breakpoints.up("xl")]: {
            width: "20%"
        }
    },
    list: {
        marginLeft: "10px !important",
        marginRight: "10px !important",
    }
});

class MemChecker extends React.Component {

    state = {
        categories: [],
    };

    componentDidMount() {
        this.props.categoriesActions.getCategoriesAction();
        this.props.memCheckerActions.getNewMemAction();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.categoriesState.isError) {
            this.displayError(nextProps.categoriesState.error);
        } else if (nextProps.memCheckerState.isError) {
            this.displayError(nextProps.memCheckerState.error);
        }
        if (this.state.categories.length !== nextProps.categoriesState.categories.length) {
            this.setState({
                categories: nextProps.categoriesState.categories
            })
        }
    }

    checkCategory = (categoryId, checked) => {
        this.setState({
            categories: this.state.categories.map(cat => {
                if (cat.categoryId === categoryId) {
                    cat.checked = checked;
                }
                return cat;
            })
        })
    };

    uncheckAll = () => {
        this.setState({
            categories: this.state.categories.map(category => {
                category.checked = false;
                return category;
            })
        })
    };

    displayError = message => {
        alert(message);
    };

    renderList = categories => {
        return categories.map(category => <GridListTile key={category.categoryId} cols={1}>
            <FormControlLabel control={
                <Checkbox
                    checked={category.checked}
                    onChange={() => this.checkCategory(category.categoryId, !category.checked)}
                />
            } label={category.categoryName}/>
        </GridListTile>)
    };

    sendMem = () => {
        const checkedIds = this.state.categories.filter(cat => cat.checked).map(cat => cat.categoryId);
        this.uncheckAll();
        this.props.memCheckerActions.postMemAction({imageId: this.props.memCheckerState.currentMem.imageId, checkedIds});
        this.props.memCheckerActions.getNewMemAction();
    };

    discardMem = () => {
        this.uncheckAll();
        this.props.memCheckerActions.discardMemAction(this.props.memCheckerState.currentMem.imageId);
        this.props.memCheckerActions.getNewMemAction();
    };

    onBackClicked = () => {
        this.props.history.goBack();
    };

    render() {
        const {classes, memCheckerState: {currentMem}} = this.props;
        return (
            <div className={classes.root}>
                <IconButton onClick={this.onBackClicked} aria-label="Back">
                    <KeyboardArrowLeft/>
                </IconButton>
                <Card>
                    {currentMem.imageId === -1 ? null :
                        <CardMedia
                            image={imageLoader.memLoader(currentMem.imageId)}
                            style={{
                                height: 0,
                                paddingTop: (currentMem.height / currentMem.width * 100) + "%",
                            }}
                        />}
                    <CardContent>
                        <GridList className={classes.list} cellHeight={40} cols={3}>
                            {this.renderList(this.state.categories)}
                        </GridList>
                    </CardContent>
                    <CardActions>
                        <Button onClick={this.sendMem}>send</Button>
                        <Button onClick={this.discardMem}>discard</Button>
                    </CardActions>
                </Card>
            </div>
        )
    }
}

MemChecker.propTypes = {
    categoriesState: PropTypes.shape({
        categories: PropTypes.array,
        isError: PropTypes.bool,
        error: PropTypes.string,
    }),
    memCheckerState: PropTypes.shape({
        currentMem: PropTypes.shape({
            imageId: PropTypes.number,
            width: PropTypes.number,
            height: PropTypes.number,
        }),
        gettingMem: PropTypes.bool,
        gettingSuccess: PropTypes.bool,
        isError: PropTypes.bool,
        isPosting: PropTypes.bool,
        postingSuccess: PropTypes.bool,
        error: PropTypes.string,
        isDiscarding: PropTypes.bool,
        discardSuccess: PropTypes.bool,
    }),
    memCheckerActions: PropTypes.shape({
        getNewMemAction: PropTypes.func,
        postMemAction: PropTypes.func,
        discardMemAction: PropTypes.func,
    }),
    categoriesActions: PropTypes.shape({
        getCategoriesAction: PropTypes.func,
    }),
};

const mapStateToProps = state => ({
    categoriesState: {...state.categories},
    memCheckerState: {...state.memChecker},
});

const mapDispatchToProps = dispatch => ({
    memCheckerActions: {
        getNewMemAction: () => dispatch(memChecker.getNewMemAction()),
        postMemAction: memInfo => dispatch(memChecker.postMemAction(memInfo)),
        discardMemAction: memId => dispatch(memChecker.discardMemAction(memId)),
    },
    categoriesActions: {
        getCategoriesAction: () => dispatch(categories.getCategoriesAction())
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MemChecker));