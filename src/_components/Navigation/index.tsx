import * as React from "react";

import {createStyles, withStyles} from "@material-ui/core";
import {Theme} from "@material-ui/core/styles/createMuiTheme";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Items from "./Items";

const Index = (props: any) => {
    const {classes} = props;

    return (
        <div className={classes.root}>
            <AppBar position="absolute" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="title" color="inherit" noWrap>
                        Clipped drawer
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper
                }}
            >
                <div className={classes.toolbar} />
                <List component="nav">
                    <Items />
                </List>
                <Divider />
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {props.children}
            </main>
        </div>
    );
};

const drawerWidth = 240;

const styles = (theme: Theme) => createStyles({
    root: {
        flexGrow: 1,
        height: 430,
        zIndex: 1,
        overflow: "hidden",
        position: "relative",
        display: "flex"
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    drawerPaper: {
        position: "relative",
        width: drawerWidth
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        minWidth: 0 // So the Typography noWrap works
    },
    toolbar: theme.mixins.toolbar
});

export default withStyles(styles)(Index);
