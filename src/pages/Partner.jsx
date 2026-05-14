import React, { useState } from 'react';
import { Briefcase, CheckCircle, TrendingUp, Users, Globe, ArrowRight, Upload, User, FileText } from 'lucide-react';
import DashboardHeader from '../components/dashboard/DashboardHeader';

const Partner = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-950">
            <DashboardHeader
                title="Grow Your Business with Madventure"
                subtitle="Join thousands of hotels, tour guides, and rental services growing their revenue with us."
            />
            <div className="max-w-6xl mx-auto px-4 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Side: Benefits */}
                    <div className="space-y-6">

                        <div className="flex gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Free Marketing</h3>
                                <p className="text-gray-600">Showcase your business to a global audience without spending a dime on ads.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Increase Revenue</h3>
                                <p className="text-gray-600">Get more bookings and customers directly through our platform.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Business Dashboard</h3>
                                <p className="text-gray-600">Manage bookings, track analytics, and respond to reviews easily.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Registration Form */}
                    <div id="register-form" className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                        {!submitted ? (
                            <>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <Briefcase className="text-primary" /> Register Your Business
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                                        <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="e.g. Sea View Hotel" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                                                <option>Hotel / Resort</option>
                                                <option>Tour Guide</option>
                                                <option>Rent-a-Car</option>
                                                <option>Restaurant</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                            <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="City / Area" />
                                        </div>
                                    </div>

                                    {/* Owner Info Section */}
                                    <div className="border-t border-gray-100 pt-4">
                                        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <User size={16} /> Owner Information
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                                                <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Full Name" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">NID Number</label>
                                                <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="National ID" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                                        <input type="tel" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="+880..." />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="business@example.com" />
                                    </div>

                                    {/* Trade License Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Trade License / Business Proof</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer bg-gray-50">
                                            <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                                            <p className="text-sm text-gray-600 font-medium">Click to upload document</p>
                                            <p className="text-xs text-gray-400">PDF, JPG or PNG (Max 5MB)</p>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                                        Submit Application <ArrowRight size={20} />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6 animate-bounce">
                                    <CheckCircle size={40} />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">Application Received!</h2>
                                <p className="text-gray-600 mb-8">Thank you for your interest. Our team will review your application and contact you within 24 hours.</p>
                                <button onClick={() => setSubmitted(false)} className="text-primary font-bold hover:underline">
                                    Submit another application
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Partner;
