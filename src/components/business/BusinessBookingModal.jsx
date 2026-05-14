import React, { useState } from 'react';
import { X, Calendar, Users, MessageSquare, CreditCard, CheckCircle } from 'lucide-react';

const BusinessBookingModal = ({ listing, business, onClose }) => {
    const [step, setStep] = useState(1); // 1: form, 2: confirm
    const [form, setForm] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1,
        name: '',
        phone: '',
        email: '',
        specialRequests: '',
    });

    if (!listing || !business) return null;

    const nights = form.checkIn && form.checkOut
        ? Math.max(1, Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / (1000 * 60 * 60 * 24)))
        : 1;

    const totalPrice = listing.priceUnit === 'per_night'
        ? listing.price * nights
        : listing.priceUnit === 'per_person'
            ? listing.price * form.guests
            : listing.price;

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-surface w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-primary/10 dark:bg-primary/5 p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{listing.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{business.name}</p>
                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-2xl font-black text-primary">৳{listing.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">/ {listing.priceUnit === 'per_night' ? 'রাত' : listing.priceUnit === 'per_person' ? 'জন' : listing.priceUnit === 'per_trip' ? 'ট্রিপ' : 'ফিক্সড'}</span>
                    </div>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Dates */}
                        {(listing.priceUnit === 'per_night') && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">
                                        <Calendar size={12} className="inline mr-1" /> চেক-ইন
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={form.checkIn}
                                        onChange={e => setForm({ ...form, checkIn: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">
                                        <Calendar size={12} className="inline mr-1" /> চেক-আউট
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={form.checkOut}
                                        min={form.checkIn}
                                        onChange={e => setForm({ ...form, checkOut: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Guests */}
                        <div>
                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">
                                <Users size={12} className="inline mr-1" /> অতিথি সংখ্যা
                            </label>
                            <select
                                value={form.guests}
                                onChange={e => setForm({ ...form, guests: parseInt(e.target.value) })}
                                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            >
                                {Array.from({ length: listing.maxGuests || 10 }).map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1} জন</option>
                                ))}
                            </select>
                        </div>

                        {/* Contact */}
                        <div>
                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">আপনার নাম</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                placeholder="আপনার পুরো নাম"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">ফোন নম্বর</label>
                            <input
                                type="tel"
                                required
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                placeholder="+880 1XXX-XXXXXX"
                            />
                        </div>

                        {/* Special Requests */}
                        <div>
                            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">
                                <MessageSquare size={12} className="inline mr-1" /> বিশেষ অনুরোধ (ঐচ্ছিক)
                            </label>
                            <textarea
                                value={form.specialRequests}
                                onChange={e => setForm({ ...form, specialRequests: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                placeholder="কোনো বিশেষ চাহিদা থাকলে লিখুন..."
                            />
                        </div>

                        {/* Price Summary */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl space-y-2">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                <span>{listing.title}</span>
                                <span>৳{listing.price.toLocaleString()}</span>
                            </div>
                            {listing.priceUnit === 'per_night' && form.checkIn && form.checkOut && (
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>× {nights} রাত</span>
                                </div>
                            )}
                            {listing.priceUnit === 'per_person' && (
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>× {form.guests} জন</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                                <span>মোট</span>
                                <span className="text-primary">৳{totalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <CreditCard size={18} /> বুকিং কনফার্ম করুন
                        </button>
                    </form>
                ) : (
                    /* Success State */
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <CheckCircle size={40} className="text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">বুকিং সফল! 🎉</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            আপনার বুকিং রিকোয়েস্ট পাঠানো হয়েছে। ব্যবসা প্রতিষ্ঠান শীঘ্রই নিশ্চিত করবে।
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-left text-sm space-y-2 mb-6">
                            <p><strong>নাম:</strong> {form.name}</p>
                            <p><strong>ফোন:</strong> {form.phone}</p>
                            <p><strong>মোট:</strong> <span className="text-primary font-bold">৳{totalPrice.toLocaleString()}</span></p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            বন্ধ করুন
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusinessBookingModal;
