import React, { useState, useEffect } from 'react';
import { generateBusLayout } from '../../data/ticketData';

const SeatSelection = ({ trip, onConfirmBooking }) => {
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        // Simulate fetching seat layout
        const layout = generateBusLayout(10, trip.price);
        setSeats(layout);
    }, [trip]);

    const handleSeatClick = (seat) => {
        if (seat.status === 'booked') return;

        if (seat.status === 'selected') {
            // Deselect
            const updatedSeats = seats.map(s =>
                s.id === seat.id ? { ...s, status: 'available' } : s
            );
            setSeats(updatedSeats);
            setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
        } else {
            // Select
            const updatedSeats = seats.map(s =>
                s.id === seat.id ? { ...s, status: 'selected' } : s
            );
            setSeats(updatedSeats);
            setSelectedSeats([...selectedSeats, seat.id]);
        }
    };

    const totalPrice = selectedSeats.length * trip.price;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col lg:flex-row gap-8">
            {/* Left: Seat Map */}
            <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Select Seats</h3>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mb-8 text-xs font-medium text-gray-600">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-gray-100 border border-gray-200"></div>
                        <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-[#1B5E20] text-white flex items-center justify-center">✓</div>
                        <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-red-100 border border-red-200 cursor-not-allowed"></div>
                        <span>Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-pink-100 border border-pink-200"></div>
                        <span>Women Only</span>
                    </div>
                </div>

                {/* Driver Seat */}
                <div className="flex justify-end mb-6 pr-4">
                    <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-400 border-t-transparent rotate-45"></div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-5 gap-y-4 gap-x-8 max-w-xs mx-auto">
                    {seats.map((seat, index) => {
                        // Add aisle gap
                        const isAisle = (index + 1) % 4 === 2; // Simple logic for 2x2 layout

                        return (
                            <React.Fragment key={seat.id}>
                                <button
                                    onClick={() => handleSeatClick(seat)}
                                    disabled={seat.status === 'booked'}
                                    className={`
                    w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200
                    ${seat.status === 'available' ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200' : ''}
                    ${seat.status === 'selected' ? 'bg-[#1B5E20] text-white shadow-lg shadow-green-900/20 transform scale-105' : ''}
                    ${seat.status === 'booked' ? 'bg-red-50 text-red-300 border border-red-100 cursor-not-allowed' : ''}
                    ${seat.status === 'women_only' ? 'bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100' : ''}
                  `}
                                >
                                    {seat.status === 'selected' ? '✓' : seat.id}
                                </button>
                                {/* Insert aisle spacer after 2nd seat in a row */}
                                {(index + 1) % 4 === 2 && <div className="w-4"></div>}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Right: Summary & Checkout */}
            <div className="w-full lg:w-80 bg-gray-50 rounded-xl p-6 h-fit">
                <h4 className="font-bold text-gray-900 mb-4">Booking Summary</h4>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Operator</span>
                        <span className="font-medium text-gray-900">Green Line</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Route</span>
                        <span className="font-medium text-gray-900">{trip.from} - {trip.to}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Date</span>
                        <span className="font-medium text-gray-900">Today</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Seat(s)</span>
                        <span className="font-medium text-gray-900">{selectedSeats.join(', ') || '-'}</span>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-end">
                        <span className="text-gray-500 font-medium">Total Amount</span>
                        <span className="text-2xl font-bold text-[#1B5E20]">৳{totalPrice}</span>
                    </div>
                </div>

                <button
                    onClick={() => onConfirmBooking(selectedSeats)}
                    disabled={selectedSeats.length === 0}
                    className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all
            ${selectedSeats.length > 0
                            ? 'bg-[#1B5E20] hover:bg-green-800 text-white shadow-green-900/20 transform hover:-translate-y-0.5'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Proceed to Pay
                </button>

                <p className="text-xs text-center text-gray-400 mt-4">
                    By proceeding, you agree to our Terms & Conditions
                </p>
            </div>
        </div>
    );
};

export default SeatSelection;
