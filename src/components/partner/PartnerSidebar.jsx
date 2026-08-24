import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, User, Box, CalendarCheck, Calendar,
    Tag, CreditCard, Star, MessageSquare, BarChart2,
    Megaphone, Link2, Users, Bell, Settings, LogOut,
    ChevronLeft, ChevronRight, Building2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
    { path: '/partner/dashboard', label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { path: '/partner/profile', label: 'Business Profile', labelBn: 'বিজনেস প্রোফাইল', icon: User },
    { path: '/partner/products', label: 'Products / Services', labelBn: 'পণ্য / সেবা', icon: Box },
    { path: '/partner/bookings', label: 'Bookings', labelBn: 'বুকিং', icon: CalendarCheck },
    { path: '/partner/calendar', label: 'Availability', labelBn: 'প্রাপ্যতা', icon: Calendar },
    { path: '/partner/offers', label: 'Offers & Promo', labelBn: 'অফার ও প্রমো', icon: Tag },
    { path: '/partner/finance', label: 'Finance', labelBn: 'অর্থ', icon: CreditCard },
    { path: '/partner/reviews', label: 'Reviews', labelBn: 'রিভিউ', icon: Star },
    { path: '/partner/inbox', label: 'Messages', labelBn: 'বার্তা', icon: MessageSquare },
    { path: '/partner/analytics', label: 'Analytics', labelBn: 'বিশ্লেষণ', icon: BarChart2 },
    { path: '/partner/marketing', label: 'Marketing', labelBn: 'মার্কেটিং', icon: Megaphone },
    { path: '/partner/affiliate', label: 'Affiliate', labelBn: 'অ্যাফিলিয়েট', icon: Link2 },
    { path: '/partner/team', label: 'Team', labelBn: 'টিম', icon: Users },
    { path: '/partner/notifications', label: 'Notifications', labelBn: 'নোটিফিকেশন', icon: Bell },
    { path: '/partner/settings', label: 'Settings', labelBn: 'সেটিংস', icon: Settings },
];

const PartnerSidebar = ({ language = 'en', collapsed, onToggle }) => {
    const { user } = useAuth ? useAuth() : { user: null };
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <aside className={`
            relative flex flex-col shrink-0
            bg-[#050f08] dark:bg-[#050f08]
            border-r border-white/10
            transition-all duration-300 ease-in-out
            ${collapsed ? 'w-16' : 'w-60'}
            min-h-screen
        `}>
            {/* Logo / Brand */}
            <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center px-2' : ''}`}>
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Building2 size={18} />
                </div>
                {!collapsed && (
                    <div>
                        <p className="text-white text-sm font-bold leading-none">Partner Hub</p>
                        <p className="text-emerald-400/70 text-xs mt-0.5">Madventure Business</p>
                    </div>
                )}
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={onToggle}
                className="
                    absolute -right-3 top-14
                    w-6 h-6 rounded-full
                    bg-[#1B5E20] text-white
                    flex items-center justify-center
                    shadow-lg border border-white/20
                    hover:bg-emerald-600 transition-colors z-10
                "
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>

            {/* Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
                <ul className="space-y-0.5 px-2">
                    {navItems.map(({ path, label, labelBn, icon: Icon }) => (
                        <li key={path}>
                            <NavLink
                                to={path}
                                title={label}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                                    transition-all duration-150 group
                                    ${isActive
                                        ? 'bg-emerald-500/20 text-emerald-400 shadow-sm'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }
                                    ${collapsed ? 'justify-center' : ''}
                                `}
                            >
                                <Icon size={17} className="shrink-0" />
                                {!collapsed && (
                                    <span className="truncate">
                                        {language === 'bn' ? labelBn : label}
                                    </span>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer: User & Logout */}
            {!collapsed && user && (
                <div className="px-3 py-4 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=Partner&background=1B5E20&color=fff`}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover border border-white/20"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-semibold truncate">{user.name || 'Partner'}</p>
                            <p className="text-emerald-400/70 text-xs truncate">{user.email || ''}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut size={14} />
                        <span>Sign out</span>
                    </button>
                </div>
            )}
            {collapsed && (
                <div className="px-2 py-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        title="Sign out"
                        className="flex items-center justify-center w-full py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            )}
        </aside>
    );
};

export default PartnerSidebar;
