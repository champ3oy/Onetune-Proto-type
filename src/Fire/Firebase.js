import firebase from "firebase";

const config = {
    apiKey: "AIzaSyBX7AJzgtdpfn1MDs2fzgrPdEPp7l4Ut50",
    authDomain: "onetuneplus.firebaseapp.com",
    databaseURL: "https://onetuneplus.firebaseio.com",
    projectId: "onetuneplus",
    storageBucket: "onetuneplus.appspot.com",
    messagingSenderId: "944885545752",
    appId: "1:944885545752:web:fdc3abcb6ca2ad6ba13c6d",
    measurementId: "G-KHPE4V1MLG"
};
// Initialize Firebase
Fire = firebase.initializeApp(config);

export default Fire;
