import React from 'react';
import { Calendar, MapPin, Clock, Star, Users } from 'lucide-react';
import { agencies } from '../../data/tourData';

const EventCard = ({ event, onClick }) => {
    // Handle both camelCase (local mock) and snake_case (Supabase) keys
    const agencyId = event.agencyId || event.agency_id;
    const agency = agencies.find(a => a.id === agencyId);

    // Derived or default values
    const status = event.status || 'open';
    const startDate = event.dates?.start || event.start_date;
    const capacity = event.capacity || event.max_group_size || 20;
    const booked = event.booked || 0;
    const seatsLeft = capacity - booked;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'filling_fast':
                return <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full animate-pulse">Filling Fast 🔥</span>;
            case 'few_seats_left':
                return <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">Few Seats Left ⚡</span>;
            case 'housefull':
                return <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full">Housefull 🔒</span>;
            default:
                return <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">Open for Booking ✨</span>;
        }
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={event.images?.[0] || event.image_url || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                    {getStatusBadge(status)}
                </div>
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                    <Clock size={12} />
                    {event.duration}
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-[#1B5E20] transition-colors">
                        {event.title}
                    </h3>
                    <div className="flex flex-col items-end">
                        <span className="text-xl font-bold text-[#1B5E20]">৳{event.price}</span>
                        <span className="text-xs text-gray-400">per person</span>
                    </div>
                </div>

                {/* Agency Info */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                    <img src={agency?.logo || 'https://ui-avatars.com/api/?name=Agency&background=random'} alt={agency?.name} className="w-6 h-6 rounded-full" />
                    <div className="flex-1">
                        <p className="text-xs font-medium text-gray-700 flex items-center gap-1">
                            {agency?.name || 'Verified Agency'}
                            {(agency?.verified || true) && <span className="text-blue-500">✓</span>}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                        <Star size={12} fill="currentColor" />
                        {agency?.rating || '4.8'}
                    </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{startDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{event.destination}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users size={14} />
                        <span>{seatsLeft} seats left</span>
                    </div>
                    <button className="px-4 py-2 bg-gray-50 hover:bg-[#1B5E20] hover:text-white text-gray-700 rounded-lg text-sm font-bold transition-all">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
