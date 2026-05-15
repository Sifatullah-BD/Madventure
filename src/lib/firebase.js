// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging"; // getToken যোগ করা হয়েছে

const firebaseConfig = {
  apiKey: "AIzaSyDNV7pLayFxPSH6OmLt59eASY8bOk6p0Uo",
  authDomain: "madventure-dd390.firebaseapp.com",
  projectId: "madventure-dd390",
  storageBucket: "madventure-dd390.firebasestorage.app",
  messagingSenderId: "506292869719",
  appId: "1:506292869719:web:e7ecd945b43f73c010e112"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// এই ফাংশনটি যোগ করুন যা আপনার NotificationContext খুঁজছে
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "YOUR_VAPID_KEY_HERE" // আপনার Firebase কনসোল থেকে VAPID Key টি এখানে বসান
    });
    if (currentToken) {
      console.log('Token found:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available.');
    }
  } catch (err) {
    console.log('An error occurred while retrieving token.', err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export default app;