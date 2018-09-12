import * as React from "react";
import {RouteComponentProps} from "react-router";

import {Theme} from "@material-ui/core/styles/createMuiTheme";
import {createStyles, withStyles, WithStyles} from "@material-ui/core";

interface IProps extends WithStyles<typeof styles> {
}

interface IState {
}

const styles = (theme: Theme) => createStyles({});

class Component extends React.Component<IProps & RouteComponentProps<any, any>, IState> {
    public render() {
        return (
            <div>
                <h1>Landing Page</h1>
            </div>
        );
    }
}

export default withStyles(styles, {withTheme: true})(Component);

