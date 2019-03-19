import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var config = {
    apiKey: "AIzaSyBOjYWS4NFMgPz9xxNm4IuI3ryWBguWyqY",
    authDomain: "react-slack-clone-a3a75.firebaseapp.com",
    databaseURL: "https://react-slack-clone-a3a75.firebaseio.com",
    projectId: "react-slack-clone-a3a75",
    storageBucket: "react-slack-clone-a3a75.appspot.com",
    messagingSenderId: "262538528074"
  };
  firebase.initializeApp(config);

export default firebase;