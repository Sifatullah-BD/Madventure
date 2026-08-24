import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const { user, setUser, loading, isSupabaseConfigured } = context;

    // Login Function
    const login = async (email, password) => {
        try {
            const data = await authService.signIn({ email, password });
            return { user: data?.user, error: null };
        } catch (error) {
            return { user: null, error };
        }
    };

    // Register Function
    const register = async (email, password, userData) => {
        try {
            const data = await authService.signUp({ 
                email, 
                password, 
                fullName: userData.name,
                requestedRole: userData.accountType || 'traveler'
            });

            // Update profiles table if necessary
            if (data?.user) {
                await authService.updateProfile(data.user.id, {
                    phone: userData.phone,
                    // other fields could be added if supported by schema
                });
            }
            return { user: data?.user, error: null };
        } catch (error) {
            return { user: null, error };
        }
    };

    // Logout Function
    const logout = async () => {
        try {
            if (isSupabaseConfigured) {
                await authService.signOut();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('madventure_user');
            setUser(null);
        }
    };

    // Google Sign In Function
    const signInWithGoogle = async () => {
        try {
            const data = await authService.signInWithGoogle();
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    return {
        user,
        setUser,
        loading,
        login,
        register,
        logout,
        signInWithGoogle,
        isSupabaseConfigured
    };
};
