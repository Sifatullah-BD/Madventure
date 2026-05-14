import React, { useState, useEffect } from 'react';
import { 
    Users, Briefcase, Calendar, DollarSign, TrendingUp, 
    ArrowUpRight, ArrowDownRight, Package, Hotel, 
    ShieldCheck, Activity, Search, Filter, MoreVertical,
    CheckCircle2, Clock, XCircle, LayoutDashboard,
    ClipboardList, UserPlus, Shield, RefreshCcw, Tag, Monitor,
    Image as ImageIcon, Plus, Edit2, Trash2, Save
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getAllUsers, getPendingAgencies, setAgencyStatus, getSystemAuditLogs, updateUserRole } from '../api/admin';
import { unicornService } from '../api/unicorn';
import { useToast } from '../components/ui/Toast';

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
    const [pendingAgencies, setPendingAgencies] = useState([]);
    const [refunds, setRefunds] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [banners, setBanners] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);

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
            // UNICORN BI & STATS
            const [usersRes, bookingsRes, revenueRes, agenciesRes, refundsRes, auditRes] = await Promise.all([
                supabase.from('profiles').select('id', { count: 'exact', head: true }),
                supabase.from('bookings').select('id', { count: 'exact', head: true }),
                supabase.from('bi_daily_revenue').select('total_revenue'),
                supabase.from('tour_agencies').select('id', { count: 'exact', head: true }).eq('verification_status', 'verified'),
                supabase.from('refund_requests').select('*').eq('refund_status', 'pending'),
                getSystemAuditLogs(20)
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

            // Initial load for Users and Partners
            const [usersList, agenciesList] = await Promise.all([
                getAllUsers(),
                getPendingAgencies()
            ]);
            setUsers(usersList.data || []);
            setPendingAgencies(agenciesList.data || []);

        } catch (e) {
            console.error(e);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    // --- Actions ---
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

    const [biMetrics, setBiMetrics] = useState([]);
    const [retentionData, setRetentionData] = useState([]);

    useEffect(() => {
        async function loadBI() {
            try {
                const [metrics, retention] = await Promise.all([
                    unicornService.getBIMetrics(),
                    unicornService.getOverallRetention()
                ]);
                setBiMetrics(metrics || []);
                setRetentionData(retention || []);
            } catch (err) {
                console.error("BI Load Error:", err);
            }
        }
        loadBI();
    }, []);

    const handleCreateCoupon = async (payload) => {
        try {
            const { data, error } = await supabase.from('coupons').insert(payload).select().single();
            if (error) throw error;
            setCoupons([data, ...coupons]);
            toast.success("Coupon created successfully");
        } catch (e) {
            toast.error(e.message);
        }
    };

    // --- Charts Data ---
    const chartData = biMetrics.length > 0 ? biMetrics : [
        { name: 'Mon', rev: 45000 },
        { name: 'Tue', rev: 52000 },
        { name: 'Wed', rev: 48000 },
        { name: 'Thu', rev: 61000 },
        { name: 'Fri', rev: 75000 },
        { name: 'Sat', rev: 92000 },
        { name: 'Sun', rev: 88000 },
    ];

    const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-800 group hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
                <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={`flex items-center gap-1 text-[10px] font-black ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {trend > 0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                {typeof value === 'number' && title.includes('Revenue') ? `৳${value.toLocaleString()}` : value}
            </h3>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 p-6 md:p-10">
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
                    <div className="flex gap-3">
                        <button onClick={fetchDashboardData} className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-6 py-3 rounded-2xl font-bold text-sm shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-all">
                            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} /> Refresh Data
                        </button>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex bg-white dark:bg-gray-900 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 w-fit overflow-x-auto no-scrollbar max-w-full">
                    {[
                        { id: 'overview', label: 'Intelligence', icon: LayoutDashboard },
                        { id: 'refunds', label: 'Refunds', icon: RefreshCcw, badge: stats.pendingRefunds },
                        { id: 'cms', label: 'CMS Manager', icon: Monitor },
                        { id: 'coupons', label: 'Marketing', icon: Tag },
                        { id: 'users', label: 'Users', icon: Users },
                        { id: 'audit', label: 'Audit', icon: ClipboardList }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                activeTab === tab.id 
                                ? 'bg-primary text-white shadow-xl shadow-green-900/20' 
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                            }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                            {tab.badge > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px]">{tab.badge}</span>}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="animate-spin text-primary" size={64} />
                        <p className="font-black text-gray-400 uppercase tracking-widest animate-pulse">Synchronizing Travel OS...</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                        {activeTab === 'overview' && (
                            <div className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard title="Total Revenue" value={stats.totalRevenue} icon={DollarSign} color="bg-blue-600" trend={12} />
                                    <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-purple-600" trend={8} />
                                    <StatCard title="Active Partners" value={stats.activeAgencies} icon={Briefcase} color="bg-orange-600" trend={-2} />
                                    <StatCard title="Pending Refunds" value={stats.pendingRefunds} icon={RefreshCcw} color="bg-red-600" />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* BI Chart */}
                                    <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
                                        <div className="flex justify-between items-center mb-10">
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Revenue Intelligence</h3>
                                            <div className="flex gap-2">
                                                <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold">7D</button>
                                                <button className="px-3 py-1 text-xs font-bold text-gray-400">30D</button>
                                            </div>
                                        </div>
                                        <div className="h-[350px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={chartData}>
                                                    <defs>
                                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} />
                                                    <Tooltip 
                                                        contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '16px'}} 
                                                        itemStyle={{fontWeight: 900}}
                                                    />
                                                    <Area type="monotone" dataKey="rev" stroke="#22c55e" strokeWidth={4} fill="url(#colorRev)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* System Stability */}
                                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-tight">System Node Status</h3>
                                        <div className="space-y-6">
                                            {[
                                                { label: 'Inventory Lock Engine', status: 'Online', color: 'green' },
                                                { label: 'SSLCommerz Gateway', status: 'Operational', color: 'green' },
                                                { label: 'Media CDN', status: 'Synchronized', color: 'blue' },
                                                { label: 'PostGIS Spatial Node', status: 'Live', color: 'purple' },
                                                { label: 'Real-time Chat Node', status: 'Online', color: 'green' }
                                            ].map((node, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full bg-${node.color}-500 animate-pulse`}></div>
                                                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{node.label}</span>
                                                    </div>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest text-${node.color}-600`}>{node.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                    {/* BI Intelligence Panel */}
                                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                                        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><TrendingUp size={20}/></div>
                                                <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs">CLV (Average)</h4>
                                            </div>
                                            <p className="text-3xl font-black text-gray-900 dark:text-white">৳১২,৫০০</p>
                                            <p className="text-[10px] text-gray-400 font-bold mt-2">Customer Lifetime Value (Projected)</p>
                                        </div>

                                        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 bg-red-100 text-red-600 rounded-lg"><XCircle size={20}/></div>
                                                <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs">Churn Rate</h4>
                                            </div>
                                            <p className="text-3xl font-black text-red-600">৩.২%</p>
                                            <p className="text-[10px] text-gray-400 font-bold mt-2">Predicted Monthly User Churn</p>
                                        </div>

                                        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CheckCircle2 size={20}/></div>
                                                <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs">Retention</h4>
                                            </div>
                                            <p className="text-3xl font-black text-green-600">৮৪%</p>
                                            <p className="text-[10px] text-gray-400 font-bold mt-2">Active Returning Customers</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'refunds' && (
                            <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase">Refund Request Manager</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                            <tr>
                                                <th className="px-8 py-5">Booking Ref</th>
                                                <th className="px-8 py-5">Reason</th>
                                                <th className="px-8 py-5">Amount</th>
                                                <th className="px-8 py-5">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                            {refunds.length === 0 ? (
                                                <tr><td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold">No pending refund requests. Good job!</td></tr>
                                            ) : refunds.map(r => (
                                                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-6 font-mono text-sm text-gray-900 dark:text-white">#{r.booking_id.slice(0, 8)}</td>
                                                    <td className="px-8 py-6 max-w-xs truncate text-sm text-gray-500">{r.reason}</td>
                                                    <td className="px-8 py-6 font-black text-gray-900 dark:text-white">৳{r.refund_amount}</td>
                                                    <td className="px-8 py-6 flex gap-2">
                                                        <button onClick={() => handleRefundAction(r.id, 'approved')} className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-green-200 transition-all">Approve</button>
                                                        <button onClick={() => handleRefundAction(r.id, 'rejected')} className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-red-200 transition-all">Reject</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'coupons' && (
                             <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase">Marketing & Promo Engine</h3>
                                    <button className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-green-900/10">
                                        <Plus size={18} /> New Campaign
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
                                        { code: 'EID2025', disc: '20%', use: 45, limit: 100, status: 'Active' },
                                        { code: 'STUDENT500', disc: '৳500', use: 120, limit: 500, status: 'Active' },
                                        { code: 'WELCOME10', disc: '10%', use: 240, limit: '∞', status: 'Paused' }
                                    ].map((c, i) => (
                                        <div key={i} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm text-primary">
                                                    <Tag size={20} />
                                                </div>
                                                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{c.status}</span>
                                            </div>
                                            <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{c.code}</h4>
                                            <p className="text-xs font-bold text-primary mb-6">{c.disc} OFF on all tours</p>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase">
                                                    <span>Redeemed</span>
                                                    <span>{c.use} / {c.limit}</span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{width: `${(c.use/100)*100}%`}}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        )}

                        {activeTab === 'cms' && (
                             <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase">Enterprise Content Manager</h3>
                                    <div className="flex gap-3">
                                        <button className="bg-gray-100 px-4 py-2 rounded-xl text-xs font-bold">Manage Pages</button>
                                        <button className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">Update Banners</button>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {[
                                        { title: 'Home Hero Banner 1', placement: 'home_hero', type: 'Image', status: 'Live' },
                                        { title: 'Sajek Special Offer', placement: 'home_hero', type: 'Image', status: 'Scheduled' },
                                        { title: 'Cox\'s Bazar Flash Sale', placement: 'home_hero', type: 'Video', status: 'Live' }
                                    ].map((b, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 group hover:border-primary transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                                                    <ImageIcon className="text-gray-400" size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-tight">{b.title}</h4>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Placement: {b.placement} • Type: {b.type}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${b.status === 'Live' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{b.status}</span>
                                                <button className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 size={18} /></button>
                                                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        )}
                        
                        {/* Audit and Users fallback (keep existing logic but update UI styling) */}
                        {activeTab === 'users' && (
                             <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">User Directory</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                            <tr>
                                                <th className="px-8 py-5">Traveler</th>
                                                <th className="px-8 py-5">Security Role</th>
                                                <th className="px-8 py-5">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                            {users.map(u => (
                                                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-6">
                                                        <p className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-tight">{u.full_name || 'Anonymous'}</p>
                                                        <p className="text-xs text-gray-400 font-bold">{u.email}</p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                                                            u.app_role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            {u.app_role || 'traveler'}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <select 
                                                            value={u.app_role || 'traveler'}
                                                            onChange={(e) => handleRoleUpdate(u.id, e.target.value)}
                                                            className="text-[10px] font-black uppercase bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                                                        >
                                                            <option value="traveler">Traveler</option>
                                                            <option value="agency">Agency</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                             </div>
                        )}

                        {activeTab === 'audit' && (
                            <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-tight">System Audit Matrix</h3>
                                <div className="space-y-4">
                                    {auditLogs.map(log => (
                                        <div key={log.id} className="flex gap-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 group hover:border-primary transition-all">
                                            <div className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm text-primary group-hover:scale-110 transition-transform">
                                                <Activity size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{log.action.replace('_', ' ')}</p>
                                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(log.created_at).toLocaleTimeString()}</p>
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Shield size={12} className="text-blue-500" /> Entity: {log.entity_type} • ID: {log.entity_id?.slice(0, 8) || 'SYSTEM'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper for Loader (missing in imports)
const Loader2 = ({ size = 24, className = "" }) => (
    <div className={`animate-spin rounded-full border-4 border-primary border-t-transparent ${className}`} style={{width: size, height: size}}></div>
);

export default AdminDashboard;
