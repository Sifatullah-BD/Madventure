import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { Heart, MapPin, Calendar, ShoppingBag, Plus, Trash2, Edit3, Map as MapIcon, Grid, Download, Upload, Utensils, Hotel, MessageCircle } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';

const Wishlist = () => {
    const [activeTab, setActiveTab] = useState('places');
    const [viewMode, setViewMode] = useState('grid'); // grid | map
    const [showToast, setShowToast] = useState(null);

    const savedPlaces = [
        { id: 1, name: 'Nilgiri', location: 'Bandarban', image: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', note: 'Best for sunset' },
        { id: 2, name: 'Ratargul', location: 'Sylhet', image: 'https://images.unsplash.com/photo-1596472620703-e2e4242c2629?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', note: 'Visit in monsoon' },
        { id: 3, name: 'Saint Martin', location: 'Cox\'s Bazar', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', note: 'Coconut Jinjira trip' },
    ];

    const savedTours = [
        { id: 1, name: 'Sajek Valley 3 Days', location: 'Rangamati', image: 'https://images.unsplash.com/photo-1596472620703-e2e4242c2629?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', note: 'Plan for December' },
    ];

    const handleAction = (action) => {
        setShowToast(action);
        setTimeout(() => setShowToast(null), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12 relative">
            <DashboardHeader title="My Wishlist" subtitle="Your dream destinations & plans" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    {/* Tabs */}
                    <div className="flex space-x-2 bg-white p-1 rounded-xl shadow-sm overflow-x-auto max-w-full">
                        {[
                            { id: 'places', label: 'Places', icon: MapPin },
                            { id: 'tours', label: 'Tours', icon: Calendar },
                            { id: 'hotels', label: 'Hotels', icon: Hotel },
                            { id: 'food', label: 'Food', icon: Utensils },
                            { id: 'posts', label: 'Posts', icon: MessageCircle },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon size={16} /> {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-100 flex">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                                title="Grid View"
                            >
                                <Grid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'map' ? 'bg-gray-100 text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                                title="Map View"
                            >
                                <MapIcon size={20} />
                            </button>
                        </div>

                        <button
                            onClick={() => handleAction('Exported')}
                            className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-gray-600 font-bold text-sm flex items-center gap-2 hover:bg-gray-50"
                        >
                            <Download size={16} /> Export
                        </button>
                        <button
                            onClick={() => handleAction('Imported')}
                            className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-gray-600 font-bold text-sm flex items-center gap-2 hover:bg-gray-50"
                        >
                            <Upload size={16} /> Import
                        </button>
                    </div>
                </div>

                {/* Content */}
                {viewMode === 'map' ? (
                    <div className="bg-gray-200 rounded-2xl h-[600px] flex items-center justify-center relative overflow-hidden border border-gray-300 animate-fade-in">
                        <div className="text-center">
                            <MapIcon size={64} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-bold text-gray-600">Map View Mode</h3>
                            <p className="text-gray-500">Visualizing {savedPlaces.length} saved locations...</p>
                        </div>
                        {/* Mock Map Pins */}
                        <div className="absolute top-1/3 left-1/4 animate-bounce">
                            <MapPin size={32} className="text-red-500 drop-shadow-lg" fill="currentColor" />
                        </div>
                        <div className="absolute top-1/2 right-1/3 animate-bounce" style={{ animationDelay: '0.5s' }}>
                            <MapPin size={32} className="text-red-500 drop-shadow-lg" fill="currentColor" />
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        {activeTab === 'places' && (
                            savedPlaces.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <MapPin size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">No items saved</h3>
                                    <p className="text-gray-500 mb-6">Start exploring to add places to your wishlist.</p>
                                    <a href="/destinations" className="inline-block bg-primary text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-green-700 transition-colors">
                                        Explore Destinations
                                    </a>
                                </div>
                            ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {savedPlaces.map(place => (
                                    <div key={place.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100">
                                        <div className="h-48 overflow-hidden relative">
                                            <img src={place.image} alt={place.name} onError={handleImageError} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                            <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-gray-800 text-lg mb-1">{place.name}</h3>
                                            <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                                                <MapPin size={14} /> {place.location}
                                            </p>

                                            {place.note && (
                                                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-4 relative group/note">
                                                    <p className="text-xs text-yellow-800 italic">"{place.note}"</p>
                                                    <button className="absolute top-1 right-1 text-yellow-600 opacity-0 group-hover/note:opacity-100 transition-opacity">
                                                        <Edit3 size={12} />
                                                    </button>
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                <button className="flex-1 bg-gray-100 hover:bg-primary hover:text-white text-gray-600 py-2 rounded-lg text-xs font-bold transition-colors">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add New Placeholder */}
                                <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-8 text-gray-400 hover:border-primary hover:text-primary hover:bg-green-50 transition-all cursor-pointer h-full min-h-[300px]">
                                    <Plus size={48} className="mb-4" />
                                    <span className="font-bold">Explore More Places</span>
                                </div>
                            </div>
                            )
                        )}

                        {activeTab === 'tours' && (
                            savedTours.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <Calendar size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">No tours saved</h3>
                                    <p className="text-gray-500 mb-6">Save tours you're interested in to plan your next trip.</p>
                                    <a href="/tours" className="inline-block bg-primary text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-green-700 transition-colors">
                                        Find Tours
                                    </a>
                                </div>
                            ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {savedTours.map(tour => (
                                    <div key={tour.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100">
                                        <div className="h-48 overflow-hidden relative">
                                            <img src={tour.image} alt={tour.name} onError={handleImageError} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-gray-800 text-lg mb-1">{tour.name}</h3>
                                            <p className="text-gray-500 text-sm flex items-center gap-1 mb-3">
                                                <MapPin size={14} /> {tour.location}
                                            </p>
                                            <button className="w-full bg-primary text-white py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            )
                        )}

                        {['hotels', 'food', 'posts'].includes(activeTab) && (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <ShoppingBag size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">No items saved</h3>
                                <p className="text-gray-500 mb-6">Start exploring to add items to your wishlist.</p>
                                <a href="/explore" className="inline-block bg-primary text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-green-700 transition-colors">
                                    Explore
                                </a>
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce-in z-50">
                    <Download className="text-green-400" size={24} />
                    <div>
                        <h4 className="font-bold">Success</h4>
                        <p className="text-xs text-gray-400">Wishlist {showToast} successfully.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
