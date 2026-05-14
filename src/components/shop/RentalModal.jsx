import React, { useState, useEffect } from 'react';
import { X, Calendar, Calculator, Info } from 'lucide-react';

const RentalModal = ({ isOpen, onClose, product }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalDays, setTotalDays] = useState(0);
    const [totalRent, setTotalRent] = useState(0);

    const handleDateChange = (type, value) => {
        // Year Limit Check (4 digits)
        if (value) {
            const year = value.split('-')[0];
            if (year.length > 4) return;
        }

        if (type === 'start') {
            setStartDate(value);
            // If new Start Date is after current End Date, reset End Date
            if (endDate && new Date(value) > new Date(endDate)) {
                setEndDate('');
                alert("Start date cannot be after end date!");
            }
        } else {
            // End Date Logic
            if (startDate && new Date(value) < new Date(startDate)) {
                alert("End date cannot be before start date!");
            } else {
                setEndDate(value);
            }
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (start > end) return; // Safety check

            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive

            if (diffDays > 0) {
                setTotalDays(diffDays);
                setTotalRent(diffDays * product.price);
            } else {
                setTotalDays(0);
                setTotalRent(0);
            }
        }
    }, [startDate, endDate, product]);

    if (!isOpen || !product) return null;

    const handleConfirm = () => {
        alert(`Rental Confirmed!\n\nItem: ${product.name}\nDays: ${totalDays}\nTotal Payable: ৳${totalRent + product.deposit}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-primary p-4 flex justify-between items-center text-white">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Calendar size={20} /> Rent Gear
                    </h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Product Summary */}
                    <div className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">{product.name}</h4>
                            <p className="text-primary font-bold text-sm">৳{product.price} / day</p>
                        </div>
                    </div>

                    {/* Date Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Start Date</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                value={startDate}
                                max="2099-12-31"
                                onChange={(e) => handleDateChange('start', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">End Date</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                value={endDate}
                                max="2099-12-31"
                                onChange={(e) => handleDateChange('end', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Cost Calculation */}
                    {totalDays > 0 && (
                        <div className="bg-green-50 p-4 rounded-xl space-y-2 border border-green-100">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Rental Duration</span>
                                <span className="font-bold">{totalDays} Days</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Rent (৳{product.price} x {totalDays})</span>
                                <span className="font-bold">৳{totalRent}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                    Security Deposit <Info size={12} className="text-gray-400" />
                                </span>
                                <span className="font-bold">৳{product.deposit}</span>
                            </div>
                            <div className="border-t border-green-200 pt-2 flex justify-between text-base font-bold text-primary">
                                <span>Total Payable</span>
                                <span>৳{totalRent + product.deposit}</span>
                            </div>
                            <p className="text-[10px] text-center text-gray-500 mt-2">
                                * Security deposit is fully refundable upon return.
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <button
                        onClick={handleConfirm}
                        disabled={totalDays <= 0}
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/20"
                    >
                        Confirm Rental
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RentalModal;
