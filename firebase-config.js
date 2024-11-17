// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBZrLQF4shYXYx_j0qPkqc5f8mRC_Ys1zw",
  authDomain: "expert-66274.firebaseapp.com",
  databaseURL: "https://expert-66274-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "expert-66274",
  storageBucket: "expert-66274.appspot.com",
  messagingSenderId: "728415410069",
  appId: "1:728415410069:web:f94e23eb080132b87f089c"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
window.database = database; 