import React from 'react';
import { Bell, Search, Sun, Moon, Menu } from 'lucide-react';

/**
 * PartnerHeader — top bar for the Partner Portal layout.
 */
const PartnerHeader = ({ user, theme, setTheme, onMobileMenuToggle, pageTitle = 'Dashboard' }) => {
    const toggleTheme = () => setTheme?.(prev => prev === 'dark' ? 'light' : 'dark');

    return (
        <header className="
            sticky top-0 z-30
            flex items-center justify-between
            h-14 px-4 md:px-6
            bg-white/80 dark:bg-[#050f08]/80
            backdrop-blur-md
            border-b border-gray-100 dark:border-white/10
            shadow-sm
        ">
            {/* Left: Mobile menu + Page title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMobileMenuToggle}
                    className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    aria-label="Toggle menu"
                >
                    <Menu size={20} />
                </button>
                <h1 className="text-base font-bold text-gray-800 dark:text-white">{pageTitle}</h1>
            </div>

            {/* Center: Search (hidden on small) */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100 dark:bg-white/5 rounded-xl px-3 py-2 w-56 border border-transparent focus-within:border-emerald-400 transition-colors">
                <Search size={15} className="text-gray-400 shrink-0" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none w-full"
                />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Notifications */}
                <button
                    className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    aria-label="Notifications"
                >
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                </button>

                {/* Avatar */}
                {user && (
                    <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'P')}&background=1B5E20&color=fff`}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-emerald-400/40 cursor-pointer hover:ring-2 hover:ring-emerald-400 transition-all"
                    />
                )}
            </div>
        </header>
    );
};

export default PartnerHeader;
