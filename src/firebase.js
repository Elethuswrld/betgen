
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "betgen-19013055",
  appId: "1:1095930680011:web:908f0451da55e53370c14e",
  storageBucket: "betgen-19013055.firebasestorage.app",
  apiKey: "AIzaSyARbyRlyvup-JI6SQbaZ6gWsv68Igg24uA",
  authDomain: "betgen-19013055.firebaseapp.com",
  messagingSenderId: "1095930680011",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
