/**
 * authService.js – Supabase authentication wrapper
 * Handles login, logout, registration, profile sync.
 */
import { supabase } from '../lib/supabase';

export const authService = {
  /**
   * Sign up with email/password and create a profile row.
   */
  async signUp({ email, password, fullName, requestedRole = 'traveler' }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, app_role: 'traveler', requested_role: requestedRole },
      },
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign in with email/password.
   */
  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  /**
   * Sign in with Google OAuth.
   */
  async signInWithGoogle(redirectTo = window.location.origin) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign out the current user.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get the current session.
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Get the current user's profile from the profiles table.
   */
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  /**
   * Update the current user's profile.
   */
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Update user's app role (admin only via service role in production).
   */
  async updateRole(userId, newRole) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ app_role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /**
   * Listen to auth state changes.
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
