// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDNV7pLayFxPSH6OmLt59eASY8bOk6p0Uo",
  authDomain: "madventure-dd390.firebaseapp.com",
  projectId: "madventure-dd390",
  storageBucket: "madventure-dd390.firebasestorage.app",
  messagingSenderId: "506292869719",
  appId: "1:506292869719:web:e7ecd945b43f73c010e112"
};

const app = initializeApp(firebaseConfig);

let messaging = null;

if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app);
  } catch (err) {
    console.warn('Firebase messaging init failed:', err);
  }
}

export { messaging };

export const requestForToken = async () => {
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || ""
    });
    if (currentToken) {
      console.log('FCM Token:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (err) {
    console.log('Token retrieve error:', err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export default app;