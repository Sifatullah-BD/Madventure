import React, { useState } from 'react';
import { Clock, Star, Filter, ArrowRight } from 'lucide-react';
import { operators } from '../../data/ticketData';

const SearchResults = ({ results, onSelectTrip, loading }) => {
    const [sortBy, setSortBy] = useState('cheapest');

    const getOperator = (trip) => {
        if (trip.provider_name) return { name: trip.provider_name, logo: 'https://ui-avatars.com/api/?name=' + trip.provider_name + '&background=random', rating: 4.5, reviews: 120 };
        return operators.find(op => op.id === trip.operatorId) || { name: 'Unknown', logo: '', rating: 0, reviews: 0 };
    };

    const sortedResults = [...results].sort((a, b) => {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        if (sortBy === 'cheapest') return priceA - priceB;
        
        const timeA = a.departure_time || a.departureTime || '';
        const timeB = b.departure_time || b.departureTime || '';
        if (sortBy === 'earliest') return timeA.localeCompare(timeB);
        
        return 0;
    });

    if (loading) return <div className="text-center py-20 text-gray-400 font-bold animate-pulse">Searching for best routes...</div>;

    if (results.length === 0) return (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-bold">No trips found for this route/date.</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                    <Filter size={18} />
                    <span>Sort by:</span>
                </div>
                <div className="flex gap-2">
                    {[
                        { id: 'cheapest', label: 'Cheapest' },
                        { id: 'earliest', label: 'Earliest' },
                    ].map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setSortBy(filter.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                                ${sortBy === filter.id ? 'bg-[#1B5E20] text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
                            `}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {sortedResults.map((trip) => {
                    const operator = getOperator(trip);
                    const departure = trip.departure_time || trip.departureTime;
                    const arrival = trip.arrival_time || trip.arrivalTime || '--:--';
                    const seats = trip.available_seats !== undefined ? trip.available_seats : trip.seatsAvailable;
                    
                    return (
                        <div key={trip.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all group">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="flex items-center gap-4 w-full md:w-1/4">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 p-2 flex items-center justify-center border border-gray-100 text-gray-400 font-bold">
                                        {operator.logo ? <img src={operator.logo} alt="" className="w-full h-full object-contain" /> : operator.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{operator.name}</h3>
                                        <div className="flex items-center gap-1 text-yellow-500 text-xs font-medium">
                                            <Star size={12} fill="currentColor" />
                                            <span>{operator.rating}</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{trip.transport_type || trip.class || 'BUS'}</p>
                                    </div>
                                </div>

                                <div className="flex-1 w-full flex items-center justify-between md:justify-center gap-4 md:gap-12 border-t md:border-t-0 md:border-l md:border-r border-gray-100 py-4 md:py-0 px-0 md:px-6 my-4 md:my-0">
                                    <div className="text-center">
                                        <p className="text-lg font-black text-gray-900">{departure}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{trip.route_from || trip.from}</p>
                                    </div>

                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-16 h-[2px] bg-gray-200 relative">
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                        </div>
                                        <ArrowRight size={14} className="text-gray-300" />
                                    </div>

                                    <div className="text-center">
                                        <p className="text-lg font-black text-gray-900">{arrival}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{trip.route_to || trip.to}</p>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto flex flex-row md:flex-col items-center justify-between gap-4">
                                    <div className="text-right md:text-center">
                                        <p className="text-2xl font-black text-[#1B5E20]">৳{trip.price}</p>
                                        <p className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{seats} seats left</p>
                                    </div>
                                    <button
                                        onClick={() => onSelectTrip(trip)}
                                        className="px-6 py-2.5 bg-[#1B5E20] hover:bg-green-800 text-white rounded-xl font-bold shadow-lg shadow-green-900/10 transition-all text-sm"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SearchResults;
