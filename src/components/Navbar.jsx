import React, { useState } from 'react';
import { Menu, X, User, AlertTriangle, Moon, Sun, Sidebar as SidebarIcon, LogIn, LogOut, ShieldAlert, ShieldCheck, Search, Compass, CalendarDays, GraduationCap, Tent, ShoppingBag, Bell, Settings, User as UserIcon, LayoutDashboard, Users, Ticket, ChevronDown } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SafetyModal from './SafetyModal';
import { useNotifications } from '../context/NotificationContext';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = ({ isHomePage }) => {
    const { language, toggleLanguage } = useLanguage();
    return (
        <button 
            onClick={toggleLanguage}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all border
                ${isHomePage ? 'border-white/30 hover:bg-white/10 text-white' : 'border-gray-200 hover:bg-gray-100 text-gray-700'}`}
        >
            {language === 'en' ? 'বাংলা' : 'EN'}
        </button>
    );
};

const Navbar = ({ user, onOpenLogin, onLogout, isSidebarOpen, setIsSidebarOpen, theme, setTheme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showSafety, setShowSafety] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false); // FIXED: Added missing state
    const [showServicesMenu, setShowServicesMenu] = useState(false);
    
    const { notifications, unreadCount, markAllRead } = useNotifications();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const { language } = useLanguage();

    const isHomePage = location.pathname === '/';

    // Navbar style based on route
    const navClasses = isHomePage
        ? "bg-[#1B5E20] text-white shadow-lg sticky top-0 z-40 w-full transition-colors duration-300"
        : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-gray-800 dark:text-gray-100 shadow-sm sticky top-0 z-40 border-b border-gray-100 dark:border-slate-800 w-full transition-colors duration-300";

    const iconLinkClasses = isHomePage
        ? "text-primary dark:text-white hover:text-white p-2.5 rounded-full hover:bg-primary/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] relative group cursor-pointer flex items-center justify-center font-bold"
        : "text-primary dark:text-white p-2.5 rounded-full hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_4px_10px_rgba(34,197,94,0.2)] relative group cursor-pointer flex items-center justify-center font-bold";

    const handleNavigation = (path) => {
        navigate(path);
        setIsOpen(false);
        if (path === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <>
            <nav className={navClasses}>
                <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left: Logo & Safety Center */}
                        <div className="flex-shrink-0 flex items-center gap-4">
                            <Link
                                to={user ? "/dashboard" : "/"}
                                className={`font-heading font-bold text-2xl tracking-wider ${!isHomePage ? 'text-primary' : ''}`}
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            >
                                <img
                                    src="/madventure-logo-v2.png"
                                    alt="Madventure"
                                    className={`h-12 w-auto transition-all duration-300 ${!isHomePage ? 'drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]' : ''}`}
                                />
                            </Link>

                            <button
                                className={`p-2 rounded-full transition-colors relative group hidden md:block ${isHomePage
                                    ? 'text-yellow-300 hover:bg-white/10'
                                    : 'text-orange-500 hover:bg-orange-50'}`}
                                title={t('nav_safety')}
                                onClick={() => setShowSafety(true)}
                            >
                                <ShieldCheck size={24} className="cursor-pointer" />
                                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    {t('nav_safety')}
                                </span>
                            </button>
                        </div>

                        {/* Center: Navigation Links */}
                        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 h-full justify-center w-auto">
                            <div className="flex items-center space-x-6 h-full">
                                <Link to="/destinations" className={iconLinkClasses}>
                                    <Compass size={22} strokeWidth={2.5} />
                                    <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 border border-primary/20 dark:border-transparent text-primary dark:text-white font-bold text-[10px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                                        {t('nav_destinations')}
                                    </span>
                                </Link>

                                {/* Services Dropdown */}
                                <div className="relative h-full flex items-center">
                                    <button
                                        onClick={() => setShowServicesMenu(!showServicesMenu)}
                                        onMouseEnter={() => setShowServicesMenu(true)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full font-bold transition-all text-sm cursor-pointer
                                            ${showServicesMenu 
                                                ? 'bg-primary text-white shadow-lg' 
                                                : isHomePage ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200'}`}
                                    >
                                        <span>{language === 'bn' ? 'টুলস ও ট্যুর' : 'Services & Tours'}</span>
                                        <ChevronDown size={16} className={`transition-transform duration-200 ${showServicesMenu ? 'rotate-180' : ''}`} />
                                    </button>

                                    {showServicesMenu && (
                                        <div 
                                            onMouseLeave={() => setShowServicesMenu(false)}
                                            className="absolute top-14 left-1/2 transform -translate-x-1/2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-3 duration-200"
                                        >
                                            {/* Small Search Bar inside dropdown */}
                                            <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800 mb-2">
                                                <div className="relative">
                                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input 
                                                        type="text"
                                                        placeholder={language === 'bn' ? 'ট্যুর বা টিকিট খুঁজুন...' : 'Search tours or tickets...'}
                                                        className="w-full pl-9 pr-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-150 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20 text-gray-900 dark:text-white"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && e.target.value.trim()) {
                                                                navigate(`/explore?q=${encodeURIComponent(e.target.value.trim())}`);
                                                                setShowServicesMenu(false);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1 px-2">
                                                <Link 
                                                    to="/student-tours" 
                                                    onClick={() => setShowServicesMenu(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/30 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-green-400 transition-colors font-bold text-sm"
                                                >
                                                    <GraduationCap size={18} className="text-primary dark:text-green-400" />
                                                    <div className="flex flex-col">
                                                        <span>{language === 'bn' ? 'স্টুডেন্ট ব্যাকপ্যাক ট্যুর' : 'Student Backpack Tours'}</span>
                                                        <span className="text-[10px] text-gray-450 dark:text-gray-400 font-medium">{language === 'bn' ? 'বাজেট ফ্রেন্ডলি গ্রুপ ট্যুর' : 'Budget group travels'}</span>
                                                    </div>
                                                </Link>

                                                <Link 
                                                    to="/planner" 
                                                    onClick={() => setShowServicesMenu(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/30 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-green-400 transition-colors font-bold text-sm"
                                                >
                                                    <CalendarDays size={18} className="text-primary dark:text-green-400" />
                                                    <div className="flex flex-col">
                                                        <span>{language === 'bn' ? 'স্মার্ট ট্রিপ প্ল্যানার' : 'Smart Trip Planner'}</span>
                                                        <span className="text-[10px] text-gray-455 dark:text-gray-400 font-medium">{language === 'bn' ? 'এআই সহায়তায় ভ্রমণ পরিকল্পনা' : 'AI-assisted routing & budgets'}</span>
                                                    </div>
                                                </Link>

                                                <Link 
                                                    to="/tickets" 
                                                    onClick={() => setShowServicesMenu(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/30 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-green-400 transition-colors font-bold text-sm"
                                                >
                                                    <Ticket size={18} className="text-primary dark:text-green-400" />
                                                    <div className="flex flex-col">
                                                        <span>{language === 'bn' ? 'টিকিট ও ট্রান্সপোর্ট' : 'Tickets & Transport'}</span>
                                                        <span className="text-[10px] text-gray-455 dark:text-gray-400 font-medium">{language === 'bn' ? 'বাস, ট্রেন, লঞ্চ ও বিমান' : 'Bus, Train, Flight & Launch'}</span>
                                                    </div>
                                                </Link>

                                                <Link 
                                                    to="/adventures" 
                                                    onClick={() => setShowServicesMenu(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/30 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-green-400 transition-colors font-bold text-sm"
                                                >
                                                    <Tent size={18} className="text-primary dark:text-green-400" />
                                                    <div className="flex flex-col">
                                                        <span>{language === 'bn' ? 'গ্রুপ অ্যাডভেঞ্চার' : 'Group Adventures'}</span>
                                                        <span className="text-[10px] text-gray-455 dark:text-gray-400 font-medium">{language === 'bn' ? 'রোমাঞ্চকর ট্রেকিং ও ক্যাম্পিং' : 'Thrilling camping & trekking'}</span>
                                                    </div>
                                                </Link>

                                                <Link 
                                                    to="/bookings" 
                                                    onClick={() => setShowServicesMenu(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/30 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-green-400 transition-colors font-bold text-sm"
                                                >
                                                    <LayoutDashboard size={18} className="text-primary dark:text-green-400" />
                                                    <div className="flex flex-col">
                                                        <span>{language === 'bn' ? 'বুকিং ও লেনদেনের ইতিহাস' : 'Booking & Transactions'}</span>
                                                        <span className="text-[10px] text-gray-455 dark:text-gray-400 font-medium">{language === 'bn' ? 'আপনার সকল ট্রিপ হিস্টোরি' : 'View all your trip tickets'}</span>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Link to="/community" className={iconLinkClasses}>
                                    <Users size={22} strokeWidth={2.5} />
                                    <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 border border-primary/20 dark:border-transparent text-primary dark:text-white font-bold text-[10px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                                        {t('nav_community')}
                                    </span>
                                </Link>
                                <Link to="/shop" className={iconLinkClasses}>
                                    <ShoppingBag size={22} strokeWidth={2.5} />
                                    <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 border border-primary/20 dark:border-transparent text-primary dark:text-white font-bold text-[10px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                                        {t('nav_shop')}
                                    </span>
                                </Link>
                            </div>
                        </div>

                        {/* Right: Notifications, Search, Theme, Profile */}
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6 gap-3">
                                <div className="relative">
                                    <button 
                                        onClick={() => { setIsNotifOpen(!isNotifOpen); if(!isNotifOpen) markAllRead(); }}
                                        className={`p-2 rounded-full relative transition-colors ${isHomePage ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                                    >
                                        <Bell size={22} />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {isNotifOpen && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 py-4 z-50">
                                            <div className="px-4 mb-3 flex justify-between items-center">
                                                <h4 className="font-bold text-gray-900 dark:text-white">Notifications</h4>
                                            </div>
                                            <div className="max-h-72 overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <div className="px-4 py-8 text-center text-gray-400 text-sm">No new alerts found</div>
                                                ) : (
                                                    notifications.map(n => (
                                                        <div key={n.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 border-b border-gray-50 dark:border-slate-700 last:border-0 transition-colors">
                                                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{n.title}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.body}</p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <LanguageSwitcher isHomePage={isHomePage} />

                                <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'w-64' : 'w-10'}`}>
                                    {isSearchOpen && (
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            className={`w-full pl-10 pr-4 py-2 rounded-full border focus:outline-none ${isHomePage ? 'bg-white/90 border-primary' : 'bg-gray-100 dark:bg-slate-800 border-gray-200'}`}
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && e.target.value.trim()) {
                                                    navigate(`/explore?q=${encodeURIComponent(e.target.value.trim())}`);
                                                    setIsSearchOpen(false);
                                                }
                                            }}
                                            onBlur={(e) => { if (!e.target.value) setIsSearchOpen(false); }}
                                        />
                                    )}
                                    <button
                                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                                        className={`absolute left-0 p-2 rounded-full transition-colors ${isHomePage ? 'hover:bg-primary/20' : 'hover:bg-gray-100'}`}
                                    >
                                        <Search size={20} />
                                    </button>
                                </div>
                                
                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className={`relative hidden md:inline-flex h-8 w-14 items-center justify-center rounded-full border-2 border-transparent transition-colors ${isHomePage ? 'bg-white/20' : theme === 'dark' ? 'bg-primary' : 'bg-gray-300'}`}
                                >
                                    <span className={`h-6 w-6 transform rounded-full bg-white transition duration-200 flex items-center justify-center ${theme === 'dark' ? 'translate-x-3' : '-translate-x-3'}`}>
                                        {theme === 'dark' ? <Moon size={14} className="text-green-600" /> : <Sun size={14} className="text-amber-500" />}
                                    </span>
                                </button>

                                {user ? (
                                    <div className="relative">
                                        <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center focus:outline-none">
                                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold border-2 border-transparent hover:border-white transition-all shadow-md">
                                                {user.avatar ? <img src={user.avatar} alt="User" className="w-full h-full rounded-full" /> : (user?.name?.charAt(0) || 'U')}
                                            </div>
                                        </button>
                                        {showProfileMenu && (
                                            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl py-2 z-50 border border-gray-100 dark:border-slate-700">
                                                <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700" onClick={() => setShowProfileMenu(false)}>My Profile</Link>
                                                <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button onClick={onOpenLogin} className="px-3 py-1 rounded-lg bg-white/10 border border-white/30 text-primary hover:bg-white/20 transition-colors flex items-center gap-2">
                                        <LogIn size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="-mr-2 flex md:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-gray-800">
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <SafetyModal isOpen={showSafety} onClose={() => setShowSafety(false)} />
        </>
    );
};

export default Navbar;