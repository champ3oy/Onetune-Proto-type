import firebase from "firebase";

// Use your firebase config here

const config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};
// Initialize Firebase
Fire = firebase.initializeApp(config);

export default Fire;
