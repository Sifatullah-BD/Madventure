import React from 'react';
import { Home, Ticket, Calendar, Mountain, ShoppingBag, Compass, Users, Wallet, Shield, Briefcase, Map, FileText, LifeBuoy, Star, Image, Gem } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { hasAgencyPortalAccess } from '../../utils/appRole';

const DashboardMenu = ({ user, onClose }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', label: 'Home', icon: Home },
        { path: '/destinations', label: 'Destinations', icon: Map },
        { path: '/tickets', label: 'Tickets', icon: Ticket },
        { path: '/tours', label: 'Tours', icon: Calendar },
        { path: '/adventures', label: 'Adventures', icon: Mountain },
        { path: '/shop', label: 'Shop', icon: ShoppingBag },
        { path: '/planner', label: 'Planner', icon: Compass },
        { path: '/community', label: 'Community', icon: Users }, // Keeping Users for Community as base, but user asked for "Travel Buddies" specifically? No, "Travel Buddies" is likely a new item or rename. I will add the specific requested items.
        { path: '/bookings', label: 'Bookings', icon: Wallet },
        { path: '/safety', label: 'Safety', icon: Shield },
        // New Items requested
        { path: '/posts', label: 'All Posts', icon: FileText },
        { path: '/help', label: 'Help Needed', icon: LifeBuoy },
        { path: '/reviews', label: 'Reviews', icon: Star },
        { path: '/buddies', label: 'Travel Buddies', icon: Users },
        { path: '/photos', label: 'Photos', icon: Image },
        { path: '/gems', label: 'Hidden Gems', icon: Gem },
        { path: '/agency/dashboard', label: 'Agency', icon: Briefcase, agencyOnly: true },
    ];

    const filteredNavItems = navItems.filter(item => {
        if (item.agencyOnly) {
            return hasAgencyPortalAccess(user);
        }
        return true;
    });

    return (
        <div
            className="absolute top-16 left-0 w-full bg-white shadow-lg border-t border-gray-100 py-4 animate-in slide-in-from-top-2 z-30 max-h-[80vh] overflow-y-auto custom-scrollbar"
            onMouseLeave={onClose}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredNavItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-green-50 group ${isActive(item.path) ? 'bg-green-50 text-primary ring-1 ring-primary/20' : 'text-gray-600'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${isActive(item.path) ? 'bg-white text-primary shadow-sm' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-primary group-hover:shadow-sm transition-colors'}`}>
                                <item.icon size={20} strokeWidth={1.5} />
                            </div>
                            <span className={`font-medium text-sm ${isActive(item.path) ? 'font-bold' : ''}`}>{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardMenu;
