import * as React from "react";
import {HashRouter as Router, Route} from "react-router-dom";
import Navigation from "./Navigation";
import {LandingPage} from "../_pages/LandingPage";
import {SignUpPage} from "../_pages/SignUpPage";
import * as routes from "../_constants";

const App = () =>
    <Router>
        <React.Fragment>
            <Navigation>
                <Route
                    exact path={routes.LANDING}
                    component={LandingPage}
                />
                <Route
                    exact path={routes.SIGN_UP}
                    component={SignUpPage}
                />
            </Navigation>
        </React.Fragment>
    </Router>;

export default App;
