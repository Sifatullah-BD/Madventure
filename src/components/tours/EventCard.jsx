import React from 'react';
import { Calendar, MapPin, Clock, Star, Users, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { agencies } from '../../data/tourData';

const EventCard = ({ event, onClick }) => {
    const agencyId = event.agencyId || event.agency_id;
    const agency = agencies.find(a => a.id === agencyId);

    const status = event.status || 'open';
    const startDate = event.dates?.start || event.start_date;
    const capacity = event.capacity || event.max_group_size || 20;
    const booked = event.booked || 0;
    const seatsLeft = capacity - booked;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'filling_fast':
                return <span className="bg-orange-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">Filling Fast 🔥</span>;
            case 'few_seats_left':
                return <span className="bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Few Seats Left ⚡</span>;
            case 'housefull':
                return <span className="bg-gray-800 text-gray-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Housefull 🔒</span>;
            default:
                return <span className="bg-emerald-500 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Open Now ✨</span>;
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className="group relative bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 cursor-pointer flex flex-col h-full"
        >
            {/* Visual Header (Ticket Top) */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={event.images?.[0] || event.image_url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800'}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                
                {/* Status Float */}
                <div className="absolute top-6 left-6 z-20">
                    {getStatusBadge(status)}
                </div>

                {/* Price Float */}
                <div className="absolute top-6 right-6 z-20">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl shadow-2xl">
                        <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">Price</p>
                        <p className="text-xl font-black text-white leading-none">৳{event.price}</p>
                    </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <Clock size={14} className="text-emerald-400" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">{event.duration}</span>
                </div>
            </div>

            {/* Content Section (Ticket Body) */}
            <div className="p-8 flex flex-col flex-grow relative">
                {/* Dotted Ticket Line */}
                <div className="absolute top-0 left-8 right-8 h-[1px] border-t border-dashed border-white/10"></div>

                <div className="mb-6 flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin size={14} className="text-emerald-400" />
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{event.destination}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white leading-tight mb-4 group-hover:text-emerald-400 transition-colors">
                        {event.title}
                    </h3>
                </div>

                {/* Agency & Ratings */}
                <div className="flex items-center justify-between mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10">
                            <img src={agency?.logo} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Agency</p>
                            <p className="text-xs font-black text-white flex items-center gap-1">
                                {agency?.name} <ShieldCheck size={12} className="text-cyan-400" />
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 justify-end text-yellow-400">
                            <Star size={12} className="fill-current" />
                            <span className="text-xs font-black">{agency?.rating || '4.8'}</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Rating</p>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Availability</span>
                        <div className="flex items-center gap-2">
                            <Users size={14} className="text-emerald-400" />
                            <span className="text-xs font-black text-white">{seatsLeft} Seats Left</span>
                        </div>
                    </div>
                    <motion.button 
                        whileTap={{ x: 5 }}
                        className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
                    >
                        Book Now <ArrowRight size={16} />
                    </motion.button>
                </div>
            </div>

            {/* Side Notches (Ticket Style) */}
            <div className="absolute top-56 -left-3 w-6 h-6 bg-[#050505] rounded-full border border-white/5"></div>
            <div className="absolute top-56 -right-3 w-6 h-6 bg-[#050505] rounded-full border border-white/5"></div>
        </motion.div>
    );
};

export default EventCard;
