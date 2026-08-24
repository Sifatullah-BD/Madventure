import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Sun, Moon, Search, Bell, LogIn, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { getMegaMenuData } from '../data/megaMenuData';
import { ChevronDown, ChevronRight } from 'lucide-react';

const LanguageSwitcher = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className={`px-3 py-1.5 rounded-full text-[11px] font-black tracking-wider transition-all duration-300 border bg-white/5 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800`}
        >{language === 'en' ? 'বাংলা' : 'EN'}
        </button>
    );
};

// Mega Menu Dropdown Component
const MegaMenuDropdown = ({ data, activeMenu, setActiveMenu }) => {
    const isActive = activeMenu === data.id;

    return (
        <div 
            className="relative"
            onMouseEnter={() => setActiveMenu(data.id)}
            onMouseLeave={() => setActiveMenu(null)}
        >
            <button aria-label={data.title} title={data.title} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-bold transition-all duration-300
                ${isActive ? 'bg-primary/5 text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-slate-800'}`}
            >
                <data.icon size={16} />
                <span className="sr-only">{data.title}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Content */}
            <div 
                className={`absolute left-1/2 -translate-x-1/2 top-full pt-4 w-max min-w-[500px] transition-all duration-300 transform origin-top z-50
                    ${isActive ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible'}`}
            >
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 p-6 flex gap-8">
                    {data.sections.map((section, idx) => (
                        <div key={idx} className="flex-1 min-w-[160px]">
                            <h4 className="text-[11px] uppercase tracking-wider font-black text-gray-400 dark:text-gray-500 mb-4 pb-2 border-b border-gray-100 dark:border-slate-800">
                                {section.title}
                            </h4>
                            <div className="space-y-1">
                                {section.items.map((item, i) => (
                                    <Link 
                                        key={i} 
                                        to={item.path}
                                        onClick={() => setActiveMenu(null)}
                                        className="flex items-center gap-2 px-3 py-2 -mx-3 rounded-xl text-[13px] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-green-400 transition-colors group"
                                    >
                                        <ChevronRight size={14} className="text-transparent group-hover:text-primary transition-colors" />
                                        <span className="-ml-4 group-hover:ml-0 transition-all">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Mobile Accordion Component
const MobileAccordionItem = ({ data, activeAccordion, setActiveAccordion, setIsOpen }) => {
    const isActive = activeAccordion === data.id;

    return (
        <div className="border-b border-gray-100 dark:border-slate-800 last:border-0">
            <button 
                onClick={() => setActiveAccordion(isActive ? null : data.id)}
                aria-expanded={isActive}
                className="w-full flex items-center justify-between py-3 px-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg"
            >
                <div className="flex items-center gap-3">
                    <data.icon size={18} className={`${isActive ? 'text-primary dark:text-green-400' : 'text-gray-500'}`} />
                    <span className={`font-bold text-sm ${isActive ? 'text-primary dark:text-green-400' : 'text-gray-700 dark:text-gray-200'}`}>
                        {data.title}
                    </span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Accordion Content */}
            <div
                className={`${isActive ? 'block mb-3' : 'hidden'}`}
            >
                <div className="pl-10 pr-2 pt-1 pb-2 space-y-4 border-l border-primary/20 ml-3">
                    {data.sections.map((section, idx) => (
                        <div key={idx}>
                            <h4 className="text-[10px] uppercase tracking-wider font-black text-gray-400 mb-2">{section.title}</h4>
                            <div className="space-y-1">
                                {section.items.map((item, i) => (
                                    <Link
                                        key={i}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className="block py-1.5 text-[13px] font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-green-400"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Navbar = ({ user, onOpenLogin, onLogout, theme, setTheme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [activeAccordion, setActiveAccordion] = useState(null);

    const { notifications, unreadCount, markAllRead } = useNotifications();
    const navigate = useNavigate();
    const { language, toggleLanguage } = useLanguage();
    const navRef = useRef(null);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        const closeAll = () => {
            setIsOpen(false);
            setIsNotifOpen(false);
            setShowProfileMenu(false);
            setIsSearchOpen(false);
        };
        const handleClickOutside = (e) => {
            const insideNav = navRef.current?.contains(e.target);
            const insideMobileMenu = mobileMenuRef.current?.contains(e.target);
            if (!insideNav && !insideMobileMenu) closeAll();
        };
        const handleEscape = (e) => {
            if (e.key === 'Escape') closeAll();
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const navClasses = "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-gray-800 dark:text-gray-100 shadow-sm sticky top-0 z-40 border-b border-gray-100 dark:border-slate-800 w-full transition-colors duration-300";

    const megaMenuData = getMegaMenuData(language);

    return (
        <>
            <nav ref={navRef} className={navClasses}>
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-4">

                        <div className="flex-shrink-0 flex items-center gap-3">
                            <Link
                                to={user ? "/dashboard" : "/"}
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            >
                                <img 
                                src="/madventure-logo-v2.png" 
                                alt="Madventure Logo" 
                                className={`h-8 md:h-10 w-auto transition-all duration-300 transform group-hover:scale-105`} 
                            />
                            </Link>
                            <div className="flex flex-col">
                                <span className={`text-[16px] md:text-xl font-black tracking-tight leading-none text-gray-900 dark:text-white`}>
                                    Madventure
                                </span>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-1 xl:gap-2 flex-1 justify-center">
                            {megaMenuData.map((data) => (
                                <MegaMenuDropdown
                                    key={data.id}
                                    data={data}
                                    activeMenu={activeMenu}
                                    setActiveMenu={setActiveMenu}
                                />
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-2 flex-shrink-0">

                            <div className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? 'w-52' : 'w-9'}`}>
                                {isSearchOpen && (
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className={`w-full pl-9 pr-4 py-1.5 rounded-full border text-sm focus:outline-none bg-gray-100 dark:bg-slate-800 border-gray-200 text-gray-900 dark:text-white`}
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
                                    onClick={() => setIsSearchOpen(true)}
                                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors"
                                    title="Search"
                                > <Search size={19} />
                                </button>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => { setIsNotifOpen(!isNotifOpen); if (!isNotifOpen) markAllRead(); }}
                                    className="p-2 rounded-full relative transition-colors text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"
                                    title="Notifications"
                                >
                                    <Bell size={19} />
                                    {unreadCount > 0 && <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{unreadCount}</span>}
                                </button>
                                {isNotifOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 py-4 z-50">
                                        <div className="px-4 mb-3">
                                            <h4 className="font-bold text-gray-900 dark:text-white">Notifications</h4>
                                        </div>
                                        <div className="max-h-72 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="px-4 py-8 text-center text-gray-400 text-sm">No new alerts</div>
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

                            <div className="hidden sm:block">
                                <LanguageSwitcher />
                            </div>

                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full border-2 border-transparent transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-gray-300'}`}
                            >
                                <span className={`h-5 w-5 transform rounded-full bg-white transition duration-200 flex items-center justify-center ${theme === 'dark' ? 'translate-x-5' : 'translate-x-1'}`}>
                                    {theme === 'dark' ? <Moon size={12} className="text-green-600" /> : <Sun size={12} className="text-amber-500" />}
                                </span>
                            </button>

                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-white dark:hover:border-green-400 transition-all shadow-md"
                                    >
                                        {user.avatar
                                            ? <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                                            : <div className="w-full h-full bg-secondary flex items-center justify-center text-white font-bold text-sm">{user?.name?.charAt(0) || 'U'}</div>
                                        }
                                    </button>
                                    {showProfileMenu && (
                                        <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl py-2 z-50 border border-gray-100 dark:border-slate-700">
                                            <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors" onClick={() => setShowProfileMenu(false)}>
                                                <UserIcon size={16} className="text-primary" /> My Profile
                                            </Link>
                                            <Link to="/bookings" className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors" onClick={() => setShowProfileMenu(false)}>
                                                <LayoutDashboard size={16} className="text-primary" /> My Bookings
                                            </Link>
                                            <div className="border-t border-gray-100 dark:border-slate-700 mt-1 pt-1">
                                                <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                                                    <LogOut size={16} /> Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={onOpenLogin}
                                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all bg-primary text-white hover:bg-green-700 shadow-sm`}
                                >
                                    <LogIn size={16} />
                                    {language === 'bn' ? 'লগইন' : 'Login'}
                                </button>
                            )}
                        </div>

                        <div className="-mr-2 flex md:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} className={`p-2 rounded-md text-gray-700`}>
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                    <div ref={mobileMenuRef} className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-y-auto">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
                            <span className="font-heading font-bold text-lg text-primary">{language === 'bn' ? 'মেনু' : 'Menu'}</span>
                            <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600">
                                <X size={22} />
                            </button>
                        </div>

                        <div className="p-4 space-y-1 flex-1">
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 mb-4">
                                <Search size={18} className="text-gray-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder={language === 'bn' ? 'ট্যুর বা টিকিট খুঁজুন...' : 'Search tours or tickets...'}
                                    className="w-full bg-transparent outline-none py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-400"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value.trim()) {
                                            navigate(`/explore?q=${encodeURIComponent(e.target.value.trim())}`);
                                            setIsOpen(false);
                                        }
                                    }}
                                />
                            </div>

                            <div className="px-1 mt-2">
                                {megaMenuData.map((data) => (
                                    <MobileAccordionItem 
                                        key={data.id}
                                        data={data}
                                        activeAccordion={activeAccordion}
                                        setActiveAccordion={setActiveAccordion}
                                        setIsOpen={setIsOpen}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-slate-800 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <button onClick={toggleLanguage} className="px-4 py-2 rounded-full text-xs font-black border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300">
                                    {language === 'en' ? 'বাংলা' : 'EN'}
                                </button>
                                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300">
                                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                </button>
                            </div>
                            {user ? (
                                <>
                                    <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-full font-bold text-sm">
                                        <UserIcon size={16} /> My Profile
                                    </Link>
                                    <button onClick={() => { setIsOpen(false); onLogout(); }} className="flex items-center justify-center gap-2 w-full bg-red-50 dark:bg-red-950/40 text-red-600 px-4 py-2.5 rounded-full font-bold text-sm">
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => { setIsOpen(false); onOpenLogin(); }} className="flex items-center justify-center gap-2 w-full bg-primary text-white px-4 py-2.5 rounded-full font-bold text-sm">
                                    <LogIn size={16} /> {language === 'bn' ? 'লগইন / সাইন আপ' : 'Login / Sign Up'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default Navbar;