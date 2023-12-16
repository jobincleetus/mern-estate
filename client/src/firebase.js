// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-estate-a14a7.firebaseapp.com",
    projectId: "mern-estate-a14a7",
    storageBucket: "mern-estate-a14a7.appspot.com",
    messagingSenderId: "648357872294",
    appId: "1:648357872294:web:b30536655f4fd799d1ea67"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);