import * as React from "react";
import {doSignOut} from "../_firebase";
import ListItem from "@material-ui/core/es/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";

const SignOut = () =>
    <ListItem onClick={doSignOut}>
        <ListItemText>
            Sign out
        </ListItemText>
    </ListItem>;

export default SignOut;
