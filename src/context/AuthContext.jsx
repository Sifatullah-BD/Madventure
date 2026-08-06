import React, { createContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { displayRoleFromAppRole } from '../utils/appRole';
import useAuthStore from '../store/useAuthStore';

export const AuthContext = createContext();

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
    const [user, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);
    const { setUser: setStoreUser } = useAuthStore();

    // Keep Zustand store in sync when user state changes
    const setUser = (u) => {
        setUserState(u);
        setStoreUser(u);
    };

    useEffect(() => {
        if (!isSupabaseConfigured) {
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
            return;
        }

        // Real Supabase Auth
        const applySession = async (session) => {
            if (!session?.user) {
                setUser(null);
                return;
            }
            const profile = await fetchProfileRow(session.user.id);
            setUser(shapeSupabaseSessionUser(session.user, profile));
        };

        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            await applySession(session);
            setLoading(false);
        };

        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                await applySession(session);
                setLoading(false);
            }
        );

        return () => {
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
            {!loading && children}
        </AuthContext.Provider>
    );
};
