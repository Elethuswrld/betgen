
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAI, getGenerativeModel } from "firebase/ai";

const firebaseConfig = {
  apiKey: "AIzaSyARbyRlyvup-JI6SQbaZ6gWsv68Igg24uA",
  authDomain: "betgen-19013055.firebaseapp.com",
  projectId: "betgen-19013055",
  storageBucket: "betgen-19013055.firebasestorage.app",
  messagingSenderId: "1095930680011",
  appId: "1:1095930680011:web:1e36c25f9cf440a670c14e"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ai = getAI(app);
const model = getGenerativeModel(ai, { model: "gemini-pro" });

export { db, model };
