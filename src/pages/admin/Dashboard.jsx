import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Download, Users, TrendingUp, ShieldAlert, Loader2, RefreshCw } from 'lucide-react';
import AnalyticsChart from '../../components/admin/AnalyticsChart';
import AdminUserTable from '../../components/admin/AdminUserTable';
import AuditLogTable from '../../components/admin/AuditLogTable';
import { useToast } from '../../components/ui/Toast';

const Dashboard = () => {
    const { user, profile, loading: authLoading } = useAuth();
    const toast = useToast();
    
    const [analytics, setAnalytics] = useState([]);
    const [users, setUsers] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        if (!authLoading && profile?.role && ['admin', 'super_admin'].includes(profile.role)) {
            fetchDashboardData();
        }
    }, [authLoading, profile]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // In a real Vite app, these might go to a different backend or be handled via Supabase directly
            // We use standard fetch matching the API routes created
            const [analyticsRes, usersRes, auditRes] = await Promise.all([
                fetch('/api/v1/admin/analytics/daily'),
                fetch('/api/v1/admin/users'),
                fetch('/api/v1/admin/audit')
            ]);
            
            const [analyticsData, usersData, auditData] = await Promise.all([
                analyticsRes.json(),
                usersRes.json(),
                auditRes.json()
            ]);

            if (analyticsData.data) setAnalytics(analyticsData.data);
            if (usersData.data) setUsers(usersData.data);
            if (auditData.data) setAuditLogs(auditData.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            toast?.error?.('Sync Error', 'Failed to load dashboard metrics.');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (type) => {
        setExporting(true);
        try {
            const res = await fetch('/api/v1/admin/reports/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reportType: type })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || 'Export failed');
            toast?.success?.('Export Triggered', data.data?.message || 'Report is being generated and emailed.');
        } catch (error) {
            toast?.error?.('Export Error', error.message);
        } finally {
            setExporting(false);
        }
    };

    if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-primary" size={40}/></div>;
    
    // Role Check
    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
        return <Navigate to="/" replace />;
    }

    // Stats calculations
    const totalUsers = users.length;
    const newUsersToday = analytics.length > 0 ? analytics[analytics.length-1].total_bookings : 0; // Mock stat
    const totalRevenue = analytics.reduce((sum, day) => sum + (day.total_revenue || 0), 0);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Admin Control Center</h1>
                        <p className="text-gray-500 font-medium mt-1">Manage users, monitor performance, and oversee operations.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={fetchDashboardData}
                            disabled={loading}
                            className="p-2.5 bg-white border border-gray-200 text-gray-500 hover:text-primary rounded-xl transition-colors shadow-sm"
                        >
                            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                        </button>
                        <div className="relative group">
                            <button disabled={exporting} className="bg-[#1B5E20] hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95">
                                {exporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                                Export Reports
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl p-2 hidden group-hover:block z-10">
                                <button onClick={() => handleExport('users')} className="w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg">Users CSV</button>
                                <button onClick={() => handleExport('bookings')} className="w-full text-left px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg">Bookings CSV</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-green-50 text-[#1B5E20] rounded-xl flex items-center justify-center"><TrendingUp size={24} /></div>
                            <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Revenue (30d)</p></div>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900">৳{totalRevenue > 1000 ? (totalRevenue/1000).toFixed(1)+'k' : totalRevenue}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Users size={24} /></div>
                            <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Users</p></div>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900">{totalUsers}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center"><ShieldAlert size={24} /></div>
                            <div><p className="text-sm font-bold text-gray-400 uppercase tracking-wider">System Alerts</p></div>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900">0</h3>
                        <p className="text-xs text-green-500 font-bold mt-1">All systems operational</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <AnalyticsChart data={analytics} loading={loading} />
                        <AdminUserTable users={users} loading={loading} onUpdate={fetchDashboardData} />
                    </div>
                    <div className="lg:col-span-1">
                        <AuditLogTable logs={auditLogs} loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
