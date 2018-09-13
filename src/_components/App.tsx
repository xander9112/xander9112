import * as React from "react";
import {HashRouter as Router, Route} from "react-router-dom";
import {connect} from "react-redux";
import {createAction} from "redux-actions";
import Navigation from "./Navigation";
import {LandingPage} from "../_pages/LandingPage";
import {SignUpPage} from "../_pages/SignUpPage";
import {SignInPage} from "../_pages/SignInPage";
import {AccountPage} from "../_pages/Account";
import {Reminders} from "../_pages/Reminders";
import * as routes from "../_constants";
import "../_assets/styles/index.scss";
import {authConstants} from "../_constants";
import {Auth} from "../_firebase";
import {Dispatch} from "redux";
import CircularProgress from "@material-ui/core/es/CircularProgress/CircularProgress";
import withAuthentication from "../_firebase/withAuthentication";

interface IProps {
    user: any
    loginRequest: () => void
    loginSuccess: (authUser: any) => void
    loginFailed: () => void
}

class App extends React.Component<IProps, {}> {
    public componentDidMount() {
        this.props.loginRequest();

        Auth.onAuthStateChanged(authUser => {
            authUser
                ? this.props.loginSuccess(authUser)
                : this.props.loginFailed();
        });
    }

    public render() {
        const {user} = this.props;
        const {state} = user;

        return (
            <Router>
                <React.Fragment>
                    {state !== "LOADED"
                        ? <React.Fragment><CircularProgress size={50} /></React.Fragment>
                        :
                        <Navigation>
                            <Route
                                exact path={routes.LANDING}
                                component={LandingPage}
                            />
                            <Route
                                exact path={routes.SIGN_UP}
                                component={SignUpPage}
                            />
                            <Route
                                exact path={routes.SIGN_IN}
                                component={SignInPage}
                            />
                            <Route
                                exact path={routes.ACCOUNT}
                                component={AccountPage}
                            />
                            <Route
                                exact path={routes.REMINDERS}
                                component={Reminders}
                            />
                        </Navigation>

                    }
                </React.Fragment>
            </Router>
        );
    }
}

const mapStateToProps = (state: any) => ({user: state.user});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    loginRequest: () => dispatch(createAction(authConstants.LOGIN_REQUEST)()),
    loginSuccess: (authUser: any) => dispatch(createAction(authConstants.LOGIN_SUCCESS)(authUser)),
    loginFailed: () => dispatch(createAction(authConstants.LOGIN_FAILURE)())
});

export default withAuthentication(connect(mapStateToProps, mapDispatchToProps)(App));
