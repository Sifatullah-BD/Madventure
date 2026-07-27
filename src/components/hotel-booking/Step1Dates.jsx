import React, { useState } from 'react';
import { Calendar as CalendarIcon, Moon } from 'lucide-react';
import { useToast } from '../ui/Toast';

const Step1Dates = ({ hotelData, formData, setFormData, onNext }) => {
    const toast = useToast();
    // Basic calendar mock using inputs
    const [checkIn, setCheckIn] = useState(formData.checkIn || '');
    const [checkOut, setCheckOut] = useState(formData.checkOut || '');

    const handleNext = () => {
        if (!checkIn || !checkOut) {
            toast.warning("Please select both check-in and check-out dates.");
            return;
        }
        
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        
        if (outDate <= inDate) {
            toast.warning("Check-out date must be after check-in date.");
            return;
        }

        const msPerDay = 1000 * 60 * 60 * 24;
        const nights = Math.ceil((outDate - inDate) / msPerDay);

        setFormData({ ...formData, checkIn, checkOut, nights });
        onNext();
    };

    // Calculate nights for real-time UI
    let displayNights = 0;
    if (checkIn && checkOut && new Date(checkOut) > new Date(checkIn)) {
        displayNights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CalendarIcon className="text-primary" /> Select Stay Dates
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Check-in Date</label>
                    <input 
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Check-out Date</label>
                    <input 
                        type="date"
                        min={checkIn || new Date().toISOString().split('T')[0]}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    />
                </div>
            </div>

            {displayNights > 0 && (
                <div className="flex items-center gap-2 text-primary font-bold bg-green-50 p-4 rounded-xl border border-green-100 animate-in fade-in">
                    <Moon size={20} />
                    <span>Total Duration: {displayNights} Night{displayNights > 1 ? 's' : ''}</span>
                    <span className="ml-auto text-sm text-gray-600 bg-white px-3 py-1 rounded-lg border">
                        {Math.floor(Math.random() * 5) + 2} rooms available for these dates
                    </span>
                </div>
            )}

            <div className="flex justify-end pt-6 border-t border-gray-100">
                <button 
                    onClick={handleNext}
                    className="bg-primary hover:bg-green-800 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-colors"
                >
                    Continue to Guests
                </button>
            </div>
        </div>
    );
};

export default Step1Dates;
