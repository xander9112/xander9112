import * as React from "react";
// import {Link} from "react-router-dom";
// import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import SignOut from "../SignOut";
import * as routes from "../../_constants";
import {ListItemLink} from "../ListItemLink";
import {AuthUserContext} from "../../_firebase/AuthUserContext";


const NavigationAuth = () =>
    <React.Fragment>
        <ListItemLink to={routes.LANDING}>
            <ListItemText>Landing</ListItemText>
        </ListItemLink>
        <ListItemLink to={routes.HOME}>
            <ListItemText>Home</ListItemText>
        </ListItemLink>
        <ListItemLink to={routes.ACCOUNT}>
            <ListItemText>Account</ListItemText>
        </ListItemLink>
        <ListItemLink to={routes.REMINDERS}>
            <ListItemText>Reminders</ListItemText>
        </ListItemLink>
        <SignOut />
    </React.Fragment>;

const NavigationNonAuth = () =>
    <React.Fragment>
        <ListItemLink to={routes.LANDING}>
            <ListItemText>Landing</ListItemText>
        </ListItemLink>
        <ListItemLink to={routes.SIGN_IN}>
            <ListItemText>Sign In</ListItemText>
        </ListItemLink>
    </React.Fragment>;

export default () => (
    <AuthUserContext.Consumer>
        {(authUser: any) => (authUser ? <NavigationAuth /> : <NavigationNonAuth />)}
    </AuthUserContext.Consumer>
);
