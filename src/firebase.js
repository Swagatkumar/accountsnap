import firebase from 'firebase'
import { API_KEY, APP_ID, AUTH_DOMAIN, MEASUREMENT_ID, MESSAGEING_SENDER_ID, PROJECT_ID, STORAGE_BUCKET } from './components/CipherConstants';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGEING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID
  };

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebase.auth()

export {db, auth}