import firebase from "firebase/app";
import "firebase/firestore";
import config from "./config";

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

export default firebase;
