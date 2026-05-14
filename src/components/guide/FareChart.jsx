import React, { useState, useEffect } from 'react';
import { FARES, DISTRICTS } from '../../data/madventure-data';
import { Search, MapPin, AlertCircle, WifiOff, Flag } from 'lucide-react';

const FareChart = () => {
    const [selectedDistrict, setSelectedDistrict] = useState('cox-bazar');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('স্থলপথ');
    const [isOffline, setIsOffline] = useState(false);

    // Mock testing offline availability
    useEffect(() => {
        const handleOffline = () => setIsOffline(true);
        const handleOnline = () => setIsOffline(false);
        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);
        if (!navigator.onLine) setIsOffline(true);
        
        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    const districtFares = FARES[selectedDistrict] || { "স্থলপথ": [], "নৌপথ": [], "আকাশপথ": [] };
    const tabFares = districtFares[activeTab] || [];

    const filteredFares = tabFares.filter(fare => 
        (fare.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fare.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fare.vehicle.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header section */}
            <div className="bg-[#1B5E20] p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-1">লোকাল ভাড়া গাইড (Fare Chart)</h2>
                    <p className="text-sm opacity-90">অযথা ভাড়া বেশি দেওয়া থেকে বাঁচতে লোকাল ভাড়ার তালিকাটি দেখুন।</p>
                </div>
                
                {isOffline ? (
                    <div className="flex items-center gap-2 bg-yellow-500/20 text-yellow-300 px-3 py-1.5 rounded-full text-xs font-bold border border-yellow-500/30">
                        <WifiOff size={14} /> এই তথ্য offline-এ পাওয়া যাচ্ছে
                    </div>
                ) : (
                    <div className="bg-white/20 px-4 py-2 rounded-xl flex items-center gap-2 border border-white/30 backdrop-blur-sm">
                        <MapPin size={18} />
                        <select 
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="bg-transparent text-white font-bold outline-none cursor-pointer"
                        >
                            {DISTRICTS.map(d => (
                                <option key={d.id} value={d.id} className="text-gray-800">{d.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="p-6">
                {/* Search & Tabs */}
                <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6 border-b border-gray-100 pb-4">
                    {/* Tabs */}
                    <div className="flex gap-2 bg-gray-50 p-1 rounded-lg w-fit">
                        {['স্থলপথ', 'নৌপথ', 'আকাশপথ'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === tab ? 'bg-white text-primary shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative max-w-sm w-full">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="যানবাহন বা রুট খুঁজতে লিখুন..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-primary outline-none focus:ring-2 focus:ring-green-50"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto mb-6">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-500 text-sm">
                                <th className="py-3 font-medium">রুট (কোথা থেকে — কোথায়)</th>
                                <th className="py-3 font-medium">যানবাহন</th>
                                <th className="py-3 font-medium text-right">ভাড়া (৳)</th>
                                <th className="py-3 font-medium text-right hidden sm:table-cell">সময়</th>
                                <th className="py-3 font-medium pl-6">টিপস / নোট</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
                            {filteredFares.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500">
                                        এই রুটে কোন তথ্য পাওয়া যায়নি।
                                    </td>
                                </tr>
                            ) : (
                                filteredFares.map((fare, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 font-bold flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                                            <span>{fare.from}</span> <span className="text-gray-400 hidden md:inline">→</span> <span className="text-xs text-gray-400 md:hidden">থেকে</span> <span>{fare.to}</span>
                                        </td>
                                        <td className="py-4 text-orange-600 font-medium">{fare.vehicle}</td>
                                        <td className="py-4 text-right font-bold text-[#1B5E20]">
                                            {fare.minFare === fare.maxFare ? `৳${fare.minFare}` : `৳${fare.minFare} - ৳${fare.maxFare}`}
                                        </td>
                                        <td className="py-4 text-right text-gray-500 hidden sm:table-cell">{fare.duration || 'প্রযোজ্য নয়'}</td>
                                        <td className="py-4 pl-6 text-xs text-gray-500 italic max-w-[200px]">{fare.note || '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Collapsible Tips */}
                    <details className="bg-orange-50 border border-orange-100 rounded-xl group overflow-hidden">
                        <summary className="p-4 font-bold text-orange-800 cursor-pointer flex items-center gap-2 list-none">
                            <AlertCircle size={18} /> দরকষাকষির টিপস
                            <span className="ml-auto transform transition-transform group-open:rotate-180">▾</span>
                        </summary>
                        <div className="p-4 pt-0 text-sm text-orange-700 leading-relaxed border-t border-orange-100/50 mt-2">
                            <ul className="list-disc pl-5 space-y-1">
                                <li>গাড়িতে ওঠার আগেই ভাড়া ঠিক করে নিন।</li>
                                <li>সিজনাল সময়ে (ডিসেম্বর-জানুয়ারি) ভাড়া কিছুটা বেশি চাইতে পারে।</li>
                                <li>মিটার বা লোকাল নির্দেশিত রেট দেখার চেষ্টা করুন।</li>
                            </ul>
                        </div>
                    </details>
                    
                    {/* Report Button */}
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm mb-1">ভাড়া কি ভুল?</h4>
                            <p className="text-xs text-gray-500">লোকাল সঠিক ভাড়ার তথ্য দিয়ে আমাদের সাহায্য করুন।</p>
                        </div>
                        <button className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-lg text-sm font-bold text-gray-600 hover:border-gray-400 transition-colors">
                            <Flag size={16} /> রিপোর্ট করুন
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FareChart;
