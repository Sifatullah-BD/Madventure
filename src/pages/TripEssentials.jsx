import React from 'react';
import { CheckCircle, Bus, Hotel, Wallet, Backpack, Shield, Smartphone, Calendar, MapPin, ArrowRight } from 'lucide-react';


const TripEssentials = () => {
    return (
        <div className="min-h-screen bg-gray-50">


            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                        alt="Travel Essentials"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
                </div>
                <div className="max-w-[1140px] mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                        Master Your Trip Planning ✈️
                    </h1>
                    <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                        The ultimate checklist for a hassle-free journey. From budget to safety, we've got you covered.
                    </p>
                </div>
            </div>

            <div className="max-w-[1140px] mx-auto px-4 py-16">

                {/* Section 1: Essential Things */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-xl">1</span>
                        Essential Things to Include
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 1.1 Transportation */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                                <Bus size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Transportation Plan</h3>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Bus / Train / Air ticket timing</li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Seat availability & advance booking</li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Backup option (if main fails)</li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Departure & arrival points</li>
                            </ul>
                        </div>

                        {/* 1.2 Accommodation */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                                <Hotel size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Accommodation Plan</h3>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Hotel / Hostel / Guest House name</li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Check-in & check-out time</li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Google ratings (3.8+ recommended)</li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Distance from main spots</li>
                            </ul>
                        </div>

                        {/* 1.3 Budget */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                                <Wallet size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Budget Planning</h3>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Transport cost (to & from)</li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Hotel / Hostel & Food cost</li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Local transport & Entry fees</li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Emergency money (10–15%)</li>
                            </ul>
                        </div>

                        {/* 1.4 Luggage */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 mb-4">
                                <Backpack size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Luggage Checklist</h3>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> NID / Student ID</li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Power bank, Charger, Data cable</li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Medicine & First Aid</li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Toiletries & Water bottle</li>
                            </ul>
                        </div>

                        {/* 1.5 Safety */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-4">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Safety Checklist</h3>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Share Hotel info with family</li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Save OTP/Plate No. for rides</li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Keep emergency balance in phone</li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Avoid unknown places at night</li>
                            </ul>
                        </div>

                        {/* 1.6 Online Tools */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                <Smartphone size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Online Tools</h3>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Google Maps (Navigation)</li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Biman, Shohoz, Red Bus apps</li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> bKash/Nagad (Cashless payment)</li>
                                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> Facebook groups for reviews</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Section 2: Trip Flow Structure */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                        <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-xl">2</span>
                        Trip Flow Structure
                    </h2>

                    <div className="space-y-6">
                        {/* Step 1 */}
                        <div className="flex gap-4 md:gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">1</div>
                                <div className="w-0.5 h-full bg-blue-100 my-2"></div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full">
                                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    <Calendar size={20} className="text-blue-500" /> Decide Date & Duration
                                </h3>
                                <p className="text-gray-600 text-sm">Example: Trip Duration: 3 Days | Date: 15–17 March</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-4 md:gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">2</div>
                                <div className="w-0.5 h-full bg-blue-100 my-2"></div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full">
                                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    <Bus size={20} className="text-blue-500" /> Fix Transport
                                </h3>
                                <p className="text-gray-600 text-sm">Choose bus or train. Book ticket early to avoid hassle.</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-4 md:gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">3</div>
                                <div className="w-0.5 h-full bg-blue-100 my-2"></div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full">
                                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    <Hotel size={20} className="text-blue-500" /> Fix Hotel
                                </h3>
                                <p className="text-gray-600 text-sm">Shortlist 2–3 options within budget. Check Google Maps ratings.</p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex gap-4 md:gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">4</div>
                                <div className="w-0.5 h-full bg-blue-100 my-2"></div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full">
                                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    <MapPin size={20} className="text-blue-500" /> Create Daily Plan
                                </h3>
                                <p className="text-gray-600 text-sm">Note down spots, estimated time, and entry fees for each day.</p>
                            </div>
                        </div>

                        {/* Step 5 */}
                        <div className="flex gap-4 md:gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">5</div>
                                <div className="w-0.5 h-full bg-blue-100 my-2"></div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full">
                                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    <Backpack size={20} className="text-blue-500" /> Pack Important Items
                                </h3>
                                <p className="text-gray-600 text-sm">Travel light! Heavy luggage makes the trip uncomfortable.</p>
                            </div>
                        </div>

                        {/* Step 6 */}
                        <div className="flex gap-4 md:gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">6</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full">
                                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    <Shield size={20} className="text-blue-500" /> Emergency Preparation
                                </h3>
                                <p className="text-gray-600 text-sm">Inform family/friends about your plan. Save emergency contacts.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripEssentials;
