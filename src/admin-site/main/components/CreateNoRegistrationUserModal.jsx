import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";

class CreateNoRegistrationUserModal extends React.Component {

    state = {
        username: "",
        password: "",
        email: ""
    };

    changeUsername = e => {
        this.setState({
            username: e.target.value
        })
    };
    changePassword = e => {
        this.setState({
            password: e.target.value
        })
    };
    changeEmail = e => {
        this.setState({
            email: e.target.value
        })
    };

    save = () => {
        this.props.save({...this.state});
    };

    render = () => {
        return (
            <Dialog
                open
                onClose={this.props.onClose}
            >
                <DialogTitle onClose={this.props.onClose}>
                    <Typography>No Registration form:</Typography>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Username"
                        variant="outlined"
                        name="username"
                        autoComplete="username"
                        type="username"
                        margin="normal"
                        value={this.state.username}
                        onChange={this.changeUsername}
                    />
                    <br/>
                    <TextField
                        label="Password"
                        variant="outlined"
                        name="password"
                        type="password"
                        margin="normal"
                        value={this.state.password}
                        onChange={this.changePassword}
                    />
                    <br/>
                    <TextField
                        label="Email"
                        variant="outlined"
                        name="email"
                        type="email"
                        margin="normal"
                        value={this.state.email}
                        onChange={this.changeEmail}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.save}>Register</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

CreateNoRegistrationUserModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired
};

export default CreateNoRegistrationUserModal;