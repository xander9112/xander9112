import * as React from "react";

import {Theme} from "@material-ui/core/styles/createMuiTheme";
import {createStyles, withStyles} from "@material-ui/core";
import {withRouter} from "react-router-dom";
import SignUpForm from "./components/SignUpForm";


const styles = (theme: Theme) => createStyles({});

const SignUpPage = ({history}: any) =>
    <div>
        <h1>SignUp</h1>
        <SignUpForm history={history} />
    </div>;

export default withStyles(styles, {withTheme: true})(withRouter(SignUpPage));

