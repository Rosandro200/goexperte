// Remove import statements since we're using script tags
const firebaseConfig = {
  apiKey: "AIzaSyBZrLQF4shYXYx_j0qPkqc5f8mRC_Ys1zw",
  authDomain: "expert-66274.firebaseapp.com",
  projectId: "expert-66274",
  storageBucket: "expert-66274.appspot.com",
  messagingSenderId: "728415410069",
  appId: "1:728415410069:web:f94e23eb080132b87f089c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Make db available globally
window.db = db; 