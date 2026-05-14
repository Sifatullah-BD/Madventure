import { Home, Map, Compass, Shield, LayoutDashboard, Users, Ticket, Calendar, Briefcase, Wallet, Mountain, Settings, ShoppingBag, ShieldAlert } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { hasAdminAccess, hasAgencyPortalAccess } from '../utils/appRole';

const Sidebar = ({ user }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: user ? '/dashboard' : '/', label: 'Home', icon: Home },
        { path: '/tickets', label: 'Tickets & Transport', icon: Ticket },
        { path: '/tours', label: 'Upcoming Tours / Events', icon: Calendar },
        { path: '/adventures', label: 'Adventure Hub', icon: Mountain },
        { path: '/shop', label: 'Gear Shop & Rental', icon: ShoppingBag },
        { path: '/planner', label: 'AI Planner', icon: Compass },
        { path: '/community', label: 'Community', icon: Users },
        { path: '/bookings', label: 'My Bookings / Wallet', icon: Wallet, private: true },
        { path: '/safety', label: 'Emergency Map', icon: Shield },
        { path: '/admin', label: 'Control Panel', icon: ShieldAlert, adminOnly: true },
        { path: '/agency/dashboard', label: 'Manage Tours / Agency', icon: Briefcase, agencyOnly: true },
    ];

    const filteredNavItems = navItems.filter(item => {
        if (item.adminOnly) {
            return hasAdminAccess(user);
        }
        if (item.agencyOnly) {
            return hasAgencyPortalAccess(user);
        }
        // If item is private (requires login)
        if (item.private) {
            return !!user;
        }
        // Otherwise public
        return true;
    });

    return (
        <div className="hidden md:flex flex-col w-20 bg-white border-r border-gray-200 min-h-screen sticky top-16 items-center py-6 z-20">
            <nav className="space-y-4">
                {filteredNavItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`relative group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:-translate-x-0.5 hover:shadow-[0_4px_10px_rgba(34,197,94,0.2)] ${isActive(item.path)
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 hover:bg-green-50 hover:text-primary bg-white border border-gray-100'
                            }`}
                    >
                        <item.icon size={22} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                        <span className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-[11px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-xl scale-95 group-hover:scale-100 origin-left">
                            {item.label}
                        </span>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
