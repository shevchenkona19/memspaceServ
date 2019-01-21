import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import NotFound from "../../common/components/NotFound";
import Chooser from "./Chooser";

class AppRouter extends React.Component {
    render() {
        return (
            <Router basename={"/admin"}>
                <Switch>
                    <Route
                        path={"/login"}
                        exact
                        component={LoginForm}
                    />
                    <Route
                        path={"/register"}
                        exact
                        component={RegisterForm}
                    />
                    <Route
                        path={"/"}
                        exact
                        component={Chooser}
                    />
                    <Route
                        path={"/*"}
                        component={NotFound}
                    />
                </Switch>
            </Router>
        )
    }
}

export default AppRouter