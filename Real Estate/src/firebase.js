// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-abb6f.firebaseapp.com",
  projectId: "mern-estate-abb6f",
  storageBucket: "mern-estate-abb6f.appspot.com",
  messagingSenderId: "689461105163",
  appId: "1:689461105163:web:218bf8b177472e1122ed0e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);