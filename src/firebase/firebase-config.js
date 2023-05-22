// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsp0zkR2dPwYSPS7RdXb1Wmz9DklfNzBI",
  authDomain: "mapresteel-adb66.firebaseapp.com",
  projectId: "mapresteel-adb66",
  storageBucket: "mapresteel-adb66.appspot.com",
  messagingSenderId: "1056583797992",
  appId: "1:1056583797992:web:1b6b2768abb6d60455cd5d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);
export{app, auth, db, storage}