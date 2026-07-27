import React, { useState } from 'react';
import { Calendar as CalendarIcon, Users } from 'lucide-react';
import { useToast } from '../ui/Toast';

const Step1DateSeat = ({ tourData, departures, formData, setFormData, onNext }) => {
    const toast = useToast();
    // Fallback dates if no real departures found (or in mock mode)
    const today = new Date();
    const fallbackDates = [
        new Date(today.getTime() + 86400000 * 3),
        new Date(today.getTime() + 86400000 * 10),
    ];

    const displayDepartures = (departures && departures.length > 0) 
        ? departures 
        : fallbackDates.map(d => ({ 
            departure_date: d.toISOString().split('T')[0], 
            capacity: 30, 
            booked_seats: 0 
        }));

    const [selectedDate, setSelectedDate] = useState(formData.date || '');
    const [selectedSeats, setSelectedSeats] = useState(formData.seats || 1);

    const handleNext = () => {
        if (!selectedDate) {
            toast.error("Please select a departure date.");
            return;
        }
        setFormData({ ...formData, date: selectedDate, seats: selectedSeats });
        onNext();
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <CalendarIcon className="text-primary" /> Departure Date
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayDepartures.map((dep, idx) => {
                        const dateObj = new Date(dep.departure_date);
                        const dateStr = dep.departure_date;
                        const available = dep.capacity - dep.booked_seats;
                        
                        return (
                            <div 
                                key={idx}
                                onClick={() => available > 0 && setSelectedDate(dateStr)}
                                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${available <= 0 ? 'opacity-50 cursor-not-allowed bg-gray-50' : selectedDate === dateStr ? 'border-primary bg-green-50' : 'border-gray-200 hover:border-green-300 bg-white'}`}
                            >
                                <div className="font-bold text-gray-800">{dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                <div className={`text-sm mt-1 ${available > 10 ? 'text-green-600' : available > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                                    {available > 0 ? `Available Seats: ${available}` : 'Sold Out'}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="text-primary" /> Travelers
                </h3>
                <div className="flex items-center gap-4">
                    <label className="text-gray-600 font-medium">Number of Seats:</label>
                    <select 
                        value={selectedSeats}
                        onChange={(e) => setSelectedSeats(Number(e.target.value))}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                    >
                        {[...Array(6)].map((_, i) => (
                            <option key={i+1} value={i+1}>{i+1} Traveler{(i+1)>1 ? 's' : ''}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end pt-6">
                <button 
                    onClick={handleNext}
                    className="bg-primary hover:bg-green-800 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-colors"
                >
                    Next Step
                </button>
            </div>
        </div>
    );
};

export default Step1DateSeat;
