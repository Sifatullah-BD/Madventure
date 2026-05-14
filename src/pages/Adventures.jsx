import React, { useState } from 'react';
import { Mountain, Tent, Waves, Zap, ArrowRight, CheckCircle, AlertTriangle, MapPin } from 'lucide-react';

const Adventures = () => {
    const [difficulty, setDifficulty] = useState('All');

    const adventureSpots = [
        {
            id: 1,
            name: 'Nafakhum Waterfall',
            location: 'Bandarban',
            type: 'Waterfall',
            level: 'Extreme',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            warnings: ['Guide Mandatory', 'No Network'],
            description: 'Known as the Niagara of Bangladesh. Requires boat ride and trekking.'
        },
        {
            id: 2,
            name: 'Amiakhum Waterfall',
            location: 'Bandarban',
            type: 'Waterfall',
            level: 'Extreme',
            image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            warnings: ['Steep Descent', 'Slippery'],
            description: 'One of the most beautiful and isolated waterfalls near the Indian border.'
        },
        {
            id: 3,
            name: 'Keokradong Peak',
            location: 'Bandarban',
            type: 'Trekking',
            level: 'Moderate',
            image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            warnings: ['High Altitude'],
            description: 'One of the highest peaks in Bangladesh. Famous for its cloudy view.'
        },
        {
            id: 4,
            name: 'Marayan Tong',
            location: 'Bandarban',
            type: 'Camping',
            level: 'Moderate',
            image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            warnings: ['Strong Wind', 'No Water Source'],
            description: 'A flat camping ground on top of a hill with a 360-degree view.'
        },
        {
            id: 5,
            name: 'Andharmanik',
            location: 'Thanchi',
            type: 'Danger Zone',
            level: 'Extreme',
            image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            warnings: ['Restricted Area', 'Wild Animals'],
            description: 'A mysterious and dangerous valley. Entry often restricted.'
        },
        {
            id: 6,
            name: 'Ham Ham Waterfall',
            location: 'Moulvibazar',
            type: 'Waterfall',
            level: 'Hard',
            image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            warnings: ['Leech Alert', 'Slippery'],
            description: 'Deep inside the Rajkandi reserve forest. Famous for leeches.'
        },
        {
            id: 7,
            name: 'Sundarbans Deep Jungle',
            location: 'Khulna',
            type: 'Danger Zone',
            level: 'Hard',
            image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            warnings: ['Tiger Zone', 'Tides'],
            description: 'The largest mangrove forest. Home of the Royal Bengal Tiger.'
        },
        {
            id: 8,
            name: 'Saka Haphong',
            location: 'Bandarban',
            type: 'Trekking',
            level: 'Extreme',
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            warnings: ['Very Remote', 'Physical Fitness'],
            description: 'Currently considered the highest peak. A test of endurance.'
        },
        {
            id: 9,
            name: 'Nijhum Dwip',
            location: 'Noakhali',
            type: 'Camping',
            level: 'Easy',
            image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            warnings: ['Deer Crossing'],
            description: 'A quiet island with mangrove forests and spotted deer.'
        }
    ];

    const filteredSpots = difficulty === 'All'
        ? adventureSpots
        : adventureSpots.filter(spot => spot.type === difficulty);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-500 selection:text-white">
            {/* Hero Section */}
            <div className="relative bg-[#022c22] pt-16 pb-24 overflow-hidden rounded-b-[2.5rem]">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-2/3 h-full bg-[#064e3b] opacity-20 rounded-l-full transform translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Text Content */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                                Live Your <br />
                                <span className="text-orange-500">Adventure</span>
                            </h1>
                            <p className="text-base text-gray-300 max-w-lg">
                                Don't wait until tomorrow, discover your adventure now and feel the sensation of closeness to nature around you.
                            </p>

                            {/* Search Box */}
                            <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/20 flex items-center max-w-md mt-6">
                                <div className="flex-1 px-4 border-r border-white/20">
                                    <label className="block text-[10px] text-gray-400 uppercase tracking-wider">Location</label>
                                    <input type="text" placeholder="Bandarban, BD" className="w-full bg-transparent text-white text-sm font-bold placeholder-gray-500 focus:outline-none" />
                                </div>
                                <div className="flex-1 px-4">
                                    <label className="block text-[10px] text-gray-400 uppercase tracking-wider">Date</label>
                                    <input type="text" placeholder="16 Aug 2025" className="w-full bg-transparent text-white text-sm font-bold placeholder-gray-500 focus:outline-none" />
                                </div>
                                <button className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-colors shadow-lg shadow-orange-500/30">
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative hidden lg:block">
                            <div className="absolute inset-0 bg-orange-500 rounded-full transform rotate-6 scale-90 opacity-20 blur-xl"></div>
                            <div className="relative z-10 bg-orange-500 rounded-[2.5rem] p-1.5 rotate-3 shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1526772662000-3f88f107f5d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Hiker"
                                    className="rounded-[2rem] w-full h-[400px] object-cover -rotate-3 border-4 border-white/10"
                                />
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute bottom-8 -left-8 bg-white p-3 rounded-xl shadow-xl z-20 flex items-center gap-3 animate-bounce duration-[3000ms]">
                                <div className="bg-green-100 p-2 rounded-full text-green-600">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Location</p>
                                    <p className="font-bold text-sm text-gray-900">Bandarban, BD</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Section Header & Filter */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-6">
                    <div>
                        <h2 className="text-3xl font-black uppercase text-gray-900 mb-2">
                            Find Popular <span className="text-orange-500">Destinations</span>
                        </h2>
                        <div className="h-1 w-16 bg-orange-500 rounded-full"></div>
                    </div>

                    {/* Filter Chips */}
                    <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
                        {[
                            { name: 'All', icon: null },
                            { name: 'Trekking', icon: '🧗' },
                            { name: 'Waterfall', icon: '🌊' },
                            { name: 'Danger Zone', icon: '⚠️', danger: true },
                            { name: 'Camping', icon: '⛺' }
                        ].map(cat => (
                            <button
                                key={cat.name}
                                onClick={() => setDifficulty(cat.name)}
                                className={`px-5 py-2 rounded-full font-bold text-xs uppercase whitespace-nowrap transition-all flex items-center gap-2 shadow-sm ${difficulty === cat.name
                                    ? cat.danger ? 'bg-red-600 text-white shadow-red-500/30' : 'bg-orange-500 text-white shadow-orange-500/30'
                                    : 'bg-white text-gray-500 border border-gray-100 hover:border-orange-500 hover:text-orange-500'
                                    }`}
                            >
                                <span>{cat.icon}</span> {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Adventure Spots Grid */}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6 mb-16">
                    {filteredSpots.map((spot) => (
                        <div key={spot.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 border border-gray-100 flex flex-col h-full">
                            {/* Card Image */}
                            <div className="h-48 overflow-hidden relative shrink-0">
                                <img src={spot.image} alt={spot.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-3 right-3">
                                    <span className="bg-white/90 backdrop-blur text-gray-900 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-sm flex items-center gap-1">
                                        ⭐ 4.8
                                    </span>
                                </div>
                                <div className="absolute bottom-3 left-3 flex gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${spot.level === 'Extreme' ? 'bg-red-600 text-white' : spot.level === 'Hard' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}`}>
                                        {spot.level}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-lg font-black uppercase text-gray-900 mb-1 group-hover:text-orange-500 transition-colors line-clamp-1">{spot.name}</h3>
                                <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                                    <MapPin size={12} className="text-orange-500" /> {spot.location}
                                </div>

                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {spot.warnings.map(warn => (
                                        <span key={warn} className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 flex items-center gap-1">
                                            <AlertTriangle size={8} /> {warn}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                                    <div>
                                        <span className="text-xl font-black text-gray-900">$20</span>
                                        <span className="text-[10px] text-gray-400 font-medium">/Person</span>
                                    </div>
                                    <button className="bg-orange-100 hover:bg-orange-500 hover:text-white text-orange-600 px-4 py-1.5 rounded-lg font-bold text-xs transition-all duration-300">
                                        Book
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="bg-[#022c22] rounded-2xl p-8 relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                    <div className="relative z-10 max-w-xl mx-auto">
                        <h2 className="text-2xl md:text-4xl font-black uppercase text-white mb-4">
                            Start Your New <span className="text-orange-500">Adventure</span>
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">
                            There are still many amazing destinations scattered around the world.
                        </p>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-orange-500/30 transition-transform hover:scale-105">
                            Get Started
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Adventures;
