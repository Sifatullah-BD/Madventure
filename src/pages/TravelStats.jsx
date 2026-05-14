import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { Award, Map, Globe, Clock, TrendingUp, Share2, Leaf, DollarSign, Camera, Mountain, Tent, Building } from 'lucide-react';

const TravelStats = () => {
    const [showShareModal, setShowShareModal] = useState(false);

    const stats = [
        { label: 'Total Trips', value: '12', icon: <Map className="text-blue-500" />, color: 'bg-blue-50' },
        { label: 'Distance', value: '3,450 km', icon: <TrendingUp className="text-green-500" />, color: 'bg-green-50' },
        { label: 'Countries', value: '4', icon: <Globe className="text-purple-500" />, color: 'bg-purple-50' },
        { label: 'Travel Hours', value: '142h', icon: <Clock className="text-orange-500" />, color: 'bg-orange-50' },
        { label: 'Budget Spent', value: '৳ 45,000', icon: <DollarSign className="text-emerald-500" />, color: 'bg-emerald-50' },
        { label: 'Eco Score', value: '85/100', icon: <Leaf className="text-teal-500" />, color: 'bg-teal-50' },
    ];

    const [badges, setBadges] = useState([
        { name: 'Explorer', icon: '🌍', desc: 'Visited 5 cities', unlocked: true },
        { name: 'Mountain Lover', icon: '🏔️', desc: 'Summit 3 peaks', unlocked: true },
        { name: 'Beach Hunter', icon: '🏖️', desc: 'Visit 3 beaches', unlocked: true },
        { name: 'City Roamer', icon: '🏙️', desc: 'Explore 5 capitals', unlocked: true },
        { name: 'Foodie', icon: '🍜', desc: 'Try 10 local dishes', unlocked: false },
        { name: 'Globetrotter', icon: '✈️', desc: 'Visit 10 countries', unlocked: false },
        { name: 'Solo Traveler', icon: '🎒', desc: 'First solo trip', unlocked: false },
        { name: 'Photographer', icon: '📸', desc: 'Upload 100 photos', unlocked: false },
    ]);

    useEffect(() => {
        // In a real app, we would fetch from supabase here:
        // const fetchBadges = async () => {
        //     const { data } = await supabase.from('user_badges').select('*, badges(*)').eq('user_id', user.id);
        //     if(data) setBadges(formatBadges(data));
        // };
    }, []);

    const travelStyles = [
        { label: 'Backpacking', percentage: 40, color: 'bg-orange-500' },
        { label: 'Luxury', percentage: 10, color: 'bg-purple-500' },
        { label: 'Group Tour', percentage: 30, color: 'bg-blue-500' },
        { label: 'Solo Travel', percentage: 20, color: 'bg-green-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <DashboardHeader title="Travel Stats" subtitle="Your Achievements & Milestones" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

                {/* Level Progress */}
                <div className="bg-white rounded-2xl p-8 shadow-sm mb-8 border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row justify-between items-end mb-6 relative z-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Level 3</span>
                                <span className="text-gray-400 text-sm">Next: Globetrotter</span>
                            </div>
                            <h2 className="text-4xl font-black text-gray-800 mb-1">Pro Traveler</h2>
                            <p className="text-gray-500">You are in the top 15% of travelers!</p>
                        </div>
                        <div className="text-right mt-4 md:mt-0">
                            <p className="text-3xl font-bold text-primary">2,450 <span className="text-sm text-gray-400 font-normal">XP</span></p>
                            <p className="text-xs text-gray-400">550 XP to Level 4</p>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                            <span>Level 1</span>
                            <span>Level 2</span>
                            <span>Level 3</span>
                            <span>Level 4</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full relative" style={{ width: '75%' }}>
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Stats Grid */}
                    <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all hover:-translate-y-1">
                                <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center mb-3`}>
                                    {stat.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Travel Style Breakdown */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Tent size={20} className="text-orange-500" /> Travel Style
                        </h3>
                        <div className="space-y-6">
                            {travelStyles.map((style, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700">{style.label}</span>
                                        <span className="font-bold text-gray-900">{style.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                        <div className={`h-full rounded-full ${style.color}`} style={{ width: `${style.percentage}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-4 bg-gray-50 rounded-xl text-center">
                            <p className="text-xs text-gray-500 mb-1">Most dominant style</p>
                            <p className="font-bold text-primary">Backpacking</p>
                        </div>
                    </div>
                </div>

                {/* Badges */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Award className="text-yellow-500" /> Badges Earned
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">Collect badges by completing trips and challenges</p>
                        </div>
                        <button
                            onClick={() => setShowShareModal(true)}
                            className="text-primary text-sm font-bold flex items-center gap-2 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors border border-primary/20"
                        >
                            <Share2 size={16} /> Share Achievements
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {badges.map((badge, idx) => (
                            <div key={idx} className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all group relative overflow-hidden ${badge.unlocked ? 'border-yellow-100 bg-gradient-to-b from-yellow-50/50 to-white hover:border-yellow-300' : 'border-gray-100 bg-gray-50 opacity-60 grayscale'}`}>
                                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{badge.icon}</div>
                                <h4 className="font-bold text-gray-800 text-sm mb-1 leading-tight">{badge.name}</h4>
                                <p className="text-[10px] text-gray-500 leading-tight">{badge.desc}</p>
                                {badge.unlocked && <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full shadow-sm"></div>}
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Share Modal Mock */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                <Share2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Share Your Success!</h3>
                            <p className="text-gray-500 text-sm mt-2">Show off your "Pro Traveler" status to your friends.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <button className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white"><Globe size={20} /></div>
                                <span className="text-xs font-medium">Facebook</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white"><Camera size={20} /></div>
                                <span className="text-xs font-medium">Instagram</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white"><Share2 size={20} /></div>
                                <span className="text-xs font-medium">Twitter</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowShareModal(false)}
                            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TravelStats;
