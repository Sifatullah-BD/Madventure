import React, { useState, useEffect } from 'react';
import { RESTAURANTS, DISTRICTS } from '../../data/madventure-data';
import { MapPin, Search, Star, Phone, Navigation, ShieldCheck, Clock, Navigation2, CheckCircle2 } from 'lucide-react';

const FoodFinder = () => {
    const [districtId, setDistrictId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        halal: false,
        verified: false,
        under300: false,
        openNow: false
    });
    const [sortBy, setSortBy] = useState('rating'); // rating | price | distance
    const [isLocating, setIsLocating] = useState(false);

    // Filter Logic
    let filteredRestaurants = RESTAURANTS;
    
    if (districtId) {
        filteredRestaurants = filteredRestaurants.filter(r => r.districtId === districtId);
    }
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filteredRestaurants = filteredRestaurants.filter(r => 
            r.name.toLowerCase().includes(q) || 
            r.cuisine.some(c => c.toLowerCase().includes(q)) ||
            (r.specialDish && r.specialDish.toLowerCase().includes(q))
        );
    }
    if (filters.halal) filteredRestaurants = filteredRestaurants.filter(r => r.isHalal);
    if (filters.verified) filteredRestaurants = filteredRestaurants.filter(r => r.isVerified);
    if (filters.under300) {
        // Simple mock parse, in real app we check min price
        filteredRestaurants = filteredRestaurants.filter(r => r.priceRange.includes('150') || r.priceRange.includes('200'));
    }

    // Sort Logic
    if (sortBy === 'rating') {
        filteredRestaurants.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price') {
        // Mock price sorting assumption based on string length/value
        filteredRestaurants.sort((a, b) => a.priceRange.localeCompare(b.priceRange));
    }

    const toggleFilter = (key) => setFilters(prev => ({ ...prev, [key]: !prev[key] }));

    const handleUseLocation = () => {
        setIsLocating(true);
        // Simulate geolocation resolving nearest district
        setTimeout(() => {
            setDistrictId('cox-bazar'); // Mock fallback to Cox's Bazar locally
            setIsLocating(false);
        }, 1500);
    };

    return (
        <div className="bg-gray-50 rounded-2xl min-h-screen pb-12">
            {/* Header Area */}
            <div className="bg-gradient-to-r from-orange-500 to-[#1B5E20] p-8 text-white rounded-t-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2 flex items-center gap-2"><MapPin/> হালাল ও মানসম্পন্ন খাবার</h2>
                    <p className="opacity-90 max-w-2xl text-sm md:text-base">কোথায় কি খাবেন তা নিয়ে যেন ভাবতে না হয়। লোকাল জনপ্রিয়, পরিষ্কার এবং হালাল সার্টিফাইড রেস্তোরাঁ খুঁজুন আপনার আশেপাশে।</p>
                    
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text"
                                placeholder="খাবারের নাম (যেমন: ইলিশ) বা রেস্তোরাঁ..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 outline-none focus:ring-4 focus:ring-orange-300 transition-all font-medium"
                            />
                        </div>
                        <button 
                            onClick={handleUseLocation}
                            disabled={isLocating}
                            className="bg-white/20 hover:bg-white/30 border border-white/40 px-6 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            {isLocating ? <span className="animate-spin">⏳</span> : <Navigation2 size={18}/>}
                            {isLocating ? 'খুঁজছি...' : 'আমার অবস্থান ব্যবহার করুন'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-8">
                {/* Advanced Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <select 
                            value={districtId} 
                            onChange={e => setDistrictId(e.target.value)}
                            className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg font-semibold text-gray-700 outline-none"
                        >
                            <option value="">সব জেলা</option>
                            {DISTRICTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg font-semibold text-gray-700 outline-none"
                        >
                            <option value="rating">রেটিং (বেশি থেকে কম)</option>
                            <option value="price">খরচ (কম থেকে বেশি)</option>
                            <option value="distance">কাছাকাছি দূরত্ব</option>
                        </select>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <FilterChip label="হালাল ✓" active={filters.halal} onClick={() => toggleFilter('halal')} />
                        <FilterChip label="Verified" active={filters.verified} onClick={() => toggleFilter('verified')} icon={<ShieldCheck size={14}/>} />
                        <FilterChip label="৳ ৩০০ এর নিচে" active={filters.under300} onClick={() => toggleFilter('under300')} />
                        <FilterChip label="এখন খোলা" active={filters.openNow} onClick={() => toggleFilter('openNow')} icon={<Clock size={14}/>} />
                    </div>
                </div>

                {/* Restaurant Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRestaurants.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
                            কোন রেস্তোরাঁ পাওয়া যায়নি। ফিল্টার পরিবর্তন করে দেখুন।
                        </div>
                    ) : (
                        filteredRestaurants.map(rest => (
                            <RestaurantCard key={rest.id} data={rest} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const FilterChip = ({ label, active, onClick, icon }) => (
    <button 
        onClick={onClick}
        className={`px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 transition-colors border ${active ? 'bg-orange-500 border-orange-500 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
    >
        {icon} {label}
    </button>
);

const RestaurantCard = ({ data }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group flex flex-col">
            <div className="relative h-48 overflow-hidden">
                <img src={data.images[0]} alt={data.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {data.isHalal && (
                        <span className="bg-green-600/90 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-sm">
                           <CheckCircle2 size={12}/> হালাল
                        </span>
                    )}
                    {data.isVerified && (
                        <span className="bg-blue-600/90 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-sm">
                           <ShieldCheck size={12}/> Verified
                        </span>
                    )}
                </div>
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-yellow-600 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star size={12} className="fill-current"/> {data.rating} ({data.reviewCount})
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-1">{data.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-3"><MapPin size={14}/> {data.address}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                    {data.cuisine.map((c, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{c}</span>
                    ))}
                </div>

                {data.specialDish && (
                    <p className="text-sm text-gray-700 bg-orange-50 p-2 rounded-lg font-medium border border-orange-100 mb-4">
                        <span className="text-orange-600">স্পেশাল:</span> {data.specialDish}
                    </p>
                )}

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-[#1B5E20] font-bold text-sm">
                        {data.priceRange} <span className="text-gray-400 font-normal">/জন</span>
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                    <a href={`tel:${data.phone.replace(/\s+/g, '')}`} className="flex-1 border-2 border-orange-500 text-orange-600 flex items-center justify-center gap-1 py-2 rounded-xl font-bold hover:bg-orange-50 transition-colors">
                        <Phone size={16}/> কল
                    </a>
                    <a href={`https://maps.google.com/?q=${data.lat},${data.lng}`} target="_blank" rel="noreferrer" className="flex-1 bg-[#1B5E20] text-white flex items-center justify-center gap-1 py-2 rounded-xl font-bold hover:bg-green-800 transition-colors">
                        <Navigation size={16}/> ম্যাপ
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FoodFinder;
