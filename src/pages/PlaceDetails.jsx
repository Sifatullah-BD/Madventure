import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Star, Info, Map as MapIcon, Navigation } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';

const PlaceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);
    const [regionalSuggestions, setRegionalSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaceData = async () => {
            setLoading(true);
            try {
                const placeData = await supabaseService.getPlaceById(id);
                setPlace(placeData);

                if (placeData) {
                    const suggestions = await supabaseService.getPlacesByRegion(placeData.region);
                    setRegionalSuggestions(suggestions.filter(p => p.id !== placeData.id));
                }
            } catch (error) {
                console.error("Error fetching place details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaceData();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            </div>
        );
    }

    if (!place) {
        return <div className="min-h-screen flex items-center justify-center">Place not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-16 font-sans">
            {/* Hero Banner */}
            <div className="relative h-[60vh] w-full">
                <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>

                {/* Navigation Back Button */}
                <div className="absolute top-6 left-6 z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-all hover:scale-105 border border-white/10"
                    >
                        <ArrowLeft size={24} />
                    </button>
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                                {place.region}
                            </span>
                            <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border border-white/10">
                                <Star size={14} className="text-yellow-400 fill-current" /> 4.8
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight leading-none drop-shadow-lg">{place.name}</h1>
                        <div className="flex items-center text-gray-200 gap-6 text-lg font-medium">
                            <span className="flex items-center gap-2"><MapPin size={20} className="text-orange-500" /> {place.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Details & Guide (7 cols) */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* Overview Card */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-green-100 p-3 rounded-2xl text-green-700">
                                    <Info size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-800 uppercase">About Destination</h2>
                            </div>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                {place.details}
                            </p>
                            <p className="text-gray-500 leading-relaxed">
                                {place.description}
                            </p>

                            <div className="mt-8 flex gap-4">
                                <button className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-green-700/20 transition-all hover:-translate-y-1">
                                    Book Now
                                </button>
                                <button className="flex-1 border-2 border-gray-200 hover:border-green-700 hover:text-green-700 text-gray-600 font-bold py-4 px-8 rounded-xl transition-all">
                                    Add to Plan
                                </button>
                            </div>
                        </div>

                        {/* On-Spot Guide */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                                    <Navigation size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-800 uppercase">On-Spot Guide</h2>
                            </div>

                            <div className="space-y-8">
                                {/* Fare Chart */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                                        Local Transport Fares
                                    </h3>
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <div className="space-y-4">
                                            {place.fareChart?.map((fare, index) => (
                                                <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                                                    <span className="text-gray-600 font-medium">{fare.vehicle}</span>
                                                    <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">{fare.rate}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Food & Hotels */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
                                        Recommended Food & Stay
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {place.foodHotels?.map((hotel, index) => (
                                            <span key={index} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                                                {hotel}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Map & Spots (5 cols) */}
                    <div className="lg:col-span-5 space-y-8">

                        {/* Visual Map / Tourist Spots */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                                    <MapIcon size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-800 uppercase">Tourist Spots</h2>
                            </div>

                            {/* Map Placeholder Image */}
                            <div className="relative rounded-2xl overflow-hidden mb-8 shadow-inner border border-gray-200 group">
                                <img
                                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Map View"
                                    className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg transform group-hover:scale-105 transition-transform flex items-center gap-2">
                                        <MapIcon size={16} /> View Interactive Map
                                    </button>
                                </div>
                            </div>

                            {/* Spots List */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Must Visit Places</h3>
                                {place.hiddenSpots?.map((spot, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{spot}</h4>
                                            <p className="text-xs text-gray-400">Tourist Spot</p>
                                        </div>
                                        <div className="text-gray-300 group-hover:text-orange-500">
                                            <Navigation size={16} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Regional Suggestions Mini */}
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">More in {place.region}</h3>
                                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                    {regionalSuggestions.map(suggestion => (
                                        <Link
                                            key={suggestion.id}
                                            to={`/place/${suggestion.id}`}
                                            className="min-w-[80px] group"
                                        >
                                            <img
                                                src={suggestion.image}
                                                alt={suggestion.name}
                                                className="w-20 h-20 rounded-xl object-cover mb-2 shadow-sm group-hover:shadow-md transition-all"
                                            />
                                            <p className="text-[10px] font-bold text-gray-600 text-center leading-tight group-hover:text-orange-600">{suggestion.name}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceDetails;
