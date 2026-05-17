import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Backpack, MapPin, Clock, Wallet, ArrowRight, ListFilter } from 'lucide-react';

import { districtsDetailed } from '../data/districtsDetailed';

const StudentTours = () => {
    const [filter, setFilter] = useState('all'); // all, under1000, 1day

    // Get all districts with student tours
    const allTours = districtsDetailed.filter(d => d.student_tours && d.student_tours.length > 0);

    // Apply filters
    const filteredTours = allTours.filter(district => {
        const tour = district.student_tours[0];
        if (filter === 'under1000') {
            // Simple check based on string "800৳ - 1000৳" -> extract first number
            const price = parseInt(tour.budget.replace(/[^0-9]/g, ''));
            return price <= 1000;
        }
        if (filter === '1day') {
            return tour.duration.toLowerCase().includes('1 day');
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050f08] transition-colors">


            {/* Hero Banner */}
            <div className="bg-[#1B5E20] text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="max-w-[1140px] mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-full mb-6">
                        <Backpack size={32} className="text-yellow-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">Student Backpack Tours</h1>
                    <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                        Curated budget-friendly trips for students. Explore Bangladesh without breaking the bank.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-[1140px] mx-auto px-4 -mt-8 relative z-20 mb-12">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex flex-wrap items-center justify-center gap-4 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-bold mr-4">
                        <ListFilter size={20} />
                        Filters:
                    </div>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    >
                        All Tours
                    </button>
                    <button
                        onClick={() => setFilter('under1000')}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${filter === 'under1000' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    >
                        Under 1000৳
                    </button>
                    <button
                        onClick={() => setFilter('1day')}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${filter === '1day' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    >
                        1 Day Trips
                    </button>
                </div>
            </div>

            {/* Tour Grid */}
            <div className="max-w-[1140px] mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTours.map((district) => {
                        const tour = district.student_tours[0];
                        return (
                            <div key={district.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group">
                                {/* Image */}
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={district.hero_image}
                                        alt={tour.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 dark:text-gray-200 shadow-sm flex items-center gap-1">
                                        <Clock size={14} className="text-orange-500" />
                                        {tour.duration}
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                                        <MapPin size={14} className="text-yellow-400" />
                                        {district.name_en}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-primary transition-colors">
                                        {tour.title}
                                    </h3>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {tour.spots.slice(0, 3).map((spot, idx) => (
                                            <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md">
                                                {spot}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Estimated Cost</p>
                                            <p className="text-green-600 dark:text-green-400 font-bold text-lg flex items-center gap-1">
                                                <Wallet size={18} />
                                                {tour.budget}
                                            </p>
                                        </div>
                                        <Link
                                            to={`/district/${district.id}`}
                                            className="bg-primary text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
                                        >
                                            View Plan <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredTours.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No tours found matching your filters.</p>
                        <button
                            onClick={() => setFilter('all')}
                            className="mt-4 text-primary font-bold hover:underline"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentTours;
