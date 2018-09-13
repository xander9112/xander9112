import * as React from "react";
import {withRouter} from "react-router-dom";
import * as routes from "../_constants/routes";
import {Auth} from "./firebase";
import {AuthUserContext} from "./AuthUserContext";

interface InterfaceProps {
    history?: any;
}

export const withAuthorization = (condition: any) => (Component: any) => {
    class WithAuthorization extends React.Component<InterfaceProps, {}> {
        public componentDidMount() {
            Auth.onAuthStateChanged(authUser => {
                if (!condition(authUser)) {
                    this.props.history.push(routes.SIGN_IN);
                }
            });
        }

        public render() {
            return (
                <AuthUserContext.Consumer>
                    {(authUser: any) => (authUser ? <Component /> : null)}
                </AuthUserContext.Consumer>
            );
        }
    }

    return withRouter(WithAuthorization as any);
};
