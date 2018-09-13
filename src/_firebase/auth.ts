import {Auth} from "./firebase";

// Sign Up
export const doCreateUserWithEmailAndPassword = (email: string, password: string) =>
    Auth.createUserWithEmailAndPassword(email, password);

// Sign In
export const doSignInWithEmailAndPassword = (email: string, password: string) =>
    Auth.signInWithEmailAndPassword(email, password);

// Sign out
export const doSignOut = () =>
    Auth.signOut();


// Password Reset
export const doPasswordReset = (email: string) =>
    Auth.sendPasswordResetEmail(email);

// Password Change
export const doPasswordUpdate = (password: string) => {
    if (!Auth.currentUser) {
        throw new Error("There is no currentUser!");
    }

    return Auth.currentUser.updatePassword(password);
};

