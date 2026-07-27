/**
 * useAuthStore.js – Centralized auth state using Zustand
 * Wraps AuthContext as a bridge until full migration.
 * Provides user, role helpers, and session management utilities.
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

const useAuthStore = create(
    devtools(
        (set, get) => ({
            user: null,
            loading: true,
            isAuthenticated: false,

            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                loading: false,
            }),

            setLoading: (loading) => set({ loading }),

            // Role helpers
            isAdmin: () => {
                const role = get().user?.app_role;
                return role === 'admin' || role === 'super_admin';
            },

            isAgency: () => get().user?.app_role === 'agency',

            isHotelOwner: () => get().user?.app_role === 'hotel_owner',

            hasRole: (role) => {
                const userRole = get().user?.app_role;
                if (!userRole) return false;
                if (Array.isArray(role)) return role.includes(userRole);
                return userRole === role;
            },

            // Sign out
            signOut: async () => {
                await supabase.auth.signOut();
                set({ user: null, isAuthenticated: false });
            },

            // Update user profile fields optimistically
            updateProfile: (updates) => set(state => ({
                user: state.user ? { ...state.user, ...updates } : null,
            })),
        }),
        { name: 'AuthStore' }
    )
);

export default useAuthStore;
