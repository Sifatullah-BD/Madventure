import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const { user, setUser, loading, isSupabaseConfigured } = context;

    // Login Function
    const login = async (email, password) => {
        if (!isSupabaseConfigured) {
            // Mock login behavior
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const matchedUser = {
                        id: 'usr_1',
                        name: 'Demo User',
                        email,
                        role: 'Traveler',
                        avatar: `https://ui-avatars.com/api/?name=Demo+User&background=1B5E20&color=fff`
                    };
                    localStorage.setItem('madventure_user', JSON.stringify(matchedUser));
                    setUser(matchedUser);
                    resolve({ user: matchedUser, error: null });
                }, 800);
            });
        }

        // Real Supabase Auth Login
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        return { user: data?.user, error };
    };

    // Register Function
    const register = async (email, password, userData) => {
        if (!isSupabaseConfigured) {
            // Mock register behavior
            return new Promise((resolve) => {
                setTimeout(() => {
                    const newUser = {
                        id: `usr_${Date.now()}`,
                        name: userData.name || 'Demo User',
                        email,
                        role: 'Traveler'
                    };
                    localStorage.setItem('madventure_user', JSON.stringify(newUser));
                    setUser(newUser);
                    resolve({ user: newUser, error: null });
                }, 800);
            });
        }

        // Real Supabase Auth Signup
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: userData.name,
                    phone: userData.phone,
                    gender: userData.gender,
                    styles: userData.styles,
                    role: 'Traveler'
                }
            }
        });

        // Update profiles table if trigger didn't handle everything or to ensure data is saved
        if (data?.user) {
            await supabase.from('profiles').update({
                phone: userData.phone,
                // We can add more fields here if the profiles table has them
            }).eq('id', data.user.id);
        }

        return { user: data?.user, error };
    };

    // Logout Function
    const logout = async () => {
        if (!isSupabaseConfigured) {
            localStorage.removeItem('madventure_user');
            setUser(null);
            return;
        }

        await supabase.auth.signOut();
    };

    // Google Sign In Function
    const signInWithGoogle = async () => {
        if (!isSupabaseConfigured) {
            alert('Supabase is not configured for Google Auth.');
            return { error: new Error('Supabase not configured') };
        }

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.href
            }
        });
        return { data, error };
    };

    return {
        user,
        loading,
        login,
        register,
        logout,
        signInWithGoogle,
        isSupabaseConfigured
    };
};
