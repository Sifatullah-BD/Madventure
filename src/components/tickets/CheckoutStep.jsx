import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';

const CheckoutStep = ({ trip, seats, totalPrice, onPaymentConfirm }) => {
    const [paymentMethod, setPaymentMethod] = useState('bkash');
    const [loading, setLoading] = useState(false);

    const handlePayment = () => {
        setLoading(true);
        // Simulate payment process
        setTimeout(() => {
            setLoading(false);
            onPaymentConfirm();
        }, 2000);
    };

    const paymentOptions = [
        { id: 'bkash', name: 'bKash', icon: <Smartphone className="text-pink-500" />, color: 'bg-pink-50', border: 'border-pink-200' },
        { id: 'nagad', name: 'Nagad', icon: <Smartphone className="text-orange-500" />, color: 'bg-orange-50', border: 'border-orange-200' },
        { id: 'card', name: 'Credit Card', icon: <CreditCard className="text-blue-500" />, color: 'bg-blue-50', border: 'border-blue-200' },
        { id: 'wallet', name: 'MadVenture Wallet', icon: <Wallet className="text-emerald-500" />, color: 'bg-emerald-50', border: 'border-emerald-200' },
    ];

    return (
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Left: Payment Methods */}
            <div className="flex-1 space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
                    <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Select Payment Method</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {paymentOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setPaymentMethod(option.id)}
                                className={`relative p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${
                                    paymentMethod === option.id 
                                    ? `border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-500/10` 
                                    : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl ${option.color} flex items-center justify-center`}>
                                    {option.icon}
                                </div>
                                <span className="font-black text-xs uppercase tracking-widest text-gray-800">{option.name}</span>
                                {paymentMethod === option.id && (
                                    <div className="absolute top-3 right-3 text-emerald-500">
                                        <CheckCircle2 size={18} fill="currentColor" className="text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Dynamic Form based on method */}
                    <div className="mt-8 p-6 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                        {paymentMethod === 'card' ? (
                            <div className="space-y-4">
                                <input type="text" placeholder="Card Number" className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="MM/YY" className="bg-white border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm" />
                                    <input type="text" placeholder="CVV" className="bg-white border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm" />
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-sm text-gray-500 font-medium">You will be redirected to {paymentMethod.toUpperCase()} portal</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-emerald-50 p-6 rounded-3xl flex items-center gap-4 border border-emerald-100">
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-emerald-900 uppercase tracking-widest">Secure Checkout</p>
                        <p className="text-[10px] text-emerald-700 font-medium">Your payment is protected by enterprise-grade encryption.</p>
                    </div>
                </div>
            </div>

            {/* Right: Booking Details */}
            <div className="w-full lg:w-96">
                <div className="bg-[#0a0a0a] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                    {/* Decorative Ring */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    
                    <h3 className="text-xl font-black mb-8 tracking-tight">Booking Summary</h3>
                    
                    <div className="space-y-6 mb-10">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Route</p>
                                <p className="text-sm font-black text-emerald-400">{trip.from} → {trip.to}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Type</p>
                                <p className="text-sm font-black">{trip.type}</p>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Date & Time</p>
                                <p className="text-sm font-black">Today, {trip.departureTime}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Seats</p>
                                <p className="text-sm font-black text-emerald-400">{seats.join(', ')}</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 font-medium">Subtotal</span>
                                <span className="font-black">৳{totalPrice}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-gray-400 font-medium">Processing Fee</span>
                                <span className="font-black">৳20</span>
                            </div>
                            <div className="flex justify-between items-center mt-6">
                                <span className="text-lg font-black uppercase tracking-widest text-emerald-400">Total</span>
                                <span className="text-3xl font-black">৳{totalPrice + 20}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black h-16 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} /> Processing...
                            </>
                        ) : (
                            <>Confirm & Pay Now</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutStep;
