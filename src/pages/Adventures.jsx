import React, { useState } from 'react';
import { Mountain, Tent, Waves, Zap, ArrowRight, CheckCircle, AlertTriangle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const Adventures = () => {
    const { language } = useLanguage();
    const [difficulty, setDifficulty] = useState('All');

    const adventureSpots = [
        {
            id: 1,
            name: language === 'bn' ? 'নাফাকুম জলপ্রপাত' : 'Nafakhum Waterfall',
            location: 'Bandarban',
            type: 'Waterfall',
            level: 'Extreme',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            warnings: language === 'bn' ? ['গাইড আবশ্যক', 'নেটওয়ার্ক নেই'] : ['Guide Mandatory', 'No Network'],
            description: language === 'bn' ? 'বাংলার নায়াগ্রা হিসেবে পরিচিত। ট্র্যাকিং এবং নৌকা ভ্রমণ আবশ্যক।' : 'Known as the Niagara of Bangladesh. Requires boat ride and trekking.'
        },
        {
            id: 2,
            name: language === 'bn' ? 'অমিয়াখুম জলপ্রপাত' : 'Amiakhum Waterfall',
            location: 'Bandarban',
            type: 'Waterfall',
            level: 'Extreme',
            image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            warnings: language === 'bn' ? ['খাড়া পাহাড়', 'পিচ্ছিল'] : ['Steep Descent', 'Slippery'],
            description: language === 'bn' ? 'বান্দরবানের অন্যতম সুন্দর ও দুর্গম জলপ্রপাত।' : 'One of the most beautiful and isolated waterfalls.'
        },
        {
            id: 3,
            name: language === 'bn' ? 'কেওক্রাডং চূড়া' : 'Keokradong Peak',
            location: 'Bandarban',
            type: 'Trekking',
            level: 'Moderate',
            image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            warnings: language === 'bn' ? ['উচ্চতা সতর্কতা'] : ['High Altitude'],
            description: language === 'bn' ? 'বাংলাদেশের অন্যতম সর্বোচ্চ চূড়া। মেঘের ভিউর জন্য বিখ্যাত।' : 'One of the highest peaks in Bangladesh. Famous for its cloudy view.'
        },
        {
            id: 4,
            name: language === 'bn' ? 'মারায়ন তং' : 'Marayan Tong',
            location: 'Bandarban',
            type: 'Camping',
            level: 'Moderate',
            image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            warnings: language === 'bn' ? ['তীব্র বাতাস'] : ['Strong Wind'],
            description: language === 'bn' ? 'পাহাড়ের চূড়ায় দারুণ ক্যাম্পিং গ্রাউন্ড।' : 'A flat camping ground on top of a hill with a 360-degree view.'
        }
    ];

    const filteredSpots = difficulty === 'All'
        ? adventureSpots
        : adventureSpots.filter(spot => spot.type === difficulty);

    return (
        <div className="min-h-screen bg-white dark:bg-[#050f08] font-sans text-gray-900 dark:text-gray-100 selection:bg-orange-500 selection:text-white transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-[#fffaf5] dark:bg-[#081a0e]">
                {/* Abstract Background Decoration */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-50/50 dark:bg-orange-950/20 rounded-l-[10rem] -z-0"></div>
                
                <div className="max-w-[1140px] mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Text Content */}
                        <div className="flex-1 space-y-8 text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <h1 className="text-6xl md:text-8xl font-[900] leading-[0.9] text-gray-900 dark:text-white tracking-tighter">
                                    {language === 'bn' ? <>ট্র্যাকিং ও <br /><span className="text-orange-600">ক্যাম্পিং</span></> : <>Trekking & <br /><span className="text-orange-600">Camping</span></>}
                                </h1>
                                <p className="text-xl text-gray-500 dark:text-gray-400 mt-6 max-w-md font-medium">
                                    {language === 'bn' ? 'আপনার পরবর্তী অ্যাডভেঞ্চারের জন্য একটি সঠিক গাইডলাইন।' : 'A perfect guide to your snow peak adventures and wild forest explorations.'}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex gap-4 pt-4"
                            >
                                <button className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-orange-600/30 flex items-center gap-3 group transition-all">
                                    {language === 'bn' ? 'বুক করুন' : 'BOOK NOW'} 
                                    <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                                        <ArrowRight size={20} />
                                    </div>
                                </button>
                            </motion.div>
                        </div>

                        {/* Hero Image */}
                        <div className="flex-1 relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                                className="relative z-10"
                            >
                                <div className="w-full h-[500px] rounded-[4rem] rounded-tr-[15rem] rounded-bl-[15rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border-8 border-white dark:border-gray-800">
                                    <img 
                                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80" 
                                        className="w-full h-full object-cover"
                                        alt="Adventure" 
                                    />
                                </div>

                                <div className="absolute -bottom-10 -right-10 bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-2xl z-20 flex items-center gap-4 border border-gray-50 dark:border-slate-700">
                                    <div className="flex -space-x-4">
                                        {[1, 2, 3].map(i => (
                                            <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-800 shadow-sm" alt="" />
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">100k</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">People explored</p>
                                    </div>
                                </div>
                            </motion.div>
                            
                            {/* Decorative Sparks */}
                            <div className="absolute -top-10 right-10 text-orange-200 animate-pulse">
                                <Zap size={40} fill="currentColor" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-[1140px] mx-auto px-6 py-24">
                {/* Section Title */}
                <div className="text-center mb-16 space-y-4">
                    <span className="text-orange-600 font-bold uppercase tracking-widest text-sm">Destinations</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900">Find Your Next <br /> <span className="text-orange-600">Adventure Point</span></h2>
                </div>

                {/* Filter Chips - Clean Style */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {['All', 'Trekking', 'Waterfall', 'Camping', 'Danger Zone'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setDifficulty(cat)}
                            className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all ${
                                difficulty === cat 
                                ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' 
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Adventure Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredSpots.map((spot) => (
                        <motion.div 
                            key={spot.id} 
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 group"
                        >
                            <div className="h-72 relative">
                                <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-orange-600">
                                    ⭐ 4.9
                                </div>
                                <div className="absolute bottom-6 left-6">
                                    <span className="px-4 py-1.5 bg-orange-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                        {spot.level}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-2xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">{spot.name}</h4>
                                        <p className="text-gray-400 text-sm flex items-center gap-1 mt-1 font-medium">
                                            <MapPin size={14} className="text-orange-600" /> {spot.location}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-gray-900">$20</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">/Person</p>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2">{spot.description}</p>
                                <Link 
                                    to={`/tours/${spot.id}/book`}
                                    className="w-full block text-center bg-gray-50 group-hover:bg-orange-600 group-hover:text-white text-gray-900 py-4 rounded-2xl font-black transition-all"
                                >
                                    Book Adventure
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

                {/* Bottom CTA */}
                <div className="bg-[#022c22] rounded-2xl p-8 relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                    <div className="relative z-10 max-w-xl mx-auto">
                        <h2 className="text-2xl md:text-4xl font-black uppercase text-white mb-4">
                            Start Your New <span className="text-orange-500">Adventure</span>
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">
                            There are still many amazing destinations scattered around the world.
                        </p>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-orange-500/30 transition-transform hover:scale-105">
                            Get Started
                        </button>
                    </div>
                </div>
        </div>
    );
};

export default Adventures;
