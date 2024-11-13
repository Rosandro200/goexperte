// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZrLQF4shYXYx_j0qPkqc5f8mRC_Ys1zw",
  authDomain: "expert-marketplace.firebaseapp.com",
  projectId: "expert-marketplace",
  storageBucket: "expert-marketplace.appspot.com",
  messagingSenderId: "728415410069",
  appId: "1:728415410069:web:f94e23eb080132b87f089c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth }; 