import { Home, Compass, Shield, Users, Ticket, Calendar, Briefcase, Wallet, Mountain, ShoppingBag, AlertTriangle } from 'lucide-react';
import NotificationBell from './common/NotificationBell';
import { NavLink, useLocation } from 'react-router-dom';
import { hasAdminAccess, hasAgencyPortalAccess } from '../utils/appRole';

import { useLanguage } from '../context/LanguageContext';

const Sidebar = ({ user }) => {
    const location = useLocation();
    const { language } = useLanguage();

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
        { path: '/admin', label: language === 'bn' ? 'কন্ট্রোল প্যানেল' : 'Control Panel', icon: AlertTriangle, adminOnly: true },
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
        <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col justify-between py-6 px-4 shrink-0 transition-colors">
            <div className="space-y-6">
                <div className="px-3 flex items-center justify-between">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Navigation</span>
                    <NotificationBell />
                </div>

                <nav className="space-y-1">
                    {filteredNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                                        isActive
                                            ? 'bg-[#1B5E20] text-white shadow-md shadow-green-900/20'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                    }`
                                }
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
