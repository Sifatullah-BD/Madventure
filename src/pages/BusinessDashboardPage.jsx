import React, { useState, useEffect } from 'react';
import { BarChart3, ShoppingBag, Star, Eye, TrendingUp, Calendar, Users, CheckCircle, XCircle, Clock, MessageSquare, Settings, Plus, ArrowUpRight } from 'lucide-react';
import { businessService } from '../services/businessService';
import { sampleBusinesses, sampleListings, sampleReviews } from '../data/businessData';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import BusinessReviewCard from '../components/business/BusinessReviewCard';

// Use first business as demo owner
const DEMO_BUSINESS = sampleBusinesses[0];

const StatCard = ({ icon: Icon, label, value, change, color }) => (
    <div className="bg-white dark:bg-surface p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={20} />
            </div>
            {change && (
                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <ArrowUpRight size={10} /> {change}
                </span>
            )}
        </div>
        <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
);

const BusinessDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const biz = DEMO_BUSINESS;

    useEffect(() => {
        businessService.getBusinessStats(biz.id).then(setStats);
    }, []);

    const myListings = sampleListings.filter(l => l.businessId === biz.id);
    const myReviews = sampleReviews.filter(r => r.businessId === biz.id);

    const tabs = [
        { id: 'overview', label: 'ওভারভিউ', icon: BarChart3 },
        { id: 'listings', label: 'তালিকা', icon: ShoppingBag },
        { id: 'bookings', label: 'বুকিং', icon: Calendar },
        { id: 'reviews', label: 'রিভিউ', icon: Star },
        { id: 'settings', label: 'সেটিংস', icon: Settings },
    ];

    // Mock bookings for demo
    const mockBookings = [
        { id: 'bk-1', listing: 'Deluxe Sea View Room', guest: 'আরিফ হোসেন', phone: '+880 1712-345678', checkIn: '2026-04-15', checkOut: '2026-04-17', guests: 2, total: 11000, status: 'PENDING' },
        { id: 'bk-2', listing: 'Premium Suite', guest: 'নুসরাত ফারিয়া', phone: '+880 1856-789012', checkIn: '2026-04-20', checkOut: '2026-04-22', guests: 3, total: 24000, status: 'CONFIRMED' },
        { id: 'bk-3', listing: 'Deluxe Sea View Room', guest: 'রাকিব হাসান', phone: '+880 1911-234567', checkIn: '2026-04-18', checkOut: '2026-04-19', guests: 2, total: 5500, status: 'CANCELLED' },
    ];

    const statusStyles = {
        PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        CONFIRMED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    const statusLabels = { PENDING: 'অপেক্ষমাণ', CONFIRMED: 'নিশ্চিত', CANCELLED: 'বাতিল' };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <DashboardHeader
                title={`${biz.name} — ড্যাশবোর্ড`}
                subtitle="আপনার ব্যবসার পরিসংখ্যান ও ব্যবস্থাপনা"
            />

            <div className="max-w-[1140px] mx-auto px-4 pb-12">
                {/* Tabs */}
                <div className="flex gap-1 mb-8 overflow-x-auto pb-2 no-scrollbar bg-white dark:bg-surface p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                                activeTab === tab.id
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && stats && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard icon={ShoppingBag} label="মোট বুকিং" value={stats.totalBookings} change="+12%" color="bg-blue-100 dark:bg-blue-900/30 text-blue-600" />
                            <StatCard icon={TrendingUp} label="মোট আয়" value={`৳${stats.revenue.toLocaleString()}`} change="+8%" color="bg-green-100 dark:bg-green-900/30 text-green-600" />
                            <StatCard icon={Star} label="গড় রেটিং" value={stats.avgRating} color="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600" />
                            <StatCard icon={Eye} label="মোট ভিউ" value={stats.totalViews.toLocaleString()} change="+23%" color="bg-purple-100 dark:bg-purple-900/30 text-purple-600" />
                        </div>

                        {/* Monthly Chart (Simple Bar) */}
                        <div className="bg-white dark:bg-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">মাসিক বুকিং</h3>
                            <div className="flex items-end gap-2 h-40">
                                {['জানু', 'ফেব', 'মার্চ', 'এপ্রি', 'মে', 'জুন', 'জুলা', 'আগ', 'সেপ', 'অক্টো', 'নভে', 'ডিসে'].map((month, i) => {
                                    const val = stats.monthlyBookings[i];
                                    const maxVal = Math.max(...stats.monthlyBookings);
                                    const height = (val / maxVal) * 100;
                                    return (
                                        <div key={month} className="flex-1 flex flex-col items-center gap-1">
                                            <span className="text-[10px] text-gray-500 font-bold">{val}</span>
                                            <div
                                                className="w-full bg-primary/20 rounded-t-lg relative group cursor-pointer hover:bg-primary/30 transition-colors"
                                                style={{ height: `${height}%` }}
                                            >
                                                <div className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all" style={{ height: '60%' }} />
                                            </div>
                                            <span className="text-[9px] text-gray-400">{month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Listings Tab */}
                {activeTab === 'listings' && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">আপনার তালিকা ({myListings.length})</h3>
                            <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1 hover:bg-green-700 transition-colors">
                                <Plus size={16} /> নতুন যোগ করুন
                            </button>
                        </div>
                        {myListings.map(listing => (
                            <div key={listing.id} className="bg-white dark:bg-surface p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
                                {listing.images?.[0] && (
                                    <img src={listing.images[0]} alt={listing.title} className="w-full md:w-32 h-24 rounded-xl object-cover flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-bold text-gray-800 dark:text-white">{listing.title}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{listing.description}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${listing.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {listing.availability ? 'উপলব্ধ' : 'অনুপলব্ধ'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-3">
                                        <span className="text-primary font-bold">৳{listing.price.toLocaleString()}/{listing.priceUnit === 'per_night' ? 'রাত' : 'জন'}</span>
                                        <span className="text-xs text-gray-400"><Users size={12} className="inline mr-1" /> সর্বোচ্চ {listing.maxGuests} জন</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bookings Tab */}
                {activeTab === 'bookings' && (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">বুকিং রিকোয়েস্ট</h3>
                        {mockBookings.map(booking => (
                            <div key={booking.id} className="bg-white dark:bg-surface p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h4 className="font-bold text-gray-800 dark:text-white">{booking.listing}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{booking.guest} • {booking.phone}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            <Calendar size={12} className="inline mr-1" /> {booking.checkIn} → {booking.checkOut} • {booking.guests} জন
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-primary">৳{booking.total.toLocaleString()}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[booking.status]}`}>
                                            {statusLabels[booking.status]}
                                        </span>
                                    </div>
                                </div>
                                {booking.status === 'PENDING' && (
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <button className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-green-600 transition-colors">
                                            <CheckCircle size={14} /> নিশ্চিত করুন
                                        </button>
                                        <button className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-red-100 transition-colors">
                                            <XCircle size={14} /> বাতিল
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">গ্রাহক রিভিউ ({myReviews.length})</h3>
                        {myReviews.length > 0 ? (
                            myReviews.map(r => <BusinessReviewCard key={r.id} review={r} />)
                        ) : (
                            <p className="text-gray-500 text-center py-8">এখনো কোনো রিভিউ আসেনি।</p>
                        )}
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="animate-fade-in">
                        <div className="bg-white dark:bg-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-xl">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">ব্যবসার তথ্য সম্পাদনা</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">ব্যবসার নাম</label>
                                    <input type="text" defaultValue={biz.name} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">বিবরণ</label>
                                    <textarea defaultValue={biz.description} rows={3} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">ফোন</label>
                                    <input type="tel" defaultValue={biz.phone} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                </div>
                                <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 transition-colors">
                                    সংরক্ষণ করুন
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusinessDashboardPage;
