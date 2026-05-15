/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDNV7pLayFxPSH6OmLt59eASY8bOk6p0Uo",
  authDomain: "madventure-dd390.firebaseapp.com",
  projectId: "madventure-dd390",
  storageBucket: "madventure-dd390.firebasestorage.app",
  messagingSenderId: "506292869719",
  appId: "1:506292869719:web:e7ecd945b43f73c010e112"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/madventure-logo-v2.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
