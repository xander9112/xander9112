import * as React from "react";
import {RouteComponentProps} from "react-router";

import {Theme} from "@material-ui/core/styles/createMuiTheme";
import {createStyles, withStyles, WithStyles} from "@material-ui/core";

import {AuthUserContext} from "../../_firebase/AuthUserContext";
import {withAuthorization} from "../../_firebase/withAuthorization";

interface IProps extends WithStyles<typeof styles> {
}

interface IState {
}

const styles = (theme: Theme) => createStyles({});

class Component extends React.Component<IProps & RouteComponentProps<any, any>, IState> {
    public render() {
        return (
            <AuthUserContext.Consumer>
                {(authUser: any) => (
                    <div>
                        <h1>Account: {(authUser as any).email}</h1>
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

const authCondition = (authUser: any) => !!authUser;


export default withStyles(styles, {withTheme: true})(withAuthorization(authCondition)(Component));

