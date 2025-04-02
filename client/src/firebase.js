// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "horizon-homes-af5bd.firebaseapp.com",
  projectId: "horizon-homes-af5bd",
  storageBucket: "horizon-homes-af5bd.firebasestorage.app",
  messagingSenderId: "791389300439",
  appId: "1:791389300439:web:33a1b32005582d06e67292",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
