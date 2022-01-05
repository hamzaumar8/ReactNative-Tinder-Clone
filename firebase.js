// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4JPmhmH-PFW3FJ8sxG0qNB45SzCnVAb0",
  authDomain: "tinderclone-165a4.firebaseapp.com",
  projectId: "tinderclone-165a4",
  storageBucket: "tinderclone-165a4.appspot.com",
  messagingSenderId: "507308419326",
  appId: "1:507308419326:web:b79762a274b754857d5daf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

const db = getFirestore();

export { auth, db };