import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
    projectId: "betgen-19013055",
    appId: "1:1095930680011:web:1e36c25f9cf440a670c14e",
    storageBucket: "betgen-19013055.appspot.com",
    apiKey: "AIzaSyARbyRlyvup-JI6SQbaZ6gWsv68Igg24uA",
    authDomain: "betgen-19013055.firebaseapp.com",
    messagingSenderId: "1095930680011",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };
