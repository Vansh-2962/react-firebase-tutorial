import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCUoCwVfuiuFwxwf6HNllGnl3_J0zNtsik",
  authDomain: "fir-tutorial-3e7c3.firebaseapp.com",
  projectId: "fir-tutorial-3e7c3",
  storageBucket: "fir-tutorial-3e7c3.appspot.com",
  messagingSenderId: "706498732423",
  appId: "1:706498732423:web:50568b128e3123afe2f322",
  measurementId: "G-N5Z123HS95",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
