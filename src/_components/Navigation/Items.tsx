import * as React from "react";
import {Link} from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import * as routes from "../../_constants";

export default () => (
    <React.Fragment>
        <Link to={routes.SIGN_IN}>
            <ListItem button><ListItemText>Sign In</ListItemText></ListItem>
        </Link>
        <Link to={routes.LANDING}>
            <ListItem button><ListItemText>Landing</ListItemText></ListItem>
        </Link>
        <Link to={routes.HOME}>
            <ListItem button><ListItemText>Home</ListItemText></ListItem>
        </Link>
        <Link to={routes.ACCOUNT}>
            <ListItem button><ListItemText>Account</ListItemText></ListItem>
        </Link>
    </React.Fragment>
);
