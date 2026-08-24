import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, X, MapPin, Layers, Map as MapIcon, Home, Store, LayoutGrid } from 'lucide-react';
import InteractiveMap from '../components/map/InteractiveMap';
import GoogleMapPreview from '../components/map/GoogleMapPreview';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

// Data APIs
import { getTours } from '../services/tourService';
import { getHotels } from '../services/tourService';
import { businessService } from '../services/businessService';
import districtsList from '../data/districts_list.json';
import upazilasData from '../data/upazilas.json';
import MapDiscovery from '../components/home/MapDiscovery';
import { AnimatePresence } from 'framer-motion';

import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import { handleImageError } from '../utils/imageFallback';

// Map and sort all 64 districts from JSON
const allDistricts = districtsList.districts.map(d => ({
    id: d.id,
    name: d.name,
    bnName: d.bn_name
})).sort((a, b) => a.name.localeCompare(b.name));

const Explore = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { language } = useLanguage();

    const sortOptions = [
        { id: 'popular', label: language === 'bn' ? 'জনপ্রিয়' : 'Popular' },
        { id: 'price_low', label: language === 'bn' ? 'দাম: কম → বেশি' : 'Price: Low to High' },
        { id: 'price_high', label: language === 'bn' ? 'দাম: বেশি → কম' : 'Price: High to Low' },
    ];

    // Search & Geographic Filter State
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'ALL');
    const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || '');
    const [selectedUpazila, setSelectedUpazila] = useState(searchParams.get('upazila') || '');
    const [selectedUnion, setSelectedUnion] = useState(searchParams.get('union') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [isMapView, setIsMapView] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // Memoize upazilas matching the selected district
    const filteredUpazilas = useMemo(() => {
        if (!selectedDistrict) return [];
        const activeDistrictObj = districtsList.districts.find(d => d.name === selectedDistrict || d.bn_name === selectedDistrict);
        const districtId = activeDistrictObj ? activeDistrictObj.id : null;
        return districtId 
            ? upazilasData.filter(u => u.district_id === districtId).sort((a, b) => a.name.localeCompare(b.name))
            : [];
    }, [selectedDistrict]);

    // Dynamically generate unions for the selected upazila
    const generatedUnions = useMemo(() => {
        if (!selectedUpazila) return [];
        const activeUpazilaObj = filteredUpazilas.find(u => u.name === selectedUpazila || u.bn_name === selectedUpazila);
        const baseName = activeUpazilaObj ? activeUpazilaObj.name : selectedUpazila;
        const baseNameBn = activeUpazilaObj ? activeUpazilaObj.bn_name : selectedUpazila;
        
        return [
            { name: `${baseName} Sadar`, bnName: `${baseNameBn} সদর` },
            { name: `${baseName} North`, bnName: `${baseNameBn} উত্তর` },
            { name: `${baseName} South`, bnName: `${baseNameBn} দক্ষিণ` },
            { name: `${baseName} East`, bnName: `${baseNameBn} পূর্ব` },
            { name: `${baseName} West`, bnName: `${baseNameBn} পশ্চিম` },
        ];
    }, [selectedUpazila, filteredUpazilas]);

    // Sync URL when state changes manually
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchTerm) params.set('q', searchTerm);
        if (activeTab !== 'ALL') params.set('tab', activeTab);
        if (selectedDistrict) params.set('district', selectedDistrict);
        if (selectedUpazila) params.set('upazila', selectedUpazila);
        if (selectedUnion) params.set('union', selectedUnion);
        if (sortBy !== 'popular') params.set('sort', sortBy);
        if (maxPrice) params.set('maxPrice', maxPrice);
        setSearchParams(params, { replace: true });
    }, [searchTerm, activeTab, selectedDistrict, selectedUpazila, selectedUnion, sortBy, maxPrice, setSearchParams]);

    // Fetch and aggregate search results
    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const wanted = {
                    tours: activeTab === 'ALL' || activeTab === 'TOURS',
                    hotels: activeTab === 'ALL' || activeTab === 'HOTELS',
                    biz: activeTab === 'ALL' || activeTab === 'BUSINESSES',
                };

                // Use allSettled so one failed API doesn't blank the whole search page
                const [toursRes, hotelsRes, bizRes] = await Promise.allSettled([
                    wanted.tours ? getTours() : Promise.resolve([]),
                    wanted.hotels ? getHotels() : Promise.resolve([]),
                    wanted.biz ? businessService.getBusinesses() : Promise.resolve([])
                ]);

                const settledValue = (r) => (r && r.status === 'fulfilled' ? r.value : []);
                const wantedFlags = [wanted.tours, wanted.hotels, wanted.biz];
                const failures = [toursRes, hotelsRes, bizRes]
                    .filter((r, i) => r.status === 'rejected' && wantedFlags[i]).length;
                const requestedCount = wantedFlags.filter(Boolean).length;
                const allFailed = failures > 0 && failures === requestedCount;

                let aggregated = [
                    ...(Array.isArray(settledValue(toursRes)) ? settledValue(toursRes) : []).map(t => ({ ...t, _type: 'TOURS', _price: t.price_per_person || t.price })),
                    ...(Array.isArray(settledValue(hotelsRes)) ? settledValue(hotelsRes) : []).map(h => ({ ...h, _type: 'HOTELS', _price: h.price_per_night || h.price })),
                    ...(Array.isArray(settledValue(bizRes)) ? settledValue(bizRes) : []).map(b => ({ ...b, _type: 'BUSINESSES', _price: 0 }))
                ];

                // Text query filtering
                if (searchTerm) {
                    const q = searchTerm.toLowerCase();
                    aggregated = aggregated.filter(item => 
                        item.title?.toLowerCase().includes(q) || 
                        item.name?.toLowerCase().includes(q) ||
                        item.district?.toLowerCase().includes(q) ||
                        item.location?.toLowerCase().includes(q)
                    );
                }

                // District search filtering
                if (selectedDistrict) {
                    const activeDistrictObj = districtsList.districts.find(d => d.name === selectedDistrict || d.bn_name === selectedDistrict);
                    const nameEn = activeDistrictObj ? activeDistrictObj.name.toLowerCase() : selectedDistrict.toLowerCase();
                    const nameBn = activeDistrictObj ? activeDistrictObj.bn_name : selectedDistrict;

                    aggregated = aggregated.filter(item => 
                        item.district?.toLowerCase().includes(nameEn) || 
                        item.district_id === selectedDistrict ||
                        item.location?.toLowerCase().includes(nameEn) ||
                        item.location?.includes(nameBn)
                    );
                }

                // Upazila search filtering
                if (selectedUpazila) {
                    const activeUpazilaObj = filteredUpazilas.find(u => u.name === selectedUpazila || u.bn_name === selectedUpazila);
                    const nameEn = activeUpazilaObj ? activeUpazilaObj.name.toLowerCase() : selectedUpazila.toLowerCase();
                    const nameBn = activeUpazilaObj ? activeUpazilaObj.bn_name : selectedUpazila;

                    aggregated = aggregated.filter(item => 
                        item.upazila?.toLowerCase().includes(nameEn) || 
                        item.location?.toLowerCase().includes(nameEn) ||
                        item.location?.includes(nameBn)
                    );
                }

                // Union search filtering
                if (selectedUnion) {
                    const termEn = selectedUnion.toLowerCase();
                    aggregated = aggregated.filter(item => 
                        item.union?.toLowerCase().includes(termEn) || 
                        item.location?.toLowerCase().includes(termEn)
                    );
                }

                // Budget filter
                if (maxPrice) {
                    aggregated = aggregated.filter(item => item._price <= Number(maxPrice) || item._price === 0);
                }

                // Sorting 
                if (sortBy === 'price_low') {
                    aggregated.sort((a, b) => a._price - b._price);
                } else if (sortBy === 'price_high') {
                    aggregated.sort((a, b) => b._price - a._price);
                }

                setResults(aggregated);
                if (allFailed) {
                    console.error('Global search: all requested data sources failed');
                    setError('Something went wrong while searching. Please try again.');
                }
            } catch (err) {
                console.error("Global search error:", err);
                setError(err?.message || 'Something went wrong while searching.');
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const delay = setTimeout(() => {
            fetchAll();
        }, 300);

        return () => clearTimeout(delay);
    }, [searchTerm, activeTab, selectedDistrict, selectedUpazila, selectedUnion, sortBy, maxPrice, filteredUpazilas, refreshKey]);

    const clearFilters = () => {
        setSearchTerm('');
        setActiveTab('ALL');
        setSelectedDistrict('');
        setSelectedUpazila('');
        setSelectedUnion('');
        setSortBy('popular');
        setMaxPrice('');
    };

    const hasActiveFilters = activeTab !== 'ALL' || selectedDistrict || selectedUpazila || selectedUnion || searchTerm || maxPrice;
    const mapQuery = searchTerm || selectedUnion || selectedUpazila || selectedDistrict || 'Bangladesh';

    const renderCard = (item) => {
        if (item._type === 'TOURS') {
            return (
                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition">
                    <img src={item.featured_image || item.image || '/assets/tours/placeholder.jpg'} alt={item.title} onError={handleImageError} className="w-full h-48 object-cover" />
                    <div className="p-4">
                        <div className="text-xs text-primary font-bold mb-1 tracking-wider uppercase flex items-center gap-1"><MapIcon size={12}/> TOUR</div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate">{item.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{item.duration} • {item.difficulty}</p>
                        <div className="flex justify-between items-center border-t border-gray-100 dark:border-slate-800 pt-3">
                            <span className="font-bold text-primary">৳{Number(item._price || 0).toLocaleString()}</span>
                            <button onClick={() => navigate(`/tours/${item.id}`)} className="text-sm bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 font-medium dark:text-white transition-colors">View</button>
                        </div>
                    </div>
                </div>
            );
        } else if (item._type === 'HOTELS') {
            return (
                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition">
                    <img src={item.image || '/assets/hotels/placeholder.jpg'} alt={item.name} onError={handleImageError} className="w-full h-48 object-cover" />
                    <div className="p-4">
                        <div className="text-xs text-blue-500 font-bold mb-1 tracking-wider uppercase flex items-center gap-1"><Home size={12}/> HOTEL</div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{item.type || 'Accommodation'}</p>
                        <div className="flex justify-between items-center border-t border-gray-100 dark:border-slate-800 pt-3">
                            <span className="font-bold text-blue-600">৳{Number(item._price || 0).toLocaleString()}/night</span>
                            <button 
                                onClick={() => navigate(`/hotels/${item.district_id || 'unknown'}/${item.id}/book`)} 
                                className="text-sm bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 font-medium dark:text-white transition-colors"
                            >
                                View
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition">
                    <img src={item.logo || item.coverImage || '/api/placeholder/400/300'} alt={item.name} onError={handleImageError} className="w-full h-48 object-cover opacity-80" />
                    <div className="p-4">
                        <div className="text-xs text-orange-500 font-bold mb-1 tracking-wider uppercase flex items-center gap-1"><Store size={12}/> {item.category}</div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 truncate">{item.location}</p>
                        <div className="flex justify-between items-center border-t border-gray-100 dark:border-slate-800 pt-3">
                            <span className="text-xs font-medium text-gray-400">Local Business</span>
                            <button onClick={() => navigate(`/business/${item.slug}`)} className="text-sm bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 font-medium dark:text-white transition-colors">Profile</button>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#020d06] pt-24 pb-12 transition-colors duration-300">
            <SEO title="Explore Bangladesh" description="Search tours, hotels, and local businesses across all 64 districts of Bangladesh. Powered by Madventure Travel OS." keywords="explore Bangladesh, tours, hotels, travel search, Madventure" />
            <div className="max-w-[1140px] mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black font-heading text-gray-900 dark:text-white mb-2">
                        {language === 'bn' ? 'গ্লোবাল সার্চ ইঞ্জিন' : 'Global Search Engine'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {language === 'bn' ? 'গন্তব্য, উপজেলা, ইউনিয়ন এবং ট্যুর খুঁজুন খুব সহজেই।' : 'Find destinations, upazilas, unions, and tours seamlessly.'}
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="flex gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
                        <div className="flex-1 flex items-center gap-2 px-3">
                            <Search size={20} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder={language === 'bn' ? "সাজেক, কাপ্তাই বা বিরিশিরি লিখে সার্চ করুন..." : "Search 'Sajek', 'Kaptai' or 'Birishiri'..."}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400"
                            />
                            {searchTerm && (
                                <button type="button" onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-2.5 rounded-xl border font-bold transition-colors flex items-center gap-2 ${showFilters ? 'bg-[#1B5E20] text-white border-[#1B5E20]' : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                        >
                            <SlidersHorizontal size={18} /> <span className="hidden sm:inline">{language === 'bn' ? 'ফিল্টার' : 'Filters'}</span>
                        </button>
                    </div>
                </div>

                {/* Conditional Filters Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 mb-6"
                        >
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
                                    {/* District Filter Dropdown */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">
                                            <MapPin size={12} className="inline mr-1" /> {language === 'bn' ? 'জেলা' : 'District'}
                                        </label>
                                        <select
                                            value={selectedDistrict}
                                            onChange={e => {
                                                setSelectedDistrict(e.target.value);
                                                setSelectedUpazila('');
                                                setSelectedUnion('');
                                            }}
                                            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-750 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1B5E20] dark:text-white"
                                        >
                                            <option value="">{language === 'bn' ? 'সব জেলা' : 'All Regions'}</option>
                                            {allDistricts.map((d, i) => (
                                                <option key={i} value={d.name}>{language === 'bn' ? d.bnName : d.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Upazila Filter Dropdown */}
                                    {selectedDistrict && (
                                        <div className="animate-fade-in">
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">
                                                <MapPin size={12} className="inline mr-1" /> {language === 'bn' ? 'উপজেলা' : 'Upazila'}
                                            </label>
                                            <select
                                                value={selectedUpazila}
                                                onChange={e => {
                                                    setSelectedUpazila(e.target.value);
                                                    setSelectedUnion('');
                                                }}
                                                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-750 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1B5E20] dark:text-white"
                                            >
                                                <option value="">{language === 'bn' ? 'সব উপজেলা' : 'All Upazilas'}</option>
                                                {filteredUpazilas.map((u, i) => (
                                                    <option key={i} value={u.name}>{language === 'bn' ? u.bn_name : u.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Dynamic Union Filter Dropdown */}
                                    {selectedUpazila && (
                                        <div className="animate-fade-in">
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">
                                                <MapPin size={12} className="inline mr-1" /> {language === 'bn' ? 'ইউনিয়ন' : 'Union'}
                                            </label>
                                            <select
                                                value={selectedUnion}
                                                onChange={e => setSelectedUnion(e.target.value)}
                                                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-750 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1B5E20] dark:text-white"
                                            >
                                                <option value="">{language === 'bn' ? 'সব ইউনিয়ন' : 'All Unions'}</option>
                                                {generatedUnions.map((un, i) => (
                                                    <option key={i} value={un.name}>{language === 'bn' ? un.bnName : un.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 dark:border-slate-800 pt-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">
                                            {language === 'bn' ? 'সর্বোচ্চ বাজেট (৳)' : 'Max Price limit (৳)'}
                                        </label>
                                        <input
                                            type="number"
                                            value={maxPrice}
                                            onChange={e => setMaxPrice(e.target.value)}
                                            placeholder="e.g. 5000"
                                            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-750 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1B5E20] dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest">
                                            {language === 'bn' ? 'বাছাই করুন' : 'Sort By'}
                                        </label>
                                        <select
                                            value={sortBy}
                                            onChange={e => setSortBy(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-750 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1B5E20] dark:text-white"
                                        >
                                            {sortOptions.map(s => (
                                                <option key={s.id} value={s.id}>{s.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="mt-4 text-sm text-red-500 hover:text-red-700 font-bold transition-colors">
                                    ✕ {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset all configurations'}
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Unified Category Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
                    {[
                        { id: 'ALL', bn: 'সব কিছু', en: 'Everything' },
                        { id: 'TOURS', bn: 'ট্যুর', en: 'Tours' },
                        { id: 'HOTELS', bn: 'হোটেল', en: 'Hotels' },
                        { id: 'BUSINESSES', bn: 'বিজনেস', en: 'Businesses' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === tab.id
                                ? 'bg-[#1B5E20] text-white shadow-lg scale-105'
                                : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-800 hover:border-primary/50'
                                }`}
                        >
                            {tab.id === 'ALL' && <Layers size={16} />}
                            {tab.id === 'TOURS' && <MapIcon size={16} />}
                            {tab.id === 'HOTELS' && <Home size={16} />}
                            {tab.id === 'BUSINESSES' && <Store size={16} />}
                            {language === 'bn' ? tab.bn : tab.en}
                        </button>
                    ))}
                </div>

                {/* Results Count & View Toggle */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {language === 'bn' ? 'মোট ' : 'Showing '} 
                        <span className="font-black text-gray-900 dark:text-white">{isLoading ? '…' : error ? '0' : results.length}</span> 
                        {language === 'bn' ? 'টি ফলাফল পাওয়া গেছে' : ' verified results'}
                    </p>
                    <button 
                        onClick={() => setIsMapView(!isMapView)}
                        className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                    >
                        {isMapView ? <LayoutGrid size={18}/> : <MapIcon size={18}/>}
                        {isMapView ? (language === 'bn' ? 'গ্রিড ভিউ' : 'Grid View') : (language === 'bn' ? 'ম্যাপ ভিউ' : 'Map View')}
                    </button>
                </div>

                <div className="mb-10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <MapDiscovery />
                </div>

                <div className="mb-10">
                    <GoogleMapPreview query={mapQuery} height={420} />
                </div>

                {/* Results */}
                {isMapView ? (
                    <div className="animate-in fade-in duration-500 rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-900">
                        <InteractiveMap items={results} height="600px" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {isLoading ? (
                            <CardSkeleton count={8} />
                        ) : error ? (
                            <div className="col-span-full">
                                <EmptyState
                                    icon="search"
                                    title={language === 'bn' ? 'সার্চ করা যায়নি' : "We couldn't load results"}
                                    description={language === 'bn' ? 'ইন্টারনেট বা সার্ভার সমস্যার কারণে ফলাফল আনা যায়নি। আবার চেষ্টা করুন।' : 'A connection or server problem prevented us from loading results. Please try again.'}
                                    actionLabel={language === 'bn' ? 'আবার চেষ্টা করুন' : 'Try Again'}
                                    onAction={() => setRefreshKey(k => k + 1)}
                                />
                            </div>
                        ) : results.length === 0 ? (
                            <div className="col-span-full">
                                <EmptyState
                                    icon="search"
                                    title={language === 'bn' ? "কোনো ফলাফল পাওয়া যায়নি" : "No matches discovered"}
                                    description={language === 'bn' ? "ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।" : "Try adjusting your filters or widening the search."}
                                    actionLabel={language === 'bn' ? "সব ফিল্টার মুছুন" : "Clear Filters"}
                                    onAction={clearFilters}
                                />
                            </div>
                        ) : (
                            results.map(item => renderCard(item))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explore;
