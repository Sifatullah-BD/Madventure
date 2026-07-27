/**
 * analyticsService.js – Client-side analytics event tracking
 * Writes to public.analytics_events via Supabase.
 * All events are anonymous-safe (RLS allows insert from any authenticated or anon user).
 */
import { supabase } from '../lib/supabase';

/**
 * Track a UI or user event.
 * @param {string} eventName – e.g., 'page_view', 'tour_click', 'booking_started'
 * @param {Object} eventData – optional structured payload
 */
export async function trackEvent(eventName, eventData = {}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('analytics_events').insert({
      user_id: user?.id ?? null,
      event_name: eventName,
      event_data: eventData,
      page_url: window.location.pathname,
      user_agent: navigator.userAgent,
    });
  } catch {
    // Never throw – analytics must not break the user experience
  }
}

/**
 * Common event helpers
 */
export const analytics = {
  pageView: (page) => trackEvent('page_view', { page }),
  tourClick: (tourId, title) => trackEvent('tour_click', { tourId, title }),
  searchQuery: (query) => trackEvent('search', { query }),
  bookingStarted: (tourId) => trackEvent('booking_started', { tourId }),
  bookingCompleted: (bookingId) => trackEvent('booking_completed', { bookingId }),
  paymentInitiated: (bookingId, amount) => trackEvent('payment_initiated', { bookingId, amount }),
  loginSuccess: (method) => trackEvent('login_success', { method }),
  shareClicked: (contentType, contentId) => trackEvent('share_clicked', { contentType, contentId }),
};
