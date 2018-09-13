import * as React from "react";
import {RouteComponentProps} from "react-router";

import {Theme} from "@material-ui/core/styles/createMuiTheme";
import {createStyles, withStyles, WithStyles} from "@material-ui/core";

// import {AuthUserContext} from "../../_firebase/AuthUserContext";
// import {withAuthorization} from "../../_firebase/withAuthorization";
import {getReminders} from "../../_firebase";
import Button from "@material-ui/core/es/Button/Button";
import List from "@material-ui/core/es/List/List";
import ListItem from "@material-ui/core/es/ListItem/ListItem";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";

interface IProps extends WithStyles<typeof styles> {
    user: any
}

interface IState {
    reminders: any[]
}

const styles = (theme: Theme) => createStyles({});

class Component extends React.Component<IProps & RouteComponentProps<any, any>, IState> {
    public state = {
        reminders: []
    };

    public componentWillUnmount() {
        getReminders().off();
    }

    public componentDidMount() {
        const {uid} = this.props.user;

        getReminders(uid).on("value", snap => {
            let reminders = [];

            if (snap) {
                reminders = Object.keys(snap.val()).map((key: string) => snap.val()[key]);
            }

            this.setState({reminders});
        });
    }

    public render() {
        const {reminders} = this.state;

        return (
            <div>
                <List>
                    {reminders.map((reminder: any) => (<ListItem>
                        <ListItemText primary={reminder.title} secondary={reminder.comment} />
                    </ListItem>))}
                </List>
                <Button onClick={() => this.createReminder()}>Создать</Button>
            </div>
        );
    }

    private createReminder = () => {
        const {uid} = this.props.user;
        const newReminders = getReminders(uid).push();

        newReminders.set({
            title: "Настойка",
            comment: "Комментарий",
            timestamp: +new Date()
        });
    };
}

// const authCondition = (authUser: any) => !!authUser;


export default withStyles(styles, {withTheme: true})((Component));

