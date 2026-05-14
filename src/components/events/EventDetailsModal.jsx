import React, { useState } from 'react';
import { X, MapPin, Calendar, Clock, User, Phone, Mail, Share2, Heart, Ticket, Video, Image as ImageIcon, Info, CheckCircle, AlertCircle, Facebook, Instagram, Twitter, Youtube, ExternalLink } from 'lucide-react';

const EventDetailsModal = ({ event, onClose }) => {
    const [activeTab, setActiveTab] = useState('about');

    if (!event) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                >
                    <X size={24} />
                </button>

                {/* 1. Event Header / Banner */}
                <div className="relative h-64 md:h-80 flex-shrink-0">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                                    {event.category || 'Adventure'}
                                </span>
                                <h2 className="text-3xl md:text-5xl font-black mb-2 leading-tight">{event.title}</h2>
                                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-200">
                                    <span className="flex items-center gap-1"><Calendar size={18} /> {event.date}</span>
                                    <span className="flex items-center gap-1"><Clock size={18} /> {event.time}</span>
                                    <span className="flex items-center gap-1"><MapPin size={18} /> {event.location}</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2">
                                    <Share2 size={20} /> Share
                                </button>
                                <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-900/20">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="flex flex-col lg:flex-row">

                        {/* Left Column: Main Info */}
                        <div className="flex-1 p-6 md:p-10 space-y-8">

                            {/* Organizer Info */}
                            <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                        <img src={`https://ui-avatars.com/api/?name=${event.organizer}&background=random`} alt={event.organizer} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Organized by</p>
                                        <h4 className="font-bold text-gray-800 text-lg hover:text-primary cursor-pointer transition-colors">{event.organizer}</h4>
                                    </div>
                                </div>
                                <button className="text-primary font-bold text-sm border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors">
                                    View Profile
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-gray-200">
                                {['about', 'schedule', 'gallery', 'reviews'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="min-h-[300px]">
                                {activeTab === 'about' && (
                                    <div className="space-y-6 animate-fade-in">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-3">Event Overview</h3>
                                            <p className="text-gray-600 leading-relaxed">{event.description || "Join us for an unforgettable experience! This event promises excitement, adventure, and memories that will last a lifetime. Whether you're a seasoned traveler or a first-timer, there's something for everyone."}</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white p-4 rounded-xl border border-gray-100">
                                                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> Highlights</h4>
                                                <ul className="space-y-2 text-sm text-gray-600">
                                                    <li className="flex items-start gap-2">• Guided tours by experts</li>
                                                    <li className="flex items-start gap-2">• Complimentary snacks & drinks</li>
                                                    <li className="flex items-start gap-2">• Exclusive photo opportunities</li>
                                                </ul>
                                            </div>
                                            <div className="bg-white p-4 rounded-xl border border-gray-100">
                                                <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><AlertCircle size={18} className="text-orange-500" /> Important Rules</h4>
                                                <ul className="space-y-2 text-sm text-gray-600">
                                                    <li className="flex items-start gap-2">• Arrive 30 mins before start</li>
                                                    <li className="flex items-start gap-2">• Bring valid ID proof</li>
                                                    <li className="flex items-start gap-2">• No outside food allowed</li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Map Embed Mock */}
                                        <div className="rounded-xl overflow-hidden h-64 bg-gray-200 relative group cursor-pointer">
                                            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Map" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <button className="bg-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
                                                    <MapPin size={18} className="text-primary" /> View on Google Maps
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'schedule' && (
                                    <div className="space-y-4 animate-fade-in">
                                        {[
                                            { time: '09:00 AM', title: 'Gathering & Breakfast', desc: 'Meet at the designated point.' },
                                            { time: '10:00 AM', title: 'Departure', desc: 'Bus leaves for the destination.' },
                                            { time: '01:00 PM', title: 'Lunch Break', desc: 'Traditional local cuisine.' },
                                            { time: '03:00 PM', title: 'Sightseeing', desc: 'Explore the main attractions.' },
                                            { time: '06:00 PM', title: 'Sunset View', desc: 'Relax and enjoy the view.' },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex gap-4 group">
                                                <div className="w-24 flex-shrink-0 text-right">
                                                    <span className="font-bold text-gray-800 block">{item.time}</span>
                                                </div>
                                                <div className="relative flex-1 pb-8 border-l-2 border-gray-200 pl-8 last:border-0 last:pb-0">
                                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-primary group-hover:scale-125 transition-transform"></div>
                                                    <h4 className="font-bold text-gray-800 text-lg">{item.title}</h4>
                                                    <p className="text-gray-500 text-sm">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'gallery' && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
                                        {[1, 2, 3, 4, 5, 6].map(i => (
                                            <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-200 relative group cursor-pointer">
                                                <img src={`https://source.unsplash.com/random/400x400?event,party&sig=${i}`} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                    <ImageIcon size={24} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Sidebar / Booking */}
                        <div className="w-full lg:w-96 bg-white border-l border-gray-100 p-6 md:p-8 overflow-y-auto">

                            {/* Ticket Selection */}
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Ticket className="text-primary" /> Select Tickets
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Regular Pass', price: 500, left: 20 },
                                        { name: 'VIP Access', price: 1200, left: 5 },
                                        { name: 'Group Bundle (5)', price: 2200, left: 8 },
                                    ].map((ticket, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-xl p-4 hover:border-primary cursor-pointer transition-colors group">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-gray-800">{ticket.name}</span>
                                                <span className="font-bold text-primary text-lg">৳{ticket.price}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>{ticket.left} seats left</span>
                                                <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:bg-primary group-hover:border-primary transition-colors"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Booking Summary */}
                            <div className="bg-gray-50 p-6 rounded-2xl mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600">Total Amount</span>
                                    <span className="text-2xl font-black text-gray-900">৳0</span>
                                </div>
                                <button className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200 mb-3">
                                    Proceed to Payment
                                </button>
                                <p className="text-center text-xs text-gray-500">Secure payment powered by SSLCommerz</p>
                            </div>

                            {/* Contact & Help */}
                            <div className="space-y-4">
                                <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Need Help?</h4>
                                <a href={`tel:${event.contact}`} className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors p-3 bg-gray-50 rounded-xl">
                                    <Phone size={18} />
                                    <span className="font-medium">{event.contact}</span>
                                </a>
                                <div className="flex gap-2">
                                    <button className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                                        <Facebook size={16} /> Event Page
                                    </button>
                                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                        <ExternalLink size={16} /> Website
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsModal;
