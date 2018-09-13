import {DB} from "./firebase";

// User API
export const doCreateUser = (id: string, username: string, email: string) =>
    DB.ref(`users/${id}`).set({email, username});

export const onceGetUsers = () => DB.ref("users").once("value");

export const getReminders = (userId?: string) => DB.ref(`reminders/${userId}`);
