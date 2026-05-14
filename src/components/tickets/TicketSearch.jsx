import React, { useState } from 'react';
import { Bus, Train, Plane, Ship, MapPin, Calendar, Search } from 'lucide-react';
import { popularLocations } from '../../data/ticketData';

const TicketSearch = ({ onSearch }) => {
    const [activeTab, setActiveTab] = useState('bus');
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [date, setDate] = useState('');
    const [travelClass, setTravelClass] = useState('AC');

    const tabs = [
        { id: 'bus', label: 'Bus', icon: Bus },
        { id: 'train', label: 'Train', icon: Train },
        { id: 'air', label: 'Air', icon: Plane },
        { id: 'launch', label: 'Launch', icon: Ship },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch({ type: activeTab, from: fromLocation, to: toLocation, date, class: travelClass });
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all duration-300
              ${activeTab === tab.id
                                ? 'bg-[#1B5E20] text-white'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#1B5E20]'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                {/* From */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">From</label>
                    <div className="relative group">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1B5E20] transition-colors" size={18} />
                        <input
                            type="text"
                            list="locations"
                            placeholder="City or Station"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-all"
                            value={fromLocation}
                            onChange={(e) => setFromLocation(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* To */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">To</label>
                    <div className="relative group">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1B5E20] transition-colors" size={18} />
                        <input
                            type="text"
                            list="locations"
                            placeholder="Destination"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-all"
                            value={toLocation}
                            onChange={(e) => setToLocation(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</label>
                    <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1B5E20] transition-colors" size={18} />
                        <input
                            type="date"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-all text-gray-700"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Class */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</label>
                    <select
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] transition-all text-gray-700 appearance-none"
                        value={travelClass}
                        onChange={(e) => setTravelClass(e.target.value)}
                    >
                        <option value="AC">AC Business</option>
                        <option value="Non-AC">Non-AC</option>
                        <option value="Economy">Economy</option>
                        <option value="Luxury">Luxury</option>
                    </select>
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    className="w-full py-3 bg-[#1B5E20] hover:bg-green-800 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                    <Search size={20} />
                    Search Tickets
                </button>
            </form>

            {/* Datalist for suggestions */}
            <datalist id="locations">
                {popularLocations.map((loc) => (
                    <option key={loc} value={loc} />
                ))}
            </datalist>
        </div>
    );
};

export default TicketSearch;
