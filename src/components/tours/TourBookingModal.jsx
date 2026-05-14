import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Users } from 'lucide-react';

const TourBookingModal = ({ event, isOpen, onClose, onConfirm }) => {
    const [seats, setSeats] = useState(1);
    const [paymentType, setPaymentType] = useState('full'); // full, partial

    if (!isOpen) return null;

    const totalAmount = seats * event.price;
    const bookingAmount = seats * event.bookingMoney;
    const dueAmount = totalAmount - (paymentType === 'full' ? totalAmount : bookingAmount);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-[#1B5E20] p-6 text-white flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold mb-1">Confirm Booking</h3>
                        <p className="text-green-100 text-sm">{event.title}</p>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Seat Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Seats</label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSeats(Math.max(1, seats - 1))}
                                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 font-bold"
                            >
                                -
                            </button>
                            <span className="text-xl font-bold text-gray-900 w-8 text-center">{seats}</span>
                            <button
                                onClick={() => setSeats(Math.min(10, seats + 1))}
                                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 font-bold"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Payment Options */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Payment Option</label>
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => setPaymentType('full')}
                                className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between
                  ${paymentType === 'full'
                                        ? 'border-[#1B5E20] bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div>
                                    <p className="font-bold text-gray-900">Pay Full Amount</p>
                                    <p className="text-xs text-gray-500">Get instant confirmation</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-[#1B5E20]">৳{totalAmount}</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setPaymentType('partial')}
                                className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between
                  ${paymentType === 'partial'
                                        ? 'border-[#1B5E20] bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div>
                                    <p className="font-bold text-gray-900">Book with Booking Money</p>
                                    <p className="text-xs text-gray-500">Pay rest later</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-[#1B5E20]">৳{bookingAmount}</p>
                                    <p className="text-xs text-gray-400 line-through">৳{totalAmount}</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Payable Now</span>
                            <span className="font-bold text-gray-900">৳{paymentType === 'full' ? totalAmount : bookingAmount}</span>
                        </div>
                        {paymentType === 'partial' && (
                            <div className="flex justify-between text-orange-600">
                                <span>Due Amount</span>
                                <span className="font-bold">৳{dueAmount}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100">
                    <button
                        onClick={() => onConfirm({ seats, paymentType, amount: paymentType === 'full' ? totalAmount : bookingAmount })}
                        className="w-full py-3 bg-[#1B5E20] text-white rounded-xl font-bold shadow-lg shadow-green-900/20 hover:bg-green-800 transition-all flex items-center justify-center gap-2"
                    >
                        <CreditCard size={18} />
                        Confirm & Pay ৳{paymentType === 'full' ? totalAmount : bookingAmount}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TourBookingModal;
