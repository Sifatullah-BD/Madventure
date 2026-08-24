import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDistricts, getPlaces } from '../services/tourService';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import SEO from '../components/SEO';
import MapDiscovery from '../components/home/MapDiscovery';
import DestinationCard from '../components/district/DestinationCard';
import { handleImageError } from '../utils/imageFallback';

const heroImages = [
    "/images/destinations_hero_1_1778975470949.png",
    "/images/destinations_hero_2_1778975509415.png",
    "/images/destinations_hero_3_1778975530619.png"
];

const Destinations = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDivision, setSelectedDivision] = useState('All');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [places, setPlaces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        async function loadData() {
            try {
                const [placesRes, districtsRes] = await Promise.all([
                    getPlaces(),
                    getDistricts()
                ]);
                setPlaces(placesRes || []);
                setDistricts(districtsRes || []);
            } catch (err) {
                console.error("Failed to load destinations:", err);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const filteredPlaces = places.filter(place => {
        const term = searchTerm.toLowerCase();
        const nameVal = (place.name || '').toLowerCase();
        const nameBnVal = (place.nameBn || place.name_bn || '').toLowerCase();
        const locVal = (place.location || '').toLowerCase();
        return nameVal.includes(term) || nameBnVal.includes(term) || locVal.includes(term);
    });

    // Group districts by division for UI
    const divisions = districts.reduce((acc, d) => {
        if (!acc[d.division]) acc[d.division] = [];
        acc[d.division].push(d);
        return acc;
    }, {});

    const filteredDivisions = Object.keys(divisions).filter(div => 
        selectedDivision === 'All' || div === selectedDivision
    ).map(divName => ({
        division: divName,
        districts: divisions[divName].filter(d => {
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            const districtNameEn = (d.nameEn || d.name_en || d.name || '').toLowerCase();
            const districtNameBn = (d.name || d.name_bn || '').toLowerCase();
            const spots = d.spots || d.highlights || [];
            return districtNameEn.includes(term) || districtNameBn.includes(term) || spots.some(s => (s || '').toLowerCase().includes(term));
        })
    })).filter(div => div.districts.length > 0);

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-950 font-sans">
            <SEO 
                title="Destinations" 
                description="Explore the best travel destinations in Bangladesh. From Cox's Bazar beaches to Sylhet's tea gardens."
            />
            {/* Custom Hero Section */}
            <div className="relative h-[45vh] min-h-[300px] w-full overflow-hidden rounded-b-[3rem] shadow-xl">
                {/* Background Slider */}
                {heroImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <img src={img} alt={`Slide ${index}`} onError={handleImageError} className="w-full h-full object-cover scale-105 transition-transform duration-[10s] ease-linear" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-black/40 to-black/20"></div>
                    </div>
                ))}

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end items-center p-6 md:p-10 text-center z-10 pb-12">
                    <div className="max-w-3xl mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md text-white rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-white/20 shadow-sm">
                            <MapPin size={16} className="text-green-400" />
                            <span>Discover Bangladesh</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-xl mb-4 leading-[1.1]">
                            {t('explore_bangladesh')}
                        </h1>
                        <p className="text-base md:text-lg text-gray-200 font-medium leading-relaxed drop-shadow-md max-w-2xl mx-auto">
                            {t('destinations_subtitle')}
                        </p>
                    </div>

                    <div className="w-full max-w-2xl relative z-20">
                        <div className={`flex items-center bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg rounded-full transition-all duration-500 overflow-hidden w-full h-12 group hover:bg-white/30 hover:border-white/50 focus-within:bg-white/30 focus-within:border-white/50 focus-within:ring-2 focus-within:ring-white/20`}>
                            <div className="pl-5 text-white/70 group-focus-within:text-white transition-colors">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder={t('search_places') || "Search destinations, cities, attractions..."}
                                className="bg-transparent border-none outline-none text-white placeholder-white/70 ml-3 w-full text-sm font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="text-white/70 hover:text-white pr-6 transition-colors">
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                        <MapPin className="text-primary" /> {t('popular_destinations')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {isLoading ? (
                            <CardSkeleton count={6} />
                        ) : filteredPlaces.length === 0 ? (
                            <div className="col-span-full">
                                <EmptyState
                                    icon="search"
                                    title={t('no_destinations')}
                                    description={t('no_destinations_desc', { searchTerm })}
                                    actionLabel={t('clear_search')}
                                    onAction={() => setSearchTerm('')}
                                />
                            </div>
                        ) : (
                            filteredPlaces.map((place) => (
                                <DestinationCard key={place.id} place={place} />
                            ))
                        )}
                    </div>
                </div>

                <MapDiscovery />

                <div className="mt-12">
                    <div className="flex flex-col mb-6 gap-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Filter className="text-primary" /> {t('explore_by_district')}
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            <button onClick={() => setSelectedDivision('All')} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${selectedDivision === 'All' ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>{t('all_divisions')}</button>
                            {Object.keys(divisions).map((div, idx) => (
                                <button key={idx} onClick={() => setSelectedDivision(div)} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${selectedDivision === div ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>{div.replace(' Division', '')}</button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        {filteredDivisions.map((divData, idx) => (
                            <div key={idx} className="bg-white dark:bg-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 border-b dark:border-gray-800 pb-3">{divData.division}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {divData.districts.map((district, dIdx) => {
                                        const spots = district.spots || district.highlights || [];
                                        return (
                                        <Link key={dIdx} to={`/district/${(district.nameEn || district.name || '').toLowerCase()}`} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors group block hover:shadow-sm border border-transparent hover:border-green-100">
                                            <h4 className="font-bold text-base text-gray-800 dark:text-white mb-2 flex items-center justify-between">
                                                {district.nameEn || district.name}
                                                <span className="text-[10px] bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500 border border-gray-100 dark:border-gray-700">{spots.length} {t('spots')}</span>
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {spots.slice(0, 3).map((spot, sIdx) => (
                                                    <span key={sIdx} className="text-[10px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-400">{spot}</span>
                                                ))}
                                                {spots.length > 3 && <span className="text-[10px] text-primary font-bold">+{spots.length - 3} {t('more')}</span>}
                                            </div>
                                        </Link>
                                    )})}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Destinations;
