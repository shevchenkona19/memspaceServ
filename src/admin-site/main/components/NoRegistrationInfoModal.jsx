import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@material-ui/core";
import PropTypes from "prop-types";
import {get} from "../utils/api/api";
import Spinner from "../../common/components/Spinner";

class NoRegistrationInfoModal extends React.Component {

    state = {
        isLoading: true,
        user: {}
    };

    componentDidMount() {
        get("/account/noRegistrationInfo")
            .then(res => {
                if (res.success) {
                    this.setState({
                        isLoading: false,
                        user: res.user
                    })
                } else {
                    this.setState({
                        isLoading: false
                    });
                    alert("Error: " + res.errorCode);
                    this.props.onClose();
                }
            })
            .catch(err => {
                alert("Error: " + JSON.stringify(err));
                this.props.onClose();
            })
    }

    render = () => {
        const {isLoading, user} = this.state;
        return (
            <Dialog
                open
                onClose={this.props.onClose}
            >
                <DialogTitle onClose={this.props.onClose}>
                    <Typography>Info about no registration user:</Typography>
                </DialogTitle>
                <DialogContent>
                    {isLoading && <Spinner isLoading/>}
                    {!isLoading &&
                    <div>
                        <Typography>
                            {`User id: ${user.userId}`}
                        </Typography>
                        <br/><Typography>
                        {`Username: ${user.username}`}
                    </Typography>
                        <br/>
                        <Typography>
                            {`email: ${user.email}`}
                        </Typography>
                    </div>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

NoRegistrationInfoModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default NoRegistrationInfoModal;