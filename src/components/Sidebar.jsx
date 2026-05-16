import { Home, Map, Compass, Shield, LayoutDashboard, Users, Ticket, Calendar, Briefcase, Wallet, Mountain, Settings, ShoppingBag, ShieldAlert } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { hasAdminAccess, hasAgencyPortalAccess } from '../utils/appRole';

import { useLanguage } from '../context/LanguageContext';

const Sidebar = ({ user }) => {
    const location = useLocation();
    const { language } = useLanguage();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: user ? '/dashboard' : '/', label: language === 'bn' ? 'হোম' : 'Home', icon: Home },
        { path: '/tickets', label: language === 'bn' ? 'টিকিট ও ট্রান্সপোর্ট' : 'Tickets & Transport', icon: Ticket },
        { path: '/tours', label: language === 'bn' ? 'ট্যুর ইভেন্টস' : 'Upcoming Tours / Events', icon: Calendar },
        { path: '/adventures', label: language === 'bn' ? 'অ্যাডভেঞ্চার হাব' : 'Adventure Hub', icon: Mountain },
        { path: '/shop', label: language === 'bn' ? 'শপ ও রেন্টাল' : 'Gear Shop & Rental', icon: ShoppingBag },
        { path: '/planner', label: language === 'bn' ? 'এআই প্ল্যানার' : 'AI Planner', icon: Compass },
        { path: '/community', label: language === 'bn' ? 'কমিউনিটি' : 'Community', icon: Users },
        { path: '/bookings', label: language === 'bn' ? 'বুকিং ও ওয়ালেট' : 'My Bookings / Wallet', icon: Wallet, private: true },
        { path: '/safety', label: language === 'bn' ? 'ইমার্জেন্সি ম্যাপ' : 'Emergency Map', icon: Shield },
        { path: '/admin', label: language === 'bn' ? 'কন্ট্রোল প্যানেল' : 'Control Panel', icon: ShieldAlert, adminOnly: true },
        { path: '/agency/dashboard', label: language === 'bn' ? 'এজেন্সি ড্যাশবোর্ড' : 'Manage Tours / Agency', icon: Briefcase, agencyOnly: true },
    ];

    const filteredNavItems = navItems.filter(item => {
        if (item.adminOnly) {
            return hasAdminAccess(user);
        }
        if (item.agencyOnly) {
            return hasAgencyPortalAccess(user);
        }
        if (item.private) {
            return !!user;
        }
        return true;
    });

    return (
        <div className="hidden md:flex flex-col w-20 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 min-h-screen sticky top-16 items-center py-6 z-20 transition-colors duration-300">
            <nav className="space-y-4">
                {filteredNavItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`relative group flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:-translate-x-0.5 hover:shadow-[0_4px_10px_rgba(34,197,94,0.2)] ${isActive(item.path)
                            ? 'bg-primary text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-950/20 hover:text-primary bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700'
                            }`}
                    >
                        <item.icon size={22} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                        <span className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-slate-700 text-white text-[11px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-xl scale-95 group-hover:scale-100 origin-left z-[60]">
                            {item.label}
                        </span>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
