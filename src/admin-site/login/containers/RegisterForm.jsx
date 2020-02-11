import React from "react";
import {withStyles} from '@material-ui/core/styles';
import {KeyboardArrowLeft} from "@material-ui/icons";
import {withRouter} from "react-router-dom";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Title from "../../common/components/Title";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import {CardActions} from "@material-ui/core";
import Button from "@material-ui/core/es/Button/Button";
import axios from "axios";
import Cookie from "js-cookie";

const styles = {
    root: {
        margin: "0 auto",
        width: 300
    },
    grow: {
        flexGrow: 1,
        marginLeft: -15,
        marginTop: -3
    },
    doubleDistance: {
        display: "inline",
    },
};

class RegisterForm extends React.Component {

    state = {
        name: "",
        password: "",
        email: "",
        isLoading: false
    };

    changeUsername = ({target: {value}}) => {
        this.setState({username: value});
    };

    changePassword = ({target: {value}}) => {
        this.setState({password: value});
    };

    changeEmail = ({target: {value}}) => {
        this.setState({email: value});
    };

    register = () => {
        axios.request({
            method: "POST",
            url: SERVER_URL + "/account/registerModer",
            data: {
                username: this.state.username,
                password: this.state.password,
                email: this.state.email
            }
        }).then(({data: {token}}) => {
            Cookie.set("token", token);
            window.location.href = "/admin/"
        })
            .catch(err => {
                this.setState({isLoading: false});
                alert("That's an error: " + err);
            });
        this.setState({isLoading: true})
    };

    onBackClicked = () => {
        this.props.history.goBack();
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Card>
                    <CardContent>
                        <IconButton className={classes.grow} onClick={this.onBackClicked} aria-label="Back">
                            <KeyboardArrowLeft/>
                        </IconButton>
                        <Title margin="normal" className={classes.doubleDistance} text={"Register admin: "}/>
                        <TextField
                            label="Username"
                            variant="outlined"
                            name="username"
                            autoComplete="username"
                            type="username"
                            margin="normal"
                            className={classes.maxWidth}
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
                            className={classes.maxWidth}
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
                            className={classes.maxWidth}
                            value={this.state.email}
                            onChange={this.changeEmail}
                        />

                    </CardContent>
                    <CardActions>
                        <Button
                            size={"small"}
                            disabled={this.state.isLoading}
                            onClick={this.register}
                        >
                            Register
                        </Button>
                    </CardActions>
                </Card>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(RegisterForm));