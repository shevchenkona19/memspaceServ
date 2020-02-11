import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";

class AddCategoryModal extends React.Component {

    state = {
        categoryName: ""
    };

    changeCategoryName = e => {
        this.setState({
            categoryName: e.target.value
        })
    };

    save = () => {
        this.props.save(this.state.categoryName);
    };

    render = () => {
        return (
            <Dialog
                open
                onClose={this.props.onClose}
            >
                <DialogTitle onClose={this.props.onClose}>
                    <Typography>New category name:</Typography>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Category name:"
                        variant="outlined"
                        name="name"
                        type="name"
                        margin="normal"
                        value={this.state.categoryName}
                        onChange={this.changeCategoryName}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.save}>Save</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

AddCategoryModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired
};

export default AddCategoryModal;