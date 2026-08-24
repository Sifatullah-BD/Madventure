import React, { useState, useEffect } from 'react';
import { 
    Users, Briefcase, Calendar, DollarSign, TrendingUp, 
    ArrowUpRight, ArrowDownRight, Package, Hotel, 
    ShieldCheck, Activity, Search, Filter, MoreVertical,
    CheckCircle2, Clock, XCircle, LayoutDashboard,
    ClipboardList, UserPlus, Shield, RefreshCcw, Tag, Monitor,
    Image as ImageIcon, Plus, Edit2, Trash2, Save, Loader2 // Added Loader2
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getAllUsers, getPendingAgencies, setAgencyStatus, getSystemAuditLogs, updateUserRole } from '../services/adminService';
import { unicornService } from '../services/unicornService';
import { useToast } from '../components/ui/Toast';
import AdminSidebar from '../components/admin/AdminSidebar';
import StatCard from '../components/admin/StatCard';
import QuickAction from '../components/admin/QuickAction';
import LiveActivityPanel from '../components/admin/LiveActivityPanel';
import PendingTasksTable from '../components/admin/PendingTasksTable';
const AdminDashboard = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    // Stats States
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalBookings: 0,
        totalRevenue: 0,
        activeAgencies: 0,
        pendingRefunds: 0
    });

    // Data States
    const [users, setUsers] = useState([]);
    const [refunds, setRefunds] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [biMetrics, setBiMetrics] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        if (!isSupabaseConfigured) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const [usersRes, bookingsRes, revenueRes, agenciesRes, refundsRes, auditRes, metrics] = await Promise.all([
                supabase.from('profiles').select('id', { count: 'exact', head: true }),
                supabase.from('bookings').select('id', { count: 'exact', head: true }),
                supabase.from('bi_daily_revenue').select('total_revenue'),
                supabase.from('tour_agencies').select('id', { count: 'exact', head: true }).eq('verification_status', 'verified'),
                supabase.from('refund_requests').select('*').eq('refund_status', 'pending'),
                getSystemAuditLogs(20),
                unicornService.getBIMetrics()
            ]);

            const totalRev = revenueRes.data?.reduce((sum, d) => sum + Number(d.total_revenue), 0) || 0;

            setStats({
                totalUsers: usersRes.count || 0,
                totalBookings: bookingsRes.count || 0,
                totalRevenue: totalRev,
                activeAgencies: agenciesRes.count || 0,
                pendingRefunds: refundsRes.data?.length || 0
            });

            setRefunds(refundsRes.data || []);
            setAuditLogs(auditRes.data || []);
            setBiMetrics(metrics || []);

            const usersList = await getAllUsers();
            setUsers(usersList.data || []);

        } catch (e) {
            console.error(e);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleRefundAction = async (id, status) => {
        try {
            const { error } = await supabase
                .from('refund_requests')
                .update({ refund_status: status, processed_at: new Date().toISOString() })
                .eq('id', id);
            
            if (error) throw error;
            toast.success(`Refund ${status} successfully`);
            setRefunds(refunds.filter(r => r.id !== id));
            setStats(prev => ({ ...prev, pendingRefunds: prev.pendingRefunds - 1 }));
        } catch (e) {
            toast.error(e.message);
        }
    };

    const chartData = biMetrics.length > 0 ? biMetrics : [
        { name: 'Mon', rev: 45000 }, { name: 'Tue', rev: 52000 }, { name: 'Wed', rev: 48000 },
        { name: 'Thu', rev: 61000 }, { name: 'Fri', rev: 75000 }, { name: 'Sat', rev: 92000 }, { name: 'Sun', rev: 88000 },
    ];

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-gray-950">
      <AdminSidebar user={null} />
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-[1400px] mx-auto space-y-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">
                                Travel OS v4.0
                            </span>
                            <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Madventure ERP Dashboard</h1>
                    </div>
                    <button onClick={fetchDashboardData} className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-6 py-3 rounded-2xl font-bold text-sm shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-all">
                        <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} /> Refresh Data
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex bg-white dark:bg-gray-900 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-fit overflow-x-auto no-scrollbar">
                    {[
                        { id: 'overview', label: 'Intelligence', icon: LayoutDashboard },
                        { id: 'refunds', label: 'Refunds', icon: RefreshCcw, badge: stats.pendingRefunds },
                        { id: 'cms', label: 'CMS Manager', icon: Monitor },
                        { id: 'coupons', label: 'Marketing', icon: Tag },
                        { id: 'users', label: 'Users', icon: Users }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                                activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <tab.icon size={18} /> {tab.label}
                            {tab.badge > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{tab.badge}</span>}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="animate-spin text-primary" size={64} />
                        <p className="font-black text-gray-400 uppercase tracking-widest">Synchronizing Data...</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                        {activeTab === 'overview' && (
                            <div className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard title="Total Revenue" value={stats.totalRevenue} icon={DollarSign} colorClass="bg-forest-600" trend={12} />
                                    <StatCard title="Total Users" value={stats.totalUsers} icon={Users} colorClass="bg-brightgreen-600" trend={8} />
                                    <StatCard title="Active Partners" value={stats.activeAgencies} icon={Briefcase} colorClass="bg-orange-600" trend={-2} />
                                    <StatCard title="Pending Refunds" value={stats.pendingRefunds} icon={RefreshCcw} colorClass="bg-red-600" />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                                        <h3 className="text-xl font-black mb-10 uppercase">Revenue Intelligence</h3>
                                        <div className="h-[350px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={chartData}>
                                                    <XAxis dataKey="name" hide />
                                                    <Tooltip />
                                                    <Area type="monotone" dataKey="rev" stroke="#22c55e" fillOpacity={0.1} fill="#22c55e" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                                        <h3 className="text-xl font-black mb-8 uppercase">System Node Status</h3>
                                        <div className="space-y-4">
                                            {['Inventory Lock', 'SSLCommerz', 'Media CDN'].map((node, i) => (
                                                <div key={i} className="flex justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                                                    <span className="text-xs font-bold">{node}</span>
                                                    <span className="text-[10px] text-green-600 font-black">ONLINE</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-[10px] font-black uppercase">
                                        <tr>
                                            <th className="px-8 py-5">Traveler</th>
                                            <th className="px-8 py-5">Role</th>
                                            <th className="px-8 py-5">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {users.map(u => (
                                            <tr key={u.id}>
                                                <td className="px-8 py-6">
                                                    <p className="font-black text-sm">{u.full_name || 'Anonymous'}</p>
                                                    <p className="text-xs text-gray-400">{u.email}</p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="px-3 py-1 rounded-full text-[9px] font-black bg-purple-100 text-purple-700 uppercase">
                                                        {u.app_role || 'traveler'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6"><button className="text-gray-400 hover:text-primary"><Edit2 size={16}/></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div></div>
    );
};

export default AdminDashboard;