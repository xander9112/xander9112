import * as firebase from "firebase/app";

const prodConfig = {
    apiKey: "AIzaSyBnHBpPRsaWwdNhFT9MIoeR478U0rHACrE",
    authDomain: "xander9112-42790.firebaseapp.com",
    databaseURL: "https://xander9112-42790.firebaseio.com",
    projectId: "xander9112-42790",
    storageBucket: "xander9112-42790.appspot.com",
    messagingSenderId: "902240415696"
};

const devConfig = {
    apiKey: "AIzaSyBnHBpPRsaWwdNhFT9MIoeR478U0rHACrE",
    authDomain: "xander9112-42790.firebaseapp.com",
    databaseURL: "https://xander9112-42790.firebaseio.com",
    projectId: "xander9112-42790",
    storageBucket: "xander9112-42790.appspot.com",
    messagingSenderId: "902240415696"
};

const config = process.env.NODE_ENV === "production"
    ? prodConfig
    : devConfig;

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}


const auth = firebase.auth();

export {
    auth
};
