// src/lib/sentry.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  // Adjust this value in production as needed
  tracesSampleRate: 1.0,
});

export default Sentry;
