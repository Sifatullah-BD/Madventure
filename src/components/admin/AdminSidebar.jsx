import React from 'react';
import { LayoutDashboard, Users, Briefcase, Tag, Monitor, ShieldCheck, XCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { hasAdminAccess } from '../../utils/appRole';
import { useLanguage } from '../../context/LanguageContext';

/**
 * AdminSidebar – persistent navigation for the admin dashboard.
 * Uses Madventure branding colors and collapses on small screens.
 */
const AdminSidebar = ({ user }) => {
  const { language } = useLanguage();

  const navItems = [
    { path: '/admin', label: language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: language === 'bn' ? 'ব্যবহারকারী' : 'Users', icon: Users },
    { path: '/admin/agencies', label: language === 'bn' ? 'এজেন্সি' : 'Agencies', icon: Briefcase },
    { path: '/admin/coupons', label: language === 'bn' ? 'কুপন' : 'Coupons', icon: Tag },
    { path: '/admin/analytics', label: language === 'bn' ? 'বিশ্লেষণ' : 'Analytics', icon: Monitor },
    { path: '/admin/logs', label: language === 'bn' ? 'সিস্টেম লগ' : 'System Logs', icon: ShieldCheck },
    { path: '/admin/settings', label: language === 'bn' ? 'সেটিংস' : 'Settings', icon: XCircle },
  ];

  const filteredNav = navItems.filter(() => hasAdminAccess(user)); // all require admin

  return (
    <aside className="w-64 bg-[#0A0F2B] text-white flex flex-col justify-between py-6 px-4 shrink-0 transition-colors">
      <div className="space-y-6">
        <div className="px-3 flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest">Admin Panel</span>
        </div>
        <nav className="space-y-1">
          {filteredNav.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-forest-600 text-white shadow-md'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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

export default AdminSidebar;
