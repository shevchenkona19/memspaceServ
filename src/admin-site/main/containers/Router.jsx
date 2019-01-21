import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import NotFound from "../../common/components/NotFound";
import MemPicker from "./MemPicker";
import Home from "./Home";

class AppRouter extends React.Component {
    render() {
        return (
            <Router basename={"/admin"}>
                <Switch>
                    <Route
                        path={"/mem"}
                        exact
                        component={MemPicker}
                    />
                    <Route
                        path={"/"}
                        exact
                        component={Home}
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

export default AppRouter;