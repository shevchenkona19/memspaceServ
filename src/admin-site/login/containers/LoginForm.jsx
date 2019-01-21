import React from "react";
import {withStyles} from '@material-ui/core/styles';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Title from "../../common/components/Title";
import CardActions from "@material-ui/core/es/CardActions/CardActions";
import Button from "@material-ui/core/es/Button/Button";
import Spinner from "../../common/components/Spinner";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import {withRouter} from "react-router-dom";
import {KeyboardArrowLeft} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
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
    maxWidth: {
        width: "100%",
    }
};

class LoginForm extends React.Component {
    state = {
        username: "",
        password: "",
        isLoading: false,
    };

    changeUsername = e => {
        this.setState({username: e.target.value})
    };

    changePassword = e => {
        this.setState({password: e.target.value})
    };

    login = () => {
        axios.request({
            method: "POST",
            url: SERVER_URL + "/account/login",
            data: {
                username: this.state.username,
                password: this.state.password,
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
                    <Spinner isLoading={this.state.isLoading}/>
                    <CardContent>
                        <IconButton className={classes.grow} onClick={this.onBackClicked} aria-label="Back">
                            <KeyboardArrowLeft/>
                        </IconButton>
                        <Title margin="normal" className={classes.doubleDistance} text={"Login: "}/>
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
                            autoComplete="password"
                            type="password"
                            margin="normal"
                            className={classes.maxWidth}
                            value={this.state.password}
                            onChange={this.changePassword}
                        />
                    </CardContent>
                    <CardActions>
                        <Button
                            size={"small"}
                            disabled={this.state.isLoading}
                            onClick={this.login}
                        >
                            Login
                        </Button>
                    </CardActions>
                </Card>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(LoginForm));