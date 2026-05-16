import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDistricts, getPlaces } from '../api/destinations';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import SEO from '../components/SEO';
import MapDiscovery from '../components/home/MapDiscovery';
import DestinationCard from '../components/district/DestinationCard';

const heroImages = [
    "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1598556776374-2c358606f287?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1544228906-8d591e528b61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
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
                setPlaces(placesRes.data || []);
                setDistricts(districtsRes.data || []);
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

    const filteredPlaces = places.filter(place =>
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            return d.name.toLowerCase().includes(term) || d.spots.some(s => s.toLowerCase().includes(term));
        })
    })).filter(div => div.districts.length > 0);

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-950 font-sans">
            <SEO 
                title="Destinations" 
                description="Explore the best travel destinations in Bangladesh. From Cox's Bazar beaches to Sylhet's tea gardens."
            />
            {/* Custom Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden rounded-b-[3rem] shadow-2xl">
                {/* Background Slider */}
                {heroImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <img src={img} alt={`Slide ${index}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40"></div>
                    </div>
                ))}

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12">
                    <div className="flex justify-between items-start">
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg">
                            {t('explore_bangladesh')}
                        </h1>
                        <div className="relative">
                            <div className={`flex items-center bg-white/20 backdrop-blur-md rounded-full transition-all duration-300 ${isSearchOpen ? 'w-64 md:w-80 px-4 py-2' : 'w-12 h-12 justify-center hover:bg-white/30 cursor-pointer'}`}>
                                {isSearchOpen ? (
                                    <>
                                        <Search size={20} className="text-white shrink-0" />
                                        <input
                                            type="text"
                                            placeholder="Search places..."
                                            className="bg-transparent border-none outline-none text-white placeholder-gray-200 ml-3 w-full text-sm font-medium"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            autoFocus
                                        />
                                        <button onClick={() => { setIsSearchOpen(false); setSearchTerm(''); }} className="text-white/70 hover:text-white ml-2">
                                            <X size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsSearchOpen(true)} className="text-white">
                                        <Search size={24} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="max-w-2xl">
                        <p className="text-lg md:text-xl text-gray-100 font-medium leading-relaxed drop-shadow-md">
                            {t('destinations_subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-2">
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

                <div className="mt-20">
                    <div className="flex flex-col mb-8 gap-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Filter className="text-primary" /> {t('explore_by_district')}
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            <button onClick={() => setSelectedDivision('All')} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${selectedDivision === 'All' ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>{t('all_divisions')}</button>
                            {Object.keys(divisions).map((div, idx) => (
                                <button key={idx} onClick={() => setSelectedDivision(div)} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${selectedDivision === div ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>{div.replace(' Division', '')}</button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-12">
                        {filteredDivisions.map((divData, idx) => (
                            <div key={idx} className="bg-white dark:bg-surface rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-b dark:border-gray-800 pb-4">{divData.division}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {divData.districts.map((district, dIdx) => (
                                        <Link key={dIdx} to={`/district/${district.name.toLowerCase()}`} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors group block hover:shadow-md border border-transparent hover:border-green-100">
                                            <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-3 flex items-center justify-between">
                                                {district.name}
                                                <span className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded text-gray-500 border border-gray-100 dark:border-gray-700">{district.spots.length} {t('spots')}</span>
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {district.spots.slice(0, 3).map((spot, sIdx) => (
                                                    <span key={sIdx} className="text-[10px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-400">{spot}</span>
                                                ))}
                                                {district.spots.length > 3 && <span className="text-[10px] text-primary font-bold">+{district.spots.length - 3} {t('more')}</span>}
                                            </div>
                                        </Link>
                                    ))}
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
