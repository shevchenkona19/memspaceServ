import React from "react";
import BackButton from "../components/BackButton";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography
} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import {withStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import EditCategoriesActions from "../actions/categoryEditing"
import {_delete, post} from "../utils/api/api";
import Spinner from "../../common/components/Spinner";
import AddCategoryModal from "../components/AddCategoryModal";
import {withRouter} from 'react-router-dom';

const styles = {
    root: {
        width: "100%",
        height: "100%",
        margin: "auto"
    }
};

class EditCategories extends React.Component {

    state = {
        isModalVisible: false
    };

    componentDidMount() {
        this.props.getCategories();
    }

    onBackClick = () => {
        this.props.history.goBack();
    };

    openModal = () => {
        this.setState({isModalVisible: true});
    };

    closeModal = () => {
        this.setState({isModalVisible: false});
    };

    addCategory = categoryName => {
        post("/moderator/createCategory", {
            categoryName,
        }).then(res => {
            if (res.success) {
                this.props.getCategories();
            } else {
                alert(toString(res));
            }
        }).catch(e => {
            alert(toString(e))
        })
    };

    deleteCategory = id => {
        _delete("/moderator/category?id=" + id)
            .then(res => {
                if (res.success) {
                    this.props.getCategories();
                } else alert(toString(res))
            }).catch(e => {
            alert(toString(e));
        })
    };

    renderCategories = categories => {
        return categories.map(category => (<ListItem key={category.categoryId}>
            <ListItemText primary={category.categoryName}/>
            <ListItemIcon><DeleteIcon onClick={() => this.deleteCategory(category.categoryId)}/></ListItemIcon>
        </ListItem>));
    };

    render = () => {
        const {classes, editCategories: {categories}, isLoading} = this.props;
        const {isModalVisible} = this.state;

        return (
            <div className={classes.root}>
                <BackButton onBackClick={this.onBackClick}/>
                {isModalVisible && <AddCategoryModal onClose={this.closeModal} save={name => {
                    this.closeModal();
                    this.addCategory(name)
                }}/>}
                <div className={classes.wrapper}>
                    <Card>
                        <CardHeader>
                            <Typography>Actions:</Typography>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={this.openModal}>Add category</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            {isLoading ? <Spinner isLoading/> : <List>
                                {categories && categories.length > 0 ? this.renderCategories(categories) :
                                    <Typography>No categories</Typography>}
                            </List>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoading: state.app.isLoading,
    editCategories: {...state.editCategories},
});

const mapDispatchToProps = dispatch => ({
    getCategories: () => dispatch(EditCategoriesActions.getCategoriesAction())
});

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EditCategories)));