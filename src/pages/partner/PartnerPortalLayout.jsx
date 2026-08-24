import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PartnerSidebar from '../../components/partner/PartnerSidebar';
import PartnerHeader from '../../components/partner/PartnerHeader';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';

/** Map route path segments to human-readable page titles */
const TITLE_MAP = {
    dashboard: 'Dashboard',
    profile: 'Business Profile',
    products: 'Products & Services',
    bookings: 'Bookings',
    calendar: 'Availability / Calendar',
    offers: 'Offers & Promotions',
    finance: 'Finance',
    reviews: 'Reviews & Ratings',
    inbox: 'Messages',
    analytics: 'Analytics',
    marketing: 'Marketing',
    affiliate: 'Affiliate',
    team: 'Team Management',
    notifications: 'Notifications',
    settings: 'Settings',
};

const PartnerPortalLayout = () => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const location = useLocation();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Derive page title from URL
    const segment = location.pathname.split('/').filter(Boolean)[1] || 'dashboard';
    const pageTitle = TITLE_MAP[segment] || 'Partner Portal';

    // Read theme from localStorage (mirrors App.jsx pattern)
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const handleThemeChange = (updater) => {
        setTheme(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            localStorage.setItem('theme', next);
            document.documentElement.classList.toggle('dark', next === 'dark');
            return next;
        });
    };

    return (
        <div className={`flex h-screen overflow-hidden bg-gray-50 dark:bg-[#050f08] ${theme === 'dark' ? 'dark' : ''}`}>
            {/* ── Desktop Sidebar ── */}
            <div className="hidden md:flex">
                <PartnerSidebar
                    language={language}
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(c => !c)}
                />
            </div>

            {/* ── Mobile Sidebar Overlay ── */}
            {mobileSidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                    <div className="fixed left-0 top-0 z-50 h-full md:hidden">
                        <PartnerSidebar
                            language={language}
                            collapsed={false}
                            onToggle={() => setMobileSidebarOpen(false)}
                        />
                    </div>
                </>
            )}

            {/* ── Main Content Area ── */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <PartnerHeader
                    user={user}
                    theme={theme}
                    setTheme={handleThemeChange}
                    onMobileMenuToggle={() => setMobileSidebarOpen(o => !o)}
                    pageTitle={pageTitle}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default PartnerPortalLayout;
