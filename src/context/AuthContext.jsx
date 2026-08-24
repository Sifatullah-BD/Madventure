import React, { createContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { displayRoleFromAppRole } from '../utils/appRole';
import useAuthStore from '../store/useAuthStore';

export const AuthContext = createContext();
const demoAuthEnabled = import.meta.env.DEV && import.meta.env.VITE_DEMO_AUTH === 'true';

function getDemoUser() {
    const role = String(localStorage.getItem('madventure_demo_role') || 'traveler').toLowerCase();
    const names = { traveler: 'Demo Traveler', agency: 'Demo Agency', hotel_owner: 'Demo Hotel', admin: 'Demo Admin' };
    return {
        id: `00000000-0000-4000-8000-${role === 'admin' ? '000000000001' : role === 'agency' ? '000000000002' : role === 'hotel_owner' ? '000000000003' : '000000000004'}`,
        email: `${role}@demo.madventure.local`,
        name: names[role] || 'Demo Traveler',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(names[role] || 'Demo Traveler')}&background=1B5E20&color=fff`,
        app_role: role,
        role: displayRoleFromAppRole(role),
        status: 'active',
        user_metadata: { app_role: role },
    };
}

async function fetchProfileRow(userId) {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('role, full_name, status, avatar_url')
        .eq('id', userId)
        .maybeSingle();
    if (error && error.code !== 'PGRST116') {
        console.warn('[auth] user_profiles lookup failed', error.message);
    }
    return data;
}

function shapeSupabaseSessionUser(authUser, profile) {
    const meta = authUser.user_metadata || {};
    const app_role = profile?.role || meta.app_role || 'traveler';
    const name = profile?.full_name || meta.full_name || authUser.email?.split('@')[0] || 'Traveler';
    const avatar = profile?.avatar_url || meta.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1B5E20&color=fff`;
    const status = profile?.status || 'active';
    
    return {
        id: authUser.id,
        email: authUser.email,
        name,
        avatar,
        app_role,
        status,
        role: displayRoleFromAppRole(app_role),
        user_metadata: authUser.user_metadata,
    };
}

export const AuthProvider = ({ children }) => {
    const [user, setUserState] = useState(() => demoAuthEnabled ? getDemoUser() : null);
    const [loading, setLoading] = useState(!demoAuthEnabled);
    const { setUser: setStoreUser } = useAuthStore();

    // Keep Zustand store in sync when user state changes
    const setUser = (u) => {
        setUserState(u);
        setStoreUser(u);
    };

    useEffect(() => {
        let cancelled = false;

        if (!isSupabaseConfigured || demoAuthEnabled) {
            if (demoAuthEnabled) {
                return () => { cancelled = true; };
            }
            // Mock authentication fallback if keys aren't added yet
            const mockUserStr = localStorage.getItem('madventure_user');
            if (mockUserStr) {
                try {
                    const parsed = JSON.parse(mockUserStr);
                    if (parsed && !parsed.app_role && parsed.role) {
                        parsed.app_role = String(parsed.role).toLowerCase();
                    }
                    setUser(parsed);
                } catch (e) {
                    // Ignore
                }
            }
            setLoading(false);
            return () => { cancelled = true; };
        }

        // Real Supabase Auth
        const applySession = async (session) => {
            if (cancelled) return;
            if (!session?.user) {
                setUser(null);
                return;
            }
            const profile = await fetchProfileRow(session.user.id);
            if (!cancelled) setUser(shapeSupabaseSessionUser(session.user, profile));
        };

        const getSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                await applySession(session);
            } catch (e) {
                // Never let an auth failure leave the app stuck on the blank screen
                console.error('[auth] getSession failed:', e);
                if (!cancelled) setUser(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                try {
                    await applySession(session);
                } catch (e) {
                    console.error('[auth] auth state change failed:', e);
                } finally {
                    if (!cancelled) setLoading(false);
                }
            }
        );

        return () => {
            cancelled = true;
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe();
            }
        };
    }, []);

    const value = {
        user,
        setUser, // For mock bypass
        loading,
        isSupabaseConfigured
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary/20 border-t-primary"></div>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 animate-pulse">
                            Loading Madventure...
                        </p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
