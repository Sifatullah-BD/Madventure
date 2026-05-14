import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Log a payment transaction to the `payment_transactions` table.
 * @param {Object} payload - Transaction details.
 *   { bookingId, userId, amount, gateway = 'sslcommerz', tranId, valId, status, response }
 */
export const logPaymentTransaction = async ({
  bookingId,
  userId,
  amount,
  gateway = 'sslcommerz',
  tranId = null,
  valId = null,
  status,
  response = {},
}) => {
  if (!isSupabaseConfigured) {
    // Mock: just resolve with the payload for local dev
+    return { data: { id: `txn_${Date.now()}` }, error: null };
+  }
+
+  const { data, error } = await supabase
+    .from('payment_transactions')
+    .insert([
+      {
+        booking_id: bookingId,
+        user_id: userId,
+        gateway,
+        tran_id: tranId,
+        val_id: valId,
+        amount,
+        payment_status: status,
+        gateway_response: response,
+      },
+    ])
+    .single();
+  return { data, error };
+};
+
+/**
+ * Update the status of a booking (payment_status & overall status).
+ * @param {string} bookingId
+ * @param {Object} updates - { payment_status, status }
+ */
+export const updateBookingStatus = async (bookingId, updates) => {
+  if (!isSupabaseConfigured) {
+    // Mock: return success
+    return { data: null, error: null };
+  }
+  const { data, error } = await supabase
+    .from('bookings')
+    .update(updates)
+    .eq('id', bookingId)
+    .single();
+  return { data, error };
+};
