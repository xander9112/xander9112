import * as React from "react";
import {Auth} from "./index";
import {AuthUserContext} from "./AuthUserContext";

interface IProps {
    authUser?: any;
}

interface IState {
    authUser?: any;
}

const withAuthentication = (Component: any) => {
    class WithAuthentication extends React.Component<IProps, IState> {
        constructor(props: any) {
            super(props);

            this.state = {
                authUser: null
            };
        }

        public componentDidMount() {
            Auth.onAuthStateChanged(authUser => {


                authUser
                    ? this.setState({authUser})
                    : this.setState({authUser: null});
            });
        }

        public render() {
            const {authUser} = this.state;
            // console.log(authUser ? authUser.uid : null);
            return (
                <AuthUserContext.Provider value={authUser}>
                    <Component />
                </AuthUserContext.Provider>
            );
        }
    }

    return WithAuthentication;
};

export default withAuthentication;
