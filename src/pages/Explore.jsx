import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, MapPin, Layers, Map as MapIcon, Home, Store, LayoutGrid } from 'lucide-react';
import InteractiveMap from '../components/map/InteractiveMap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

// Data APIs
import { getTours } from '../api/tours';
import { getHotels } from '../api/hotels';
import { businessService } from '../services/businessService';
import { districtsData } from '../data/districts';

// Flatten districts for dropdown
const allDistricts = districtsData.flatMap(div =>
    div.districts.map(d => ({ name: d.name, division: div.division }))
).sort((a, b) => a.name.localeCompare(b.name));

const sortOptions = [
    { id: 'popular', label: 'জনপ্রিয় (Popular)' },
    { id: 'price_low', label: 'দাম: কম → বেশি (Price: Low to High)' },
    { id: 'price_high', label: 'দাম: বেশি → কম (Price: High to Low)' },
];

const Explore = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Map URL Params to State natively
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'ALL');
    const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [isMapView, setIsMapView] = useState(false);

    // Sync URL when state changes manually
    useEffect(() => {
        const params = new URLSearchParams();
        if (searchTerm) params.set('q', searchTerm);
        if (activeTab !== 'ALL') params.set('tab', activeTab);
        if (selectedDistrict) params.set('district', selectedDistrict);
        if (sortBy !== 'popular') params.set('sort', sortBy);
        if (maxPrice) params.set('maxPrice', maxPrice);
        setSearchParams(params, { replace: true });
    }, [searchTerm, activeTab, selectedDistrict, sortBy, maxPrice, setSearchParams]);

    // Fetch and aggregate
    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            try {
                // Fetch in parallel
                const [toursRes, hotelsRes, bizRes] = await Promise.all([
                    activeTab === 'ALL' || activeTab === 'TOURS' ? getTours() : { data: [] },
                    activeTab === 'ALL' || activeTab === 'HOTELS' ? getHotels() : { data: [] },
                    activeTab === 'ALL' || activeTab === 'BUSINESSES' ? businessService.getBusinesses() : []
                ]);

                // Map standard schema over diverse results to render generically
                let aggregated = [
                    ...(toursRes.data || []).map(t => ({ ...t, _type: 'TOURS', _price: t.price_per_person || t.price })),
                    ...(hotelsRes.data || []).map(h => ({ ...h, _type: 'HOTELS', _price: h.price_per_night || h.price })),
                    ...(Array.isArray(bizRes) ? bizRes : []).map(b => ({ ...b, _type: 'BUSINESSES', _price: 0 /* Business specific fallback */ }))
                ];

                // Filtering Chain
                if (searchTerm) {
                    const q = searchTerm.toLowerCase();
                    aggregated = aggregated.filter(item => 
                        item.title?.toLowerCase().includes(q) || 
                        item.name?.toLowerCase().includes(q) ||
                        item.district?.toLowerCase().includes(q)
                    );
                }

                if (selectedDistrict) {
                    aggregated = aggregated.filter(item => 
                        item.district === selectedDistrict || 
                        item.district_id === selectedDistrict ||
                        item.location?.toLowerCase().includes(selectedDistrict.toLowerCase())
                    );
                }

                if (maxPrice) {
                    aggregated = aggregated.filter(item => item._price <= Number(maxPrice) || item._price === 0);
                }

                // Sorting 
                if (sortBy === 'price_low') {
                    aggregated.sort((a, b) => a._price - b._price);
                } else if (sortBy === 'price_high') {
                    aggregated.sort((a, b) => b._price - a._price);
                } // Popular etc defaults for now using base rating if it exists usually

                setResults(aggregated);
            } catch (err) {
                console.error("Global search error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce fetching slightly if typing typing typing
        const delay = setTimeout(() => {
            fetchAll();
        }, 300);

        return () => clearTimeout(delay);
    }, [searchTerm, activeTab, selectedDistrict, sortBy, maxPrice]);

    const clearFilters = () => {
        setSearchTerm('');
        setActiveTab('ALL');
        setSelectedDistrict('');
        setSortBy('popular');
        setMaxPrice('');
    };

    const hasActiveFilters = activeTab !== 'ALL' || selectedDistrict || searchTerm || maxPrice;

    const renderCard = (item) => {
        if (item._type === 'TOURS') {
            return (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                    <img src={item.featured_image || item.image || '/assets/tours/placeholder.jpg'} alt={item.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                        <div className="text-xs text-primary font-bold mb-1 tracking-wider uppercase flex items-center gap-1"><MapIcon size={12}/> TOUR</div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-500 mb-3">{item.duration} • {item.difficulty}</p>
                        <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                            <span className="font-bold text-primary">৳{item._price.toLocaleString()}</span>
                            <button onClick={() => navigate(`/tours/${item.id}`)} className="text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 font-medium">View</button>
                        </div>
                    </div>
                </div>
            );
        } else if (item._type === 'HOTELS') {
            return (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                    <img src={item.image || '/assets/hotels/placeholder.jpg'} alt={item.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                        <div className="text-xs text-blue-500 font-bold mb-1 tracking-wider uppercase flex items-center gap-1"><Home size={12}/> HOTEL</div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">{item.type || 'Accommodation'}</p>
                        <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                            <span className="font-bold text-blue-600">৳{item._price.toLocaleString()}/night</span>
                            <button className="text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 font-medium">View</button>
                        </div>
                    </div>
                </div>
            );
        } else {
            // Business fallback
            return (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                    <img src={item.logo || item.coverImage || '/api/placeholder/400/300'} alt={item.name} className="w-full h-48 object-cover opacity-80" />
                    <div className="p-4">
                        <div className="text-xs text-orange-500 font-bold mb-1 tracking-wider uppercase flex items-center gap-1"><Store size={12}/> {item.category}</div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-3 truncate">{item.location}</p>
                        <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                            <span className="text-xs font-medium text-gray-400">Local Business</span>
                            <button onClick={() => navigate(`/business/${item.slug}`)} className="text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 font-medium">Profile</button>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-[1140px] mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-heading text-gray-900 mb-2">Global Search Engine</h1>
                    <p className="text-gray-600">Find destinations, local guides, hotels, and tours seamlessly.</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex-1 flex items-center gap-2 px-3">
                            <Search size={20} className="text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search 'Sundarbans' or 'Cox's Bazar'..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
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
                            className={`px-4 py-2.5 rounded-xl border font-bold transition-colors flex items-center gap-2 ${showFilters ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                        >
                            <SlidersHorizontal size={18} /> <span className="hidden sm:inline">Filters</span>
                        </button>
                    </div>
                </div>

                {/* Conditional Filters Panel */}
                {showFilters && (
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">
                                    <MapPin size={12} className="inline mr-1" /> District Locator
                                </label>
                                <select
                                    value={selectedDistrict}
                                    onChange={e => setSelectedDistrict(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">All Regions</option>
                                    {allDistricts.map((d, i) => (
                                        <option key={i} value={d.name}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">Max Price limit (৳)</label>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={e => setMaxPrice(e.target.value)}
                                    placeholder="e.g. 5000"
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {sortOptions.map(s => (
                                        <option key={s.id} value={s.id}>{s.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="mt-4 text-sm text-red-500 hover:text-red-700 font-bold transition-colors">
                                ✕ Reset all configurations
                            </button>
                        )}
                    </div>
                )}

                {/* Unified Category Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
                    {['ALL', 'TOURS', 'HOTELS', 'BUSINESSES'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab
                                ? 'bg-primary text-white shadow-md scale-105'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/50'
                                }`}
                        >
                            {tab === 'ALL' && <Layers size={14} className="inline mr-2" />}
                            {tab === 'TOURS' && <MapIcon size={14} className="inline mr-2" />}
                            {tab === 'HOTELS' && <Home size={14} className="inline mr-2" />}
                            {tab === 'BUSINESSES' && <Store size={14} className="inline mr-2" />}
                            {tab === 'ALL' ? 'Everything' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {/* Results Count & View Toggle */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-bold text-gray-900">{results.length}</span> verified results
                    </p>
                    <button 
                        onClick={() => setIsMapView(!isMapView)}
                        className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        {isMapView ? <LayoutGrid size={16}/> : <MapIcon size={16}/>}
                        {isMapView ? 'Grid View' : 'Map View'}
                    </button>
                </div>

                {/* Dynamic Masonry/Grid or Map */}
                {isMapView ? (
                    <div className="animate-in fade-in duration-500">
                        <InteractiveMap items={results} height="600px" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoading ? (
                            <CardSkeleton count={8} />
                        ) : results.length === 0 ? (
                            <div className="col-span-full">
                                <EmptyState
                                    icon="search"
                                    title="No matches discovered"
                                    description="Try adjusting your filter constraints or widening the search radius."
                                    actionLabel="Clear Filters"
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
