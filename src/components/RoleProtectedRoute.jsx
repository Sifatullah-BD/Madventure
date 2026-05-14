import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { normalizeAppRole } from '../utils/appRole';

/**
 * @param {React.ReactNode} children
 * @param {string[]} allowedRoles — lowercase canonical roles (e.g. 'admin', 'agency')
 * @param {boolean} [requireAll=false] — if true, user must have every role (unused for now)
 */
const RoleProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/dashboard' }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" state={{ from: location, showLogin: true }} replace />;
    }

    const role = normalizeAppRole(user);
    const ok = allowedRoles.length === 0 || allowedRoles.includes(role);

    if (!ok) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default RoleProtectedRoute;
