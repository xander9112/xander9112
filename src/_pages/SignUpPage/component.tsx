import * as React from "react";

import {Theme} from "@material-ui/core/styles/createMuiTheme";
import {createStyles, withStyles, WithStyles} from "@material-ui/core";

import SignUpForm from "./components/SignUpForm";

interface IProps extends WithStyles<typeof styles> {
}

interface IState {
}

const styles = (theme: Theme) => createStyles({});

class Component extends React.Component<IProps, IState> {
    public render() {
        return (
            <div>
                <h1>SignUp</h1>
                <SignUpForm />
            </div>
        );
    }
}

export default withStyles(styles, {withTheme: true})(Component);

