// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCbIQ7u6wlGlmSeB3fnfrjBhG97I6UcJhQ",
  authDomain: "expert-66274.firebaseapp.com",
  databaseURL: "https://expert-66274-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "expert-66274",
  storageBucket: "expert-66274.firebasestorage.app",
  messagingSenderId: "728415410069",
  appId: "1:728415410069:web:f94e23eb080132b87f089c",
  measurementId: "G-L96GJ1SEK8"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
window.database = database; 
