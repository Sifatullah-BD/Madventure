import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const FloatingBackButton = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Only show if user is logged in AND not on the dashboard (or home)
    // Adjust logic as needed. If dashboard is the "home" for logged in users, hide it there.
    if (!user || location.pathname === '/dashboard' || location.pathname === '/') {
        return null;
    }

    return (
        <button
            onClick={() => navigate(-1)}
            className="fixed top-20 left-4 z-30 bg-white/80 backdrop-blur-md border border-gray-200 text-gray-700 p-2 rounded-full shadow-lg hover:bg-white hover:shadow-xl hover:scale-110 transition-all duration-300 group"
            title="Go Back"
        >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        </button>
    );
};

export default FloatingBackButton;
