// src/lib/initServices.js

import { supabase, isSupabaseConfigured } from "./supabase";
import { messaging, requestForToken, onMessageListener } from "./firebase";

/**
 * Centralized export of backend services used throughout the app.
 *
 * - `supabase` – ready‑to‑use Supabase client.
 * - `isSupabaseConfigured` – boolean indicating whether real credentials are present.
 * - `firebaseMessaging` – utilities for Firebase Cloud Messaging.
 */
export const services = {
  supabase,
  isSupabaseConfigured,
  firebaseMessaging: {
    messaging,
    requestForToken,
    onMessageListener,
  },
};
