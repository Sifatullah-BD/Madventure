import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { Calendar, MapPin, Clock, Users, Bell, XCircle, ExternalLink, CloudSun, Bus, Phone, Coffee, Camera, AlertTriangle, CheckCircle } from 'lucide-react';
import EventDetailsModal from '../components/events/EventDetailsModal';

const UpcomingEvents = () => {
    const [showCalendarToast, setShowCalendarToast] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const events = [
        {
            id: 1,
            title: 'Sajek Valley Group Tour',
            date: '2025-12-15',
            time: '10:00 PM',
            location: 'Fakirapool Bus Stand',
            organizer: 'Travel Mate BD',
            contact: '01711-123456',
            transport: 'Hanif Enterprise (AC)',
            weather: 'Sunny, 18°C',
            image: 'https://images.unsplash.com/photo-1596472620703-e2e4242c2629?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            daysLeft: 12,
            category: 'Hill Station',
            description: 'Experience the clouds touching the mountains at Sajek Valley. This 3-day tour includes transport, accommodation in eco-resorts, and guided tours to Konglak Para and Ruilui Para.',
            recommendations: [
                { id: 1, name: 'Ruilui Para', type: 'Sightseeing', icon: <Camera size={14} /> },
                { id: 2, name: 'Pangkhua Restaurant', type: 'Food', icon: <Coffee size={14} /> }
            ]
        },
        {
            id: 2,
            title: 'Cox\'s Bazar Beach Camp',
            date: '2025-12-28',
            time: '09:00 PM',
            location: 'Sayedabad Bus Terminal',
            organizer: 'Beach Boys',
            contact: '01811-987654',
            transport: 'Saintmartin Paribahan',
            weather: 'Clear Sky, 22°C',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            daysLeft: 25,
            category: 'Beach Camping',
            description: 'Join us for a night under the stars at the world\'s longest natural sea beach. Bonfire, BBQ, and music await you!',
            recommendations: [
                { id: 3, name: 'Radiant Fish World', type: 'Attraction', icon: <Camera size={14} /> },
                { id: 4, name: 'Mermaid Café', type: 'Food', icon: <Coffee size={14} /> }
            ]
        }
    ];

    const handleAddToCalendar = () => {
        setShowCalendarToast(true);
        setTimeout(() => setShowCalendarToast(false), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12 relative">
            <DashboardHeader title="Upcoming Events" subtitle="Next on your calendar" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

                {events.length > 0 ? (
                    <div className="space-y-8">
                        {events.map(event => (
                            <div key={event.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-8 hover:shadow-md transition-shadow">
                                {/* Image & Countdown */}
                                <div className="w-full lg:w-80 h-64 rounded-xl overflow-hidden flex-shrink-0 relative group">
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <p className="text-xs font-medium opacity-90">Starts in</p>
                                        <p className="text-3xl font-bold">{event.daysLeft} Days</p>
                                    </div>
                                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                                        Confirmed
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-800 mb-1">{event.title}</h3>
                                                <p className="text-primary font-medium flex items-center gap-2">
                                                    <Users size={16} /> Organized by {event.organizer}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-2 text-gray-400 hover:text-primary hover:bg-green-50 rounded-full transition-colors" title="Add Reminder">
                                                    <Bell size={20} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Cancel Join">
                                                    <XCircle size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-600 mb-6">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Calendar size={20} className="text-primary" />
                                                <div>
                                                    <p className="text-xs text-gray-400">Date</p>
                                                    <p className="font-bold text-gray-800">{event.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Clock size={20} className="text-primary" />
                                                <div>
                                                    <p className="text-xs text-gray-400">Time</p>
                                                    <p className="font-bold text-gray-800">{event.time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <MapPin size={20} className="text-primary" />
                                                <div>
                                                    <p className="text-xs text-gray-400">Meeting Point</p>
                                                    <p className="font-bold text-gray-800">{event.location}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Bus size={20} className="text-primary" />
                                                <div>
                                                    <p className="text-xs text-gray-400">Transport</p>
                                                    <p className="font-bold text-gray-800">{event.transport}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Extra Info */}
                                        <div className="flex flex-wrap gap-4 mb-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                                                <CloudSun size={16} className="text-blue-500" />
                                                <span>Forecast: <b>{event.weather}</b></span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100">
                                                <Phone size={16} className="text-purple-500" />
                                                <span>Contact: <b>{event.contact}</b></span>
                                            </div>
                                        </div>

                                        {/* AI Recommendations */}
                                        <div className="mb-6">
                                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <AlertTriangle size={14} className="text-yellow-500" /> Nearby Recommendations (AI)
                                            </h4>
                                            <div className="flex gap-3">
                                                {event.recommendations.map(rec => (
                                                    <div key={rec.id} className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm hover:border-primary transition-colors cursor-pointer">
                                                        <div className="text-gray-400">{rec.icon}</div>
                                                        <span className="font-medium text-gray-700">{rec.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => setSelectedEvent(event)}
                                            className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                                        >
                                            View Full Details
                                        </button>
                                        <button
                                            onClick={handleAddToCalendar}
                                            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                        >
                                            Add to Calendar <ExternalLink size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Upcoming Events</h3>
                        <p className="text-gray-500 mb-6">You haven't joined any tours yet.</p>
                        <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors">
                            Explore Tours
                        </button>
                    </div>
                )}

            </div>

            {/* Event Details Modal */}
            {selectedEvent && (
                <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            )}

            {/* Toast Notification */}
            {showCalendarToast && (
                <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce-in z-50">
                    <CheckCircle className="text-green-400" size={24} />
                    <div>
                        <h4 className="font-bold">Added to Calendar</h4>
                        <p className="text-xs text-gray-400">Event schedule synced successfully.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpcomingEvents;
