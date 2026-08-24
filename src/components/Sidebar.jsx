import React, { useState, useEffect } from 'react';
import { 
    Home, Compass, Shield, Users, Ticket, Calendar, Briefcase, 
    Wallet, Mountain, ShoppingBag, AlertTriangle, Settings, 
    HelpCircle, LogOut, ChevronLeft, ChevronRight, Zap
} from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { hasAdminAccess, hasAgencyPortalAccess } from '../utils/appRole';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ user }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { logout } = useAuth();
    
    // State for collapse/expand
    const [isExpanded, setIsExpanded] = useState(() => {
        const saved = localStorage.getItem('madventure_sidebar_expanded');
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('madventure_sidebar_expanded', JSON.stringify(isExpanded));
    }, [isExpanded]);

    const menuItems = [
        { path: user ? '/dashboard' : '/', label: language === 'bn' ? 'হোম' : 'Dashboard', icon: Home },
        { path: '/adventures', label: language === 'bn' ? 'অ্যাডভেঞ্চার হাব' : 'Adventures', icon: Mountain },
        { path: '/tours', label: language === 'bn' ? 'ট্যুর ইভেন্টস' : 'Tour Events', icon: Calendar },
        { path: '/tickets', label: language === 'bn' ? 'টিকিট' : 'Tickets', icon: Ticket },
        { path: '/planner', label: language === 'bn' ? 'প্ল্যানার' : 'Planner', icon: Compass },
        { path: '/community', label: language === 'bn' ? 'কমিউনিটি' : 'Community', icon: Users },
        { path: '/bookings', label: language === 'bn' ? 'বুকিং ও ওয়ালেট' : 'Wallet & Bookings', icon: Wallet, private: true },
        { path: '/shop', label: language === 'bn' ? 'শপ' : 'Shop', icon: ShoppingBag },
    ];

    const accountItems = [
        { path: '/profile', label: language === 'bn' ? 'প্রোফাইল' : 'Profile', icon: Users },
        { path: '/settings', label: language === 'bn' ? 'সেটিংস' : 'Settings', icon: Settings },
        { path: '/safety', label: language === 'bn' ? 'সাপোর্ট' : 'Help & Support', icon: HelpCircle },
        { path: '/admin', label: language === 'bn' ? 'কন্ট্রোল প্যানেল' : 'Admin Panel', icon: AlertTriangle, adminOnly: true },
        { path: '/agency/dashboard', label: language === 'bn' ? 'এজেন্সি ড্যাশবোর্ড' : 'Agency Dashboard', icon: Briefcase, agencyOnly: true },
    ];

    const filterItems = (items) => {
        return items.filter(item => {
            if (item.adminOnly) return hasAdminAccess(user);
            if (item.agencyOnly) return hasAgencyPortalAccess(user);
            if (item.private) return !!user;
            return true;
        });
    };

    const handleLogout = async () => {
        if (logout) {
            await logout();
            navigate('/');
        }
    };

    const renderNavLinks = (items) => (
        <div className="space-y-1.5">
            {filterItems(items).map((item) => {
                const Icon = item.icon;
                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        title={!isExpanded ? item.label : ''}
                        className={({ isActive }) =>
                            `flex items-center ${isExpanded ? 'px-4 gap-3' : 'px-0 justify-center'} py-3 rounded-2xl text-[13.5px] font-bold transition-all ${
                                isActive
                                    ? 'bg-[#f4f7f4] dark:bg-slate-800 text-primary shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                            }`
                        }
                    >
                        <Icon size={20} strokeWidth={2.5} />
                        {isExpanded && <span>{item.label}</span>}
                    </NavLink>
                );
            })}
        </div>
    );

    return (
        <aside 
            className={`${isExpanded ? 'w-64' : 'w-20'} bg-white dark:bg-[#050f08] border-r border-gray-100 dark:border-slate-800 flex flex-col h-full shrink-0 transition-all duration-300 relative z-20`}
        >
            {/* Toggle Button */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -right-3.5 top-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full p-1.5 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors z-30"
            >
                {isExpanded ? <ChevronLeft size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
            </button>

            <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-4 flex flex-col gap-6">
                
                {/* Menu Section */}
                <div>
                    {isExpanded && <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3 px-2">Menu</p>}
                    {renderNavLinks(menuItems)}
                </div>

                {/* Account Section */}
                <div>
                    {isExpanded && <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3 px-2">Account</p>}
                    {renderNavLinks(accountItems)}
                    
                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        title={!isExpanded ? 'Log out' : ''}
                        className={`w-full flex items-center ${isExpanded ? 'px-4 gap-3' : 'px-0 justify-center'} py-3 mt-1.5 rounded-2xl text-[13.5px] font-bold text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all`}
                    >
                        <LogOut size={20} strokeWidth={2.5} />
                        {isExpanded && <span>{language === 'bn' ? 'লগ আউট' : 'Log out'}</span>}
                    </button>
                </div>

                {/* Spacer */}
                <div className="flex-1"></div>

                {/* Bottom Promo Card */}
                <div className={`mt-4 rounded-3xl transition-all duration-300 overflow-hidden relative group
                    ${isExpanded ? 'bg-gradient-to-br from-blue-400 to-blue-700 p-5 shadow-lg shadow-blue-500/20' : 'bg-gradient-to-br from-blue-400 to-blue-700 p-3 flex justify-center items-center rounded-2xl mx-1 shadow-md shadow-blue-500/20'}`}
                >
                    {isExpanded ? (
                        <>
                            <div className="flex items-center gap-2 mb-3 relative z-10">
                                <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
                                    <Zap size={14} className="text-white fill-white" />
                                </div>
                                <div className="text-white">
                                    <p className="text-[10px] uppercase font-bold text-blue-100">Current Plan :</p>
                                    <p className="text-sm font-black tracking-tight">Madventure Pro</p>
                                </div>
                            </div>
                            <p className="text-xs font-medium text-blue-50 mb-4 leading-relaxed relative z-10">
                                Upgrade to unlock AI Travel Guide and exclusive discounts.
                            </p>
                            <button className="w-full bg-white text-blue-700 py-2.5 rounded-xl text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-sm relative z-10">
                                Upgrade ৳500
                            </button>
                            
                            {/* Decorative background blobs */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/10 rounded-full blur-xl transform -translate-x-1/2 translate-y-1/2"></div>
                        </>
                    ) : (
                        <div className="relative z-10" title="Upgrade Plan">
                            <Zap size={20} className="text-white fill-white drop-shadow-md" />
                        </div>
                    )}
                </div>

            </div>
        </aside>
    );
};

export default Sidebar;
