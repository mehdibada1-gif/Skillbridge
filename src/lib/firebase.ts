import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  "projectId": "skillbridge-i1a6q",
  "appId": "1:565080802607:web:250856c7e44ce7930dcdda",
  "storageBucket": "skillbridge-i1a6q.appspot.com",
  "apiKey": "AIzaSyD21GbokO6H-3Ry_5JYd3nXznDB7dOuvqM",
  "authDomain": "skillbridge-i1a6q.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "565080802607"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
