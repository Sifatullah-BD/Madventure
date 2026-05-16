import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import EventCard from '../components/tours/EventCard';
import { supabaseService } from '../services/supabaseService';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';

const TourEvents = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const data = await supabaseService.getTours();
                setEvents(data || []);
            } catch (error) {
                console.error("Error fetching tours:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    const filteredEvents = events.filter(event => {
        const matchesFilter = filter === 'all' || (event.category && event.category.toLowerCase() === filter.toLowerCase());
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (event.destination && event.destination.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <DashboardHeader
                title="Group Adventures"
                subtitle="Join curated group tours organized by trusted agencies."
                action={
                    <button 
                        onClick={() => navigate('/tours/create')}
                        className="px-4 py-2 bg-[#1B5E20] text-white text-sm font-bold rounded-lg hover:bg-green-800 transition-colors"
                    >
                        + Create Trip
                    </button>
                }
            />
            <div className="max-w-7xl mx-auto px-6 pb-12">

                {/* Search & Filter */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search destination or tour..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {['All', 'Adventure', 'Relax', 'Trekking', 'Waterfall', 'Camping', 'Horror'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat.toLowerCase())}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap
                  ${filter === cat.toLowerCase()
                                        ? 'bg-[#1B5E20] text-white shadow-lg shadow-green-900/20'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onClick={() => navigate(`/tours/${event.id}`)}
                        />
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No tours found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TourEvents;
