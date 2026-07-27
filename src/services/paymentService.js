/**
 * paymentService.js – Wraps calls to Supabase Edge Functions for payments
 * The actual payment logic runs server-side (Edge Functions) to keep secrets safe.
 */
import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const FUNCTIONS_BASE = `${SUPABASE_URL}/functions/v1`;

/**
 * Get the current user's Bearer token for Edge Function calls.
 */
async function getAuthHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (!token) throw new Error('Not authenticated – please log in first.');
  return `Bearer ${token}`;
}

export const paymentService = {
  /**
   * Initiate a payment session via the `initiate-payment` Edge Function.
   * Returns the SSLCommerz GatewayPageURL to redirect the user.
   *
   * @param {Object} params
   * @param {string} params.bookingId  – UUID of the booking
   * @param {number} params.amount     – Total amount in BDT
   * @param {string} params.cus_name  – Customer full name
   * @param {string} params.cus_email – Customer email
   * @param {string} params.cus_phone – Customer phone (11-digit BD number)
   */
  async initiatePayment({ bookingId, amount, cus_name, cus_email, cus_phone }) {
    const authHeader = await getAuthHeader();

    const res = await fetch(`${FUNCTIONS_BASE}/initiate-payment`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ bookingId, amount, cus_name, cus_email, cus_phone }),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.error ?? 'Payment initiation failed');
    }
    return json; // { GatewayPageURL: '...' }
  },

  /**
   * Fetch payment transactions for the authenticated user.
   */
  async getMyTransactions() {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  /**
   * Fetch a single transaction by booking ID.
   */
  async getTransactionByBooking(bookingId) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('booking_id', bookingId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  /**
   * Wallet: fetch the current user's wallet balance.
   */
  async getWallet() {
    const { data, error } = await supabase
      .from('wallets')
      .select('*, wallet_ledger(*)')
      .maybeSingle();
    if (error) throw error;
    return data;
  },
};
