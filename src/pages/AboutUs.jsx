import React from 'react';
import { Shield, Compass, Heart, Users, Mail } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        More Than a Guide. <br />
                        <span className="text-[#1B5E20]">We Are Your Partner in Every Adventure.</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Madventure is Bangladesh's first Adventure & Utility Super App.
                    </p>
                </div>

                {/* Who We Are */}
                <section className="mb-16 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-[#1B5E20]">
                            <Users size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">1. Who We Are</h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        At Madventure, we are a tribe of thrill-seekers, engineers, and explorers. We noticed a missing link in the tourism industry: while many apps help you book a luxury hotel, very few help you survive and thrive on the road.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        We are Bangladesh's first Adventure & Utility Super App. Whether you are trekking deep into the mountains or exploring a bustling city, we accompany you every step of the way—ensuring your journey is safe, smart, and full of life.
                    </p>
                </section>

                {/* Our Mission */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <Compass size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">2. Our Mission</h2>
                    </div>
                    <div className="bg-[#1B5E20] text-white p-8 rounded-3xl shadow-lg mb-8">
                        <p className="text-2xl font-bold text-center italic mb-6">
                            "To make every adventure safe, accessible, and unforgettable."
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                <p>🌍 Travelers explore the unknown without fear.</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                <p>💰 No tourist gets scammed with unfair local fares.</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                <p>🚑 Emergency help is available even in the wildest locations.</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                <p>⚡ Planning a complex trip takes seconds, not days.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why We Built This */}
                <section className="mb-16 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Why We Built This?</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Adventure is about freedom, but it often brings stress—uncertainty about safety, routes, and costs.
                    </p>
                    <p className="text-gray-600 leading-relaxed font-medium">
                        We asked ourselves: "What if you had a smart digital guide in your pocket who knows the trails, the prices, and the locals?"
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                        Madventure is that guide. From AI-driven itinerary planning to an offline SOS safety net, we combined cutting-edge technology with the spirit of exploration to solve real-world travel problems.
                    </p>
                </section>

                {/* What Sets Us Apart */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">4. What Sets Us Apart?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                                <Shield size={20} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Guardian Safety</h3>
                            <p className="text-gray-600 text-sm">Our dedicated SOS & Live Tracking features keep you connected, ensuring you are never truly alone.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                                <Compass size={20} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">AI-Powered Planning</h3>
                            <p className="text-gray-600 text-sm">We use advanced AI to generate personalized adventure plans and budget estimates instantly.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                                <Heart size={20} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Fair & Transparent</h3>
                            <p className="text-gray-600 text-sm">We provide verified Local Fare Charts (Rickshaw/Boat/Jeep fares) to protect you from overpaying.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
                                <Users size={20} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Adventure Community</h3>
                            <p className="text-gray-600 text-sm">A vibrant forum where real explorers share hidden gems, live updates, and form travel squads.</p>
                        </div>
                    </div>
                </section>

                {/* Our Journey */}
                <section className="mb-16 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white p-8 rounded-3xl shadow-lg text-center">
                    <h2 className="text-2xl font-bold mb-6">5. Our Journey</h2>
                    <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
                        <div>
                            <p className="text-green-200 text-sm uppercase tracking-wider mb-1">Founded</p>
                            <p className="text-3xl font-bold">2024</p>
                        </div>
                        <div>
                            <p className="text-green-200 text-sm uppercase tracking-wider mb-1">Origin</p>
                            <p className="text-3xl font-bold">Bangladesh 🇧🇩</p>
                        </div>
                        <div>
                            <p className="text-green-200 text-sm uppercase tracking-wider mb-1">Goal</p>
                            <p className="text-xl font-bold mt-1">#1 Adventure Platform in South Asia</p>
                        </div>
                    </div>
                </section>

                {/* Join the Adventure */}
                <section className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">6. Join the Adventure</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                        Whether you are a solo backpacker, a weekend traveler, or a pro trekker—Madventure is built to fuel your journey.
                    </p>
                    <p className="text-2xl font-bold text-[#1B5E20] mb-8">Plan Smart. Travel Safe. Go Mad.</p>

                    <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md border border-gray-100">
                        <Mail className="text-[#1B5E20]" />
                        <span className="font-medium text-gray-900">madventurepim19@gmail.com</span>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;
