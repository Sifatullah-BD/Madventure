import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, AlertTriangle, Compass, Car, Utensils, Gem, WifiOff, MessageSquare, UserPlus, ClipboardCheck, ArrowRight, Shield } from 'lucide-react';

const Solutions = () => {
    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-heading font-bold text-primary mb-6">
                        Solving Real Travel Problems
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Madventure isn't just a guide; it's a complete toolkit designed to tackle the most common challenges travelers face in Bangladesh.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* 1. Budget Management */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-green-500 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        <DollarSign className="text-green-600 mb-6" size={40} />
                        <h3 className="font-bold text-2xl mb-3 text-gray-800">Budget Management</h3>
                        <p className="text-gray-600 mb-6">Track expenses and estimate costs accurately. Never overspend again.</p>
                        <div className="bg-green-50 p-4 rounded-lg mb-4">
                            <p className="text-xs font-bold text-green-800 mb-1">Demo:</p>
                            <div className="w-full bg-green-200 rounded-full h-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <p className="text-xs text-green-700 mt-1 text-right">75% of budget used</p>
                        </div>
                        <button className="text-green-600 font-bold hover:underline flex items-center gap-1">Try Demo <ArrowRight size={16} /></button>
                    </div>

                    {/* 2. Emergency SOS */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-red-500 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        <Shield className="text-red-600 mb-6" size={40} />
                        <h3 className="font-bold text-2xl mb-3 text-gray-800">Emergency SOS</h3>
                        <p className="text-gray-600 mb-6">Instant access to local help and safety alerts. Your safety guardian.</p>
                        <div className="bg-red-50 p-4 rounded-lg mb-4 flex items-center justify-center">
                            <div className="animate-pulse flex items-center gap-2 text-red-600 font-bold">
                                <AlertTriangle size={20} /> Sending Alert...
                            </div>
                        </div>
                        <button className="text-red-600 font-bold hover:underline flex items-center gap-1">View Feature <ArrowRight size={16} /></button>
                    </div>

                    {/* 3. AI Tour Planner */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-blue-500 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        <Compass className="text-blue-600 mb-6" size={40} />
                        <h3 className="font-bold text-2xl mb-3 text-gray-800">AI Tour Planner</h3>
                        <p className="text-gray-600 mb-6">Smart itineraries tailored to your preferences. Travel smarter.</p>
                        <div className="bg-blue-50 p-4 rounded-lg mb-4 space-y-2">
                            <div className="h-2 bg-blue-200 rounded w-3/4"></div>
                            <div className="h-2 bg-blue-200 rounded w-1/2"></div>
                            <div className="h-2 bg-blue-200 rounded w-5/6"></div>
                        </div>
                        <Link to="/planner" className="text-blue-600 font-bold hover:underline flex items-center gap-1">Plan Now <ArrowRight size={16} /></Link>
                    </div>

                    {/* ... (other cards) ... */}

                    {/* 10. Smart Checklist */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-teal-500 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        <ClipboardCheck className="text-teal-600 mb-6" size={40} />
                        <h3 className="font-bold text-2xl mb-3 text-gray-800">Smart Checklist</h3>
                        <p className="text-gray-600 mb-6">Auto-generated packing lists for your trip.</p>
                        <Link to="/planner" className="text-teal-600 font-bold hover:underline flex items-center gap-1">Get Checklist <ArrowRight size={16} /></Link>
                    </div>

                    {/* 4. Local Fare Chart */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-yellow-500 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        <Car className="text-yellow-600 mb-6" size={40} />
                        <h3 className="font-bold text-2xl mb-3 text-gray-800">Local Fare Chart</h3>
                        <p className="text-gray-600 mb-6">Standard fares for Rickshaw, CNG, and Boats. Avoid scams.</p>
                        <Link to="/guide" className="text-yellow-600 font-bold hover:underline flex items-center gap-1">Check Fares <ArrowRight size={16} /></Link>
                    </div>

                    {/* 5. Halal Food Finder */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-emerald-500 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        <Utensils className="text-emerald-600 mb-6" size={40} />
                        <h3 className="font-bold text-2xl mb-3 text-gray-800">Halal Food Finder</h3>
                        <p className="text-gray-600 mb-6">Locate hygiene-rated Halal restaurants nearby.</p>
                        <Link to="/guide" className="text-emerald-600 font-bold hover:underline flex items-center gap-1">Find Food <ArrowRight size={16} /></Link>
                    </div>

                    {/* 6. Hidden Gems */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-purple-500 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        <Gem className="text-purple-600 mb-6" size={40} />
                        <h3 className="font-bold text-2xl mb-3 text-gray-800">Hidden Gems</h3>
                        <p className="text-gray-600 mb-6">Discover off-beat locations beyond the crowds.</p>
                        <Link to="/destinations" className="text-purple-600 font-bold hover:underline flex items-center gap-1">Explore <ArrowRight size={16} /></Link>
                    </div>

                    {/* 7. Offline Mode */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-gray-500 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        <WifiOff className="text-gray-600 mb-6" size={40} />
                        <h3 className="font-bold text-2xl mb-3 text-gray-800">Offline Mode</h3>
                        <p className="text-gray-600 mb-6">Access maps and guides without internet.</p>
                        <span className="text-gray-400 font-bold text-xs uppercase border border-gray-300 px-2 py-1 rounded">Coming Soon</span>
                    </div>

                    {/* 8. Travel Forum */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-indigo-500 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        <MessageSquare className="text-indigo-600 mb-6" size={40} />
                        <h3 className="font-bold text-2xl mb-3 text-gray-800">Travel Forum</h3>
                        <p className="text-gray-600 mb-6">Ask questions and share experiences.</p>
                        <span className="text-indigo-400 font-bold text-xs uppercase border border-indigo-300 px-2 py-1 rounded">Coming Soon</span>
                    </div>

                    {/* 9. Travel Partner */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-pink-500 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        <UserPlus className="text-pink-600 mb-6" size={40} />
                        <h3 className="font-bold text-2xl mb-3 text-gray-800">Travel Partner</h3>
                        <p className="text-gray-600 mb-6">Find safe companions for your journey.</p>
                        <span className="text-pink-400 font-bold text-xs uppercase border border-pink-300 px-2 py-1 rounded">Coming Soon</span>
                    </div>

                    {/* 10. Smart Checklist */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-teal-500 hover:shadow-2xl transition-all transform hover:-translate-y-1">
                        <ClipboardCheck className="text-teal-600 mb-6" size={40} />
                        <h3 className="font-bold text-2xl mb-3 text-gray-800">Smart Checklist</h3>
                        <p className="text-gray-600 mb-6">Auto-generated packing lists for your trip.</p>
                        <Link to="/planner" className="text-teal-600 font-bold hover:underline flex items-center gap-1">Get Checklist <ArrowRight size={16} /></Link>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Link to="/" className="inline-block bg-secondary hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105">
                        Start Your Journey Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Solutions;
