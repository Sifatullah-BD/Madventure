import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if Firebase is properly configured
const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let app = null;
let messaging = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
}

export { messaging, isFirebaseConfigured };

export const requestForToken = async () => {
  if (!isFirebaseConfigured || !messaging) {
    console.log('Firebase not configured, skipping token request');
    return null;
  }

  try {
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
    });
    if (currentToken) {
      console.log('Current token for client: ', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!isFirebaseConfigured || !messaging) {
      console.log('Firebase not configured, skipping message listener');
      resolve(null);
      return;
    }

    onMessage(messaging, (payload) => {
      console.log("Foreground message received: ", payload);
      resolve(payload);
    });
  });
