/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "REPLACE_WITH_ENV_VALUE",
  authDomain: "REPLACE_WITH_ENV_VALUE",
  projectId: "REPLACE_WITH_ENV_VALUE",
  storageBucket: "REPLACE_WITH_ENV_VALUE",
  messagingSenderId: "REPLACE_WITH_ENV_VALUE",
  appId: "REPLACE_WITH_ENV_VALUE"
});

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
