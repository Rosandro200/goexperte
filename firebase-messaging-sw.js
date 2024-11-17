importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBZrLQF4shYXYx_j0qPkqc5f8mRC_Ys1zw",
    authDomain: "expert-66274.firebaseapp.com",
    projectId: "expert-66274",
    storageBucket: "expert-66274.appspot.com",
    messagingSenderId: "728415410069",
    appId: "1:728415410069:web:f94e23eb080132b87f089c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
}); 