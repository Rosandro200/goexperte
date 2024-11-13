// Use compat version for easier integration
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBZrLQF4shYXYx_j0qPkqc5f8mRC_Ys1zw",
  authDomain: "expert-marketplace.firebaseapp.com",
  projectId: "expert-marketplace",
  storageBucket: "expert-marketplace.appspot.com",
  messagingSenderId: "728415410069",
  appId: "1:728415410069:web:f94e23eb080132b87f089c"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth, firebase }; 