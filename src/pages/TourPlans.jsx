import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { Map, Calendar, Plus, Trash2, Save, Share2, Download, DollarSign, MapPin, Clock, FileText, MoreVertical, CheckCircle, GripVertical } from 'lucide-react';

const TourPlans = () => {
    const [activePlan, setActivePlan] = useState(null);
    const [showToast, setShowToast] = useState(null);

    // Mock Data
    const myPlans = [
        { id: 1, title: 'Sajek Valley Trip', date: '15-17 Dec 2025', duration: '3 Days', budget: 5000, status: 'Draft' },
        { id: 2, title: 'Sylhet Tea Gardens', date: '20-22 Jan 2026', duration: '3 Days', budget: 6500, status: 'Planned' },
    ];

    const itineraryData = [
        {
            day: 1,
            title: 'Journey & Arrival',
            activities: [
                { id: 1, time: '10:00 PM', title: 'Bus from Dhaka', type: 'Transport', cost: 800 },
                { id: 2, time: '07:00 AM', title: 'Breakfast at Khagrachari', type: 'Food', cost: 150 },
                { id: 3, time: '10:00 AM', title: 'Chander Gari to Sajek', type: 'Transport', cost: 300 },
            ]
        },
        {
            day: 2,
            title: 'Exploring Sajek',
            activities: [
                { id: 4, time: '05:30 AM', title: 'Sunrise at Helipad', type: 'Sightseeing', cost: 0 },
                { id: 5, time: '09:00 AM', title: 'Konglak Para Trek', type: 'Adventure', cost: 50 },
            ]
        }
    ];

    const handleAction = (action) => {
        setShowToast(action);
        setTimeout(() => setShowToast(null), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12 relative">
            <DashboardHeader title="Tour Plans" subtitle="Create & manage your perfect itinerary" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

                {!activePlan ? (
                    // Plan List View
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">My Itineraries</h2>
                            <button
                                onClick={() => setActivePlan({ id: 'new', title: 'New Trip' })}
                                className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg shadow-green-200"
                            >
                                <Plus size={20} /> Create New Plan
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myPlans.map(plan => (
                                <div key={plan.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer" onClick={() => setActivePlan(plan)}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-primary group-hover:text-white transition-colors">
                                            <Map size={24} />
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.title}</h3>
                                    <div className="space-y-2 text-sm text-gray-500 mb-6">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} /> {plan.date}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} /> {plan.duration}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={16} /> Est. Budget: ৳{plan.budget}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${plan.status === 'Draft' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'}`}>
                                            {plan.status}
                                        </span>
                                        <span className="text-primary text-sm font-bold group-hover:translate-x-1 transition-transform">
                                            Edit Plan &rarr;
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {/* AI Generator Card */}
                            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden group cursor-pointer">
                                <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-150 transition-transform duration-700">
                                    <Map size={150} />
                                </div>
                                <div>
                                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block border border-white/30">AI Powered</span>
                                    <h3 className="text-2xl font-bold mb-2">Auto-Generate Trip</h3>
                                    <p className="text-purple-100 text-sm">Let AI create the perfect itinerary based on your budget & interests.</p>
                                </div>
                                <button className="mt-6 bg-white text-purple-600 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2">
                                    Try AI Planner
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Itinerary Builder View
                    <div className="animate-fade-in">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <button onClick={() => setActivePlan(null)} className="text-gray-500 hover:text-gray-800 text-sm font-bold mb-2 flex items-center gap-1">
                                    &larr; Back to Plans
                                </button>
                                <h2 className="text-3xl font-bold text-gray-800">{activePlan.title}</h2>
                                <p className="text-gray-500 flex items-center gap-2 mt-1">
                                    <Calendar size={16} /> {activePlan.date || 'Set Date'} • 3 Days
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleAction('Saved')} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-50">
                                    <Save size={18} /> Save
                                </button>
                                <button onClick={() => handleAction('Exported PDF')} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-50">
                                    <Download size={18} /> PDF
                                </button>
                                <button onClick={() => handleAction('Shared')} className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700">
                                    <Share2 size={18} /> Share
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Itinerary Timeline */}
                            <div className="lg:col-span-2 space-y-6">
                                {itineraryData.map((day) => (
                                    <div key={day.day} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">Day {day.day}</span>
                                                {day.title}
                                            </h3>
                                            <button className="text-primary text-sm font-bold hover:underline">+ Add Activity</button>
                                        </div>

                                        <div className="space-y-4 relative pl-4 border-l-2 border-gray-100">
                                            {day.activities.map((activity) => (
                                                <div key={activity.id} className="relative pl-6 group">
                                                    {/* Timeline Dot */}
                                                    <div className="absolute -left-[21px] top-3 w-4 h-4 rounded-full bg-white border-2 border-primary"></div>

                                                    <div className="bg-gray-50 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 flex justify-between items-center group cursor-move">
                                                        <div className="flex items-center gap-4">
                                                            <GripVertical className="text-gray-300 cursor-move" size={20} />
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-500 mb-1">{activity.time}</p>
                                                                <h4 className="font-bold text-gray-800">{activity.title}</h4>
                                                                <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 mt-1 inline-block">
                                                                    {activity.type}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-gray-800">৳{activity.cost}</p>
                                                            <button className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-bold hover:border-primary hover:text-primary hover:bg-green-50 transition-all flex items-center justify-center gap-2">
                                    <Plus size={20} /> Add Another Day
                                </button>
                            </div>

                            {/* Sidebar: Budget & Notes */}
                            <div className="space-y-6">
                                {/* Budget Tracker */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <DollarSign className="text-primary" size={20} /> Budget Tracker
                                    </h3>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Transport</span>
                                            <span className="font-bold">৳1,100</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Food</span>
                                            <span className="font-bold">৳150</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Activities</span>
                                            <span className="font-bold">৳50</span>
                                        </div>
                                        <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span className="text-primary">৳1,300</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                        <div className="bg-primary h-2 rounded-full" style={{ width: '26%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 text-center">26% of ৳5,000 budget used</p>
                                </div>

                                {/* Notes */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <FileText className="text-yellow-500" size={20} /> Trip Notes
                                    </h3>
                                    <textarea
                                        className="w-full h-32 p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                                        placeholder="Don't forget to pack sunscreen and power bank..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce-in z-50">
                    <CheckCircle className="text-green-400" size={24} />
                    <div>
                        <h4 className="font-bold">Success</h4>
                        <p className="text-xs text-gray-400">Itinerary {showToast} successfully.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TourPlans;
