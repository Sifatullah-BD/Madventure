import React, { useState } from 'react';
import {
    LayoutDashboard, List, ShoppingBag, Wallet, Star, ShieldCheck,
    Bell, Settings, LogOut, Plus, Check, X, ChevronRight, DollarSign,
    Users, Calendar, MapPin, Image as ImageIcon, TrendingUp, Megaphone, Eye, MousePointer
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PartnerDashboard = () => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [partnerType, setPartnerType] = useState('Hotel'); // Toggle: Hotel / Guide

    // Mock Data
    const stats = {
        todayBooking: 12,
        checkIn: 5,
        earnings: 25000,
        pendingPayout: 4500,
        occupancy: 85,
        rating: 4.8,
        views: 1250,
        clicks: 340
    };

    const bookings = [
        { id: '#BK1023', guest: 'Rahim Uddin', service: 'Deluxe Room (2 Nights)', date: '12 Dec - 14 Dec', status: 'Pending', price: 8000 },
        { id: '#BK1022', guest: 'Karim Hasan', service: 'Family Suite (1 Night)', date: '12 Dec - 13 Dec', status: 'Confirmed', price: 5000 },
        { id: '#BK1021', guest: 'Sarah Khan', service: 'Couple Package', date: '10 Dec', status: 'Completed', price: 3000 },
    ];

    const listings = [
        { id: 1, title: 'Ocean View Deluxe', price: 4000, status: 'Active', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
        { id: 2, title: 'Mountain Suite', price: 6000, status: 'Booked', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    ];

    const reviews = [
        { id: 1, user: 'John Doe', rating: 5, comment: 'Amazing experience! The view was breathtaking.', date: '2 days ago' },
        { id: 2, user: 'Jane Smith', rating: 4, comment: 'Good service but room service was a bit slow.', date: '1 week ago' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <div className="space-y-6 animate-fade-in">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-gray-500 text-sm">Today's Revenue</p>
                                        <h3 className="text-2xl font-bold text-gray-800">৳{stats.earnings}</h3>
                                    </div>
                                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                        <DollarSign size={20} />
                                    </div>
                                </div>
                                <div className="text-xs text-green-600 flex items-center gap-1">
                                    <span className="font-bold">+12%</span> from yesterday
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-gray-500 text-sm">New Requests</p>
                                        <h3 className="text-2xl font-bold text-gray-800">{stats.todayBooking}</h3>
                                    </div>
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                        <ShoppingBag size={20} />
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {stats.checkIn} check-ins today
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-gray-500 text-sm">Total Views</p>
                                        <h3 className="text-2xl font-bold text-gray-800">{stats.views}</h3>
                                    </div>
                                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                        <Eye size={20} />
                                    </div>
                                </div>
                                <div className="text-xs text-green-600 flex items-center gap-1">
                                    <span className="font-bold">+5%</span> this week
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-gray-500 text-sm">Review Score</p>
                                        <h3 className="text-2xl font-bold text-gray-800">{stats.rating}</h3>
                                    </div>
                                    <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                                        <Star size={20} />
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                    Based on 120 reviews
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity / Pending Requests */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800">New Booking Requests</h3>
                                <button className="text-primary text-sm font-medium hover:underline">View All</button>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {bookings.filter(b => b.status === 'Pending').map((booking) => (
                                    <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                                {booking.guest[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{booking.guest}</h4>
                                                <p className="text-sm text-gray-500">{booking.service} • {booking.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-gray-800 mr-4">৳{booking.price}</span>
                                            <button className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Decline">
                                                <X size={18} />
                                            </button>
                                            <button className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Accept">
                                                <Check size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'Listings':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">My Listings</h2>
                            <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors">
                                <Plus size={18} /> Add New
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {listings.map(item => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                                    <div className="h-48 overflow-hidden relative">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                                        <p className="text-primary font-bold">৳{item.price} <span className="text-gray-400 text-xs font-normal">/ night</span></p>
                                        <div className="mt-4 flex gap-2">
                                            <button className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Edit</button>
                                            <button className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Calendar</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'Orders':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-800">Booking Management</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 font-semibold text-gray-600">Order ID</th>
                                        <th className="p-4 font-semibold text-gray-600">Guest</th>
                                        <th className="p-4 font-semibold text-gray-600">Service</th>
                                        <th className="p-4 font-semibold text-gray-600">Date</th>
                                        <th className="p-4 font-semibold text-gray-600">Status</th>
                                        <th className="p-4 font-semibold text-gray-600">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-medium text-gray-800">{booking.id}</td>
                                            <td className="p-4">{booking.guest}</td>
                                            <td className="p-4 text-sm text-gray-600">{booking.service}</td>
                                            <td className="p-4 text-sm text-gray-600">{booking.date}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                    booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {booking.status === 'Confirmed' && (
                                                    <button className="text-primary text-sm font-bold hover:underline">Check-in</button>
                                                )}
                                                {booking.status === 'Pending' && (
                                                    <div className="flex gap-2">
                                                        <button className="text-green-600 hover:bg-green-50 p-1 rounded"><Check size={16} /></button>
                                                        <button className="text-red-600 hover:bg-red-50 p-1 rounded"><X size={16} /></button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'Wallet':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-800">Wallet & Finance</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-2xl shadow-lg">
                                <p className="text-gray-400 mb-2">Total Earnings</p>
                                <h3 className="text-4xl font-bold mb-6">৳{stats.earnings}</h3>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-gray-400 text-sm">Pending Payout</p>
                                        <p className="font-bold text-xl">৳{stats.pendingPayout}</p>
                                    </div>
                                    <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition-colors">
                                        Withdraw
                                    </button>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4">Commission Breakdown</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Total Booking Value</span>
                                        <span className="font-bold">৳30,000</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Platform Fee (10%)</span>
                                        <span className="text-red-500 font-bold">- ৳3,000</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax & VAT</span>
                                        <span className="text-red-500 font-bold">- ৳2,000</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                        <span>Net Earnings</span>
                                        <span className="text-green-600">৳25,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'Reviews':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-800">Guest Reviews</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {reviews.map(review => (
                                <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                                {review.user[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{review.user}</h4>
                                                <p className="text-xs text-gray-500">{review.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star size={16} fill="currentColor" />
                                            <span className="font-bold">{review.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 pl-14">"{review.comment}"</p>
                                    <div className="pl-14 mt-3">
                                        <button className="text-primary text-sm font-bold hover:underline">Reply</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'Promote':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="text-center mb-8">
                            <Megaphone size={48} className="mx-auto text-primary mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800">Boost Your Visibility</h2>
                            <p className="text-gray-500">Reach more customers by promoting your listings.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-primary transition-colors cursor-pointer">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Starter Boost</h3>
                                <p className="text-3xl font-bold text-primary mb-4">৳500<span className="text-sm text-gray-400 font-normal">/day</span></p>
                                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                                    <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> Top of search results</li>
                                    <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> "Featured" badge</li>
                                </ul>
                                <button className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg font-bold hover:bg-primary hover:text-white transition-colors">Select Plan</button>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-primary transform scale-105 relative">
                                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Pro Growth</h3>
                                <p className="text-3xl font-bold text-primary mb-4">৳1200<span className="text-sm text-gray-400 font-normal">/3 days</span></p>
                                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                                    <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> Homepage spotlight</li>
                                    <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> Email newsletter feature</li>
                                    <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> 2x Views Guarantee</li>
                                </ul>
                                <button className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-green-700 transition-colors">Select Plan</button>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-primary transition-colors cursor-pointer">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Premium</h3>
                                <p className="text-3xl font-bold text-primary mb-4">৳2500<span className="text-sm text-gray-400 font-normal">/week</span></p>
                                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                                    <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> All Pro features</li>
                                    <li className="flex items-center gap-2"><Check size={16} className="text-green-500" /> Social media promotion</li>
                                </ul>
                                <button className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg font-bold hover:bg-primary hover:text-white transition-colors">Select Plan</button>
                            </div>
                        </div>
                    </div>
                );

            case 'Verification':
                return (
                    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
                        <div className="text-center mb-8">
                            <ShieldCheck size={48} className="mx-auto text-primary mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800">Verification Center</h2>
                            <p className="text-gray-500">Submit your documents to get the "Verified Partner" badge.</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">Required Documents</h3>
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
                                    <ImageIcon className="mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm font-medium text-gray-600">Upload Trade License / NID</p>
                                    <p className="text-xs text-gray-400">JPG, PNG or PDF (Max 5MB)</p>
                                </div>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
                                    <ImageIcon className="mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm font-medium text-gray-600">Upload Property Ownership Proof</p>
                                    <p className="text-xs text-gray-400">JPG, PNG or PDF (Max 5MB)</p>
                                </div>
                            </div>
                            <button className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors">
                                Submit for Review
                            </button>
                        </div>
                    </div>
                );

            case 'Settings':
                return (
                    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Agency Profile Setup</h2>
                                <p className="text-gray-500">Manage your public profile information</p>
                            </div>
                            <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors">
                                Save Changes
                            </button>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
                            {/* Basic Info */}
                            <section>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Basic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 flex items-center gap-6">
                                        <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer transition-colors">
                                            <ImageIcon className="text-gray-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">Agency Logo</h4>
                                            <p className="text-sm text-gray-500 mb-2">Recommended size: 500x500px</p>
                                            <button className="text-primary text-sm font-bold hover:underline">Upload New</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Agency Name</label>
                                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" defaultValue="Green Leaf Travels" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" defaultValue="Explore the world with nature's touch" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-32" defaultValue="Green Leaf Travels is a premier travel agency..." />
                                    </div>
                                </div>
                            </section>

                            {/* Contact Info */}
                            <section>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" defaultValue="info@greenleaf.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" defaultValue="+880 1712 345678" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                                        <input type="url" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" defaultValue="www.greenleaf.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Page</label>
                                        <input type="url" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="https://facebook.com/..." />
                                    </div>
                                </div>
                            </section>

                            {/* Location */}
                            <section>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Location</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" defaultValue="Gulshan 2, Dhaka" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" defaultValue="Dhaka" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" defaultValue="Bangladesh" />
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                );

            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">P</div>
                        <span className="font-bold text-xl text-gray-800">Partner<span className="text-primary">Panel</span></span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {[
                        { id: 'Overview', icon: LayoutDashboard, label: 'Overview' },
                        { id: 'Listings', icon: List, label: 'My Listings' },
                        { id: 'Orders', icon: ShoppingBag, label: 'Orders' },
                        { id: 'Wallet', icon: Wallet, label: 'Wallet & Payouts' },
                        { id: 'Reviews', icon: Star, label: 'Reviews' },
                        { id: 'Promote', icon: Megaphone, label: 'Promote' },
                        { id: 'Verification', icon: ShieldCheck, label: 'Verification' },
                        { id: 'Settings', icon: Settings, label: 'Agency Setup' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                                ? 'bg-primary/10 text-primary'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
                    <h1 className="text-xl font-bold text-gray-800">{activeTab}</h1>
                    <div className="flex items-center gap-4">
                        {/* Demo Toggle */}
                        <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-medium">
                            <button
                                onClick={() => setPartnerType('Hotel')}
                                className={`px-3 py-1 rounded-md transition-all ${partnerType === 'Hotel' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
                            >
                                Hotel
                            </button>
                            <button
                                onClick={() => setPartnerType('Guide')}
                                className={`px-3 py-1 rounded-md transition-all ${partnerType === 'Guide' ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
                            >
                                Guide
                            </button>
                        </div>

                        <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" />
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-6 max-w-7xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default PartnerDashboard;
