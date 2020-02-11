import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import NotFound from "../../common/components/NotFound";
import MemPicker from "./MemPicker";
import Home from "./Home";
import UsersInfo from "./UsersInfo";
import ViewReports from "./ViewReports";
import EditCategories from "./EditCategories";

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
                        path={"/usersInfo"}
                        exact
                        component={UsersInfo}
                    />
                    <Route
                        path={"/viewReports"}
                        exact
                        component={ViewReports}
                    />
                    <Route
                        path={"/editCategories"}
                        exact
                        component={EditCategories}
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