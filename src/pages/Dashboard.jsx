import React, { useState, useEffect } from 'react';
import { 
    MapPin, Calendar, Wallet, Heart, Award, MessageSquare, 
    Video, TrendingUp, Sparkles, ArrowRight, Bell, ChevronRight,
    Map, Plane, Star, CheckCircle2, Users, Send, Bot, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { paymentService } from '../services/paymentService';
import { isSupabaseConfigured } from '../lib/supabase';
import { motion } from 'framer-motion';

// Mini SVG Sparkline
const Sparkline = ({ data }) => {
    const max = Math.max(...data), min = Math.min(...data);
    const range = max - min || 1;
    const W = 200, H = 50;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * (W - 8) + 4;
        const y = H - ((v - min) / range) * (H - 8) - 4;
        return [x, y];
    });
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
    const area = `${line} L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`;
    return (
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="overflow-visible">
            <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={area} fill="url(#sg)" />
            <path d={line} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_4px_6px_rgba(34,197,94,0.3)]" />
            <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="4" fill="white" stroke="#22c55e" strokeWidth="2.5" className="dark:fill-slate-800" />
        </svg>
    );
};

const Dashboard = ({ user }) => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [balance, setBalance] = useState(0);
    const [loadingBalance, setLoadingBalance] = useState(false);
    const [aiMsg, setAiMsg] = useState('');
    const [period, setPeriod] = useState('7D');

    const chartData = {
        '7D': [2, 5, 3, 8, 6, 11, 9],
        '30D': [4, 7, 5, 10, 8, 14, 9, 12, 16, 11, 8, 13, 18],
    };

    useEffect(() => {
        if (user && isSupabaseConfigured) {
            setLoadingBalance(true);
            paymentService.getWallet()
                .then(w => setBalance(Number(w?.current_balance) || 0))
                .catch(() => {})
                .finally(() => setLoadingBalance(false));
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-500 dark:text-gray-400">Please login to view your dashboard.</p>
            </div>
        );
    }

    const firstName = user?.name?.split(' ')[0] || 'Traveler';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'সুপ্রভাত' : hour < 18 ? 'শুভ বিকেল' : 'শুভ সন্ধ্যা';

    const stats = [
        { label: 'ইভেন্ট', enLabel: 'Upcoming Events', value: '0', icon: Calendar, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/30', path: '/events' },
        { label: 'ট্যুর প্ল্যান', enLabel: 'Tour Plans', value: '0', icon: Map, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-900/30', path: '/tour-plans' },
        { label: 'বুকিং ও ওয়ালেট', enLabel: 'Bookings & Wallet', value: loadingBalance ? '...' : `৳${balance.toLocaleString()}`, icon: Wallet, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', path: '/bookings' },
        { label: 'উইশলিস্ট', enLabel: 'Wishlist', value: '0', icon: Heart, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-900/30', path: '/wishlist' },
    ];

    const quickLinks = [
        { icon: Sparkles, label: language === 'bn' ? 'AI প্ল্যানার' : 'AI Planner', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/30', path: '/planner' },
        { icon: Map, label: language === 'bn' ? 'ট্যুর প্ল্যান' : 'Tour Plans', color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-900/30', path: '/tour-plans' },
        { icon: Calendar, label: language === 'bn' ? 'ইভেন্ট' : 'Events', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/30', path: '/events' },
        { icon: Users, label: language === 'bn' ? 'কমিউনিটি' : 'Community', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/30', path: '/community' },
        { icon: Video, label: language === 'bn' ? 'ভিডিও' : 'Videos', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/30', path: '/videos' },
    ];

    const activity = [
        { icon: MapPin, label: "Cox's Bazar Tour", sub: "#B8801 • 3 nights", badge: language === 'bn' ? 'নিশ্চিত' : 'Confirmed', badgeColor: 'text-emerald-600 dark:text-emerald-400', badgeBg: 'bg-emerald-50 dark:bg-emerald-900/30', path: '/bookings' },
        { icon: Map, label: "Sajek Valley Plan", sub: "Draft Itinerary", badge: language === 'bn' ? 'ড্রাফট' : 'Draft', badgeColor: 'text-amber-600 dark:text-amber-400', badgeBg: 'bg-amber-50 dark:bg-amber-900/30', path: '/tour-plans' },
        { icon: Heart, label: "Hotel Sea Palace", sub: language === 'bn' ? 'উইশলিস্টে যোগ' : 'Added to wishlist', badge: null, path: '/wishlist' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-[#050f08] pt-8 pb-20 transition-colors duration-300">
            <motion.div 
                className="max-w-[1140px] mx-auto px-4 sm:px-6 relative w-full"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* Decorative background blobs */}
                <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-lighten pointer-events-none"></div>
                <div className="absolute top-40 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-lighten pointer-events-none"></div>

                {/* ── HEADER ── */}
                <motion.div variants={itemVariants} className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">{greeting},</p>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white m-0 tracking-tight">{firstName}! <span className="inline-block animate-wave origin-[70%_70%]">👋</span></h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {language === 'bn' ? 'আপনার ভ্রমণ ওভারভিউ' : "Here's your travel overview"}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/profile')} className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-green-200 dark:border-green-800 hover:border-primary transition-colors shadow-sm bg-white dark:bg-slate-800">
                            {user?.avatar
                                ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                                : <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-lg font-black">{firstName[0]}</div>
                            }
                        </button>
                    </div>
                </motion.div>



                {/* ── STATS ROW ── */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {stats.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(i === 1 ? '/bookings' : i === 2 ? '/wishlist' : i === 3 ? '/profile' : '/tour-plans')}
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-gray-100 dark:border-slate-700/50 rounded-3xl p-5 text-left transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 group"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                                <s.icon size={24} className={s.color} />
                            </div>
                            <p className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1.5">{s.value}</p>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{language === 'bn' ? s.label : s.enLabel}</p>
                        </button>
                    ))}
                </motion.div>

                {/* ── CHART + QUICK LINKS ── */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mb-8">
                    {/* Chart */}
                    <motion.div variants={itemVariants} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white">{language === 'bn' ? 'ট্রিপ অ্যাক্টিভিটি' : 'Trip Activity'}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{language === 'bn' ? 'ভিউ ও প্ল্যান করা' : 'Tours viewed & planned'}</p>
                            </div>
                            <div className="flex bg-gray-100/80 dark:bg-slate-900/50 p-1 rounded-xl">
                                {['7D', '30D'].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPeriod(p)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            period === p 
                                            ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4">
                            <Sparkline data={chartData[period]} />
                        </div>
                        {period === '7D' && (
                            <div className="flex justify-between mt-3 px-1">
                                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                                    <span key={d} className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{d}</span>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div variants={itemVariants} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-5">{language === 'bn' ? 'দ্রুত যান' : 'Quick Go'}</h3>
                        <div className="space-y-1.5">
                            {quickLinks.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigate(q.path)}
                                    className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group"
                                >
                                    <div className={`w-10 h-10 rounded-xl ${q.bg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}>
                                        <q.icon size={18} className={q.color} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200 flex-1 text-left">{q.label}</span>
                                    <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── RECENT ACTIVITY ── */}
                <motion.div variants={itemVariants} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">{language === 'bn' ? 'সাম্প্রতিক কার্যক্রম' : 'Recent Activity'}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{language === 'bn' ? 'সর্বশেষ ভ্রমণ কার্যকলাপ' : 'Your latest travel actions'}</p>
                        </div>
                        <button onClick={() => navigate('/bookings')} className="flex items-center gap-1.5 text-sm font-bold text-primary hover:text-green-700 transition-colors">
                            {language === 'bn' ? 'সব দেখুন' : 'View all'} <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {activity.map((a, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(a.path)}
                                className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all hover:scale-[1.01] group border border-transparent hover:border-gray-100 dark:hover:border-slate-700"
                            >
                                <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                                    <a.icon size={22} className="text-primary" />
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-base font-bold text-gray-900 dark:text-white truncate">{a.label}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{a.sub}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    {a.badge && (
                                        <span className={`text-[11px] font-bold ${a.badgeColor} ${a.badgeBg} px-3 py-1 rounded-full uppercase tracking-wide shadow-sm`}>
                                            {a.badge}
                                        </span>
                                    )}
                                    <ChevronRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* ── BOTTOM STATS ── */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: TrendingUp, label: language === 'bn' ? 'ট্রাভেল স্ট্যাটস' : 'Travel Stats', value: '0 XP', color: 'text-primary', bg: 'bg-green-50 dark:bg-green-900/30', path: '/profile' },
                        { icon: MessageSquare, label: language === 'bn' ? 'আমার পোস্ট' : 'My Posts', value: '0', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/30', path: '/profile?tab=posts' },
                        { icon: Video, label: language === 'bn' ? 'আমার ভিডিও' : 'My Videos', value: '0', color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-900/30', path: '/profile?tab=videos' },
                        { icon: Award, label: language === 'bn' ? 'অর্জন' : 'Achievements', value: 'Newbie', color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/30', path: '/profile?tab=achievements' },
                    ].map((b, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(b.path)}
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-gray-100 dark:border-slate-700/50 rounded-3xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 group"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${b.bg} flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110`}>
                                <b.icon size={26} className={b.color} />
                            </div>
                            <p className="text-3xl font-black text-gray-900 dark:text-white leading-none mb-2">{b.value}</p>
                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{b.label}</p>
                        </button>
                    ))}
                </motion.div>

                {/* ── AI CHAT BAR ── */}
                <motion.div variants={itemVariants} className="sticky bottom-6 z-20">
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-2xl border border-gray-200/60 dark:border-slate-700/60 rounded-2xl p-2 flex items-center gap-3 shadow-2xl shadow-green-900/5 dark:shadow-black/40">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-green-700 flex items-center justify-center shrink-0 shadow-inner">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <input
                            type="text"
                            value={aiMsg}
                            onChange={e => setAiMsg(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && navigate('/planner')}
                            placeholder={language === 'bn' ? 'AI কে জিজ্ঞেস করুন... যেমন: "সাজেক ৩ দিনের প্ল্যান"' : 'Ask AI... e.g. "Plan 3 days in Cox\'s Bazar"'}
                            className="flex-1 bg-transparent border-none outline-none text-base text-gray-800 dark:text-white placeholder-gray-400 font-medium px-2"
                        />
                        <button
                            onClick={() => navigate('/planner')}
                            className="w-12 h-12 rounded-xl bg-gray-900 dark:bg-primary flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-transform shadow-md group"
                        >
                            <Send size={20} className="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </motion.div>
                
            </motion.div>
        </div>
    );
};

export default Dashboard;
