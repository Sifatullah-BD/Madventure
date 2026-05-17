import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
const DISCOVERIES = (lang) => [
    {
        id: 'cox',
        name: lang === 'bn' ? 'কক্সবাজার' : "Cox's Bazar",
        title: lang === 'bn' ? 'বিশ্বের দীর্ঘতম সমুদ্র সৈকত' : "World's Longest Beach",
        spots: lang === 'bn' ? ['ইনাণী বিচ', 'হিমছড়ি ঝর্ণা', 'মহেশখালী দ্বীপ'] : ['Inani Beach', 'Himchari', 'Moheshkhali'],
        description: lang === 'bn' ? 'নীল জলরাশি আর বালুকাময় সৈকতের মায়ায় হারিয়ে যান প্রকৃতির একদম কাছে।' : 'Lose yourself in the magic of blue waters and sandy shores close to nature.',
        x: 85,
        y: 85,
        color: '#1B5E20'
    },
    {
        id: 'sylhet',
        name: lang === 'bn' ? 'সিলেট' : 'Sylhet',
        title: lang === 'bn' ? 'সবুজ পাহাড় আর চা বাগান' : 'Green Hills & Tea Gardens',
        spots: lang === 'bn' ? ['রাতারগুল জলারবন', 'জাফলং', 'বিছনাকান্দি'] : ['Ratargul', 'Jaflong', 'Bisnakandi'],
        description: lang === 'bn' ? 'মেঘে ঢাকা পাহাড় আর দিগন্ত বিস্তৃত চা বাগানের প্রশান্তিতে নিজেকে খুঁজে নিন।' : 'Find yourself in the tranquility of cloud-covered hills and endless tea gardens.',
        x: 82,
        y: 40,
        color: '#2E7D32'
    },
    {
        id: 'sajek',
        name: lang === 'bn' ? 'সাজেক ভ্যালি' : 'Sajek Valley',
        title: lang === 'bn' ? 'মেঘের দেশে বসবাস' : 'Land of Clouds',
        spots: lang === 'bn' ? ['কংলাক পাহাড়', 'রুইলুই পাড়া', 'হ্যালিপ্যাড'] : ['Kanglak Peak', 'Ruilui', 'Helipad'],
        description: lang === 'bn' ? 'সকাল বেলার মেঘের ভেলা আর সূর্যাস্তের লাল আভা আপনার ভ্রমণকে করবে স্মরণীয়।' : 'Morning clouds and the red glow of sunset will make your trip memorable.',
        x: 92,
        y: 65,
        color: '#43A047'
    },
    {
        id: 'sundarban',
        name: lang === 'bn' ? 'সুন্দরবন' : 'Sundarbans',
        title: lang === 'bn' ? 'ম্যানগ্রোভ অরণ্যের রহস্য' : 'Mangrove Mystery',
        spots: lang === 'bn' ? ['করমজল', 'কটকা বীচ', 'হাড়বাড়িয়া'] : ['Karamjal', 'Kotka Beach', 'Harbaria'],
        description: lang === 'bn' ? 'পৃথিবীর বৃহত্তম ম্যানগ্রোভ বনের রোমাঞ্চ আর রয়েল বেঙ্গল টাইগারের পদচিহ্ন খুঁজুন।' : "Find the thrills of the world's largest mangrove forest and Royal Bengal Tiger tracks.",
        x: 45,
        y: 80,
        color: '#1B5E20'
    }
];

const MapDiscovery = () => {
    const { language } = useLanguage();
    const discoveries = DISCOVERIES(language);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % discoveries.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [discoveries.length]);

    const active = discoveries[activeIndex];

    return (
        <section className="py-20 bg-[#f8fafc] dark:bg-slate-900/50 overflow-hidden transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left Side: Information */}
                    <div className="order-2 lg:order-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-forest-light dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
                                    <Sparkles size={14} />
                                    {language === 'bn' ? 'স্থাপত্য ও প্রকৃতি' : 'Architecture & Nature'}
                                </div>
                                
                                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                                    {active.name} <br />
                                    <span className="text-forest-light dark:text-green-500">{active.title}</span>
                                </h2>
                                
                                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-md">
                                    {active.description}
                                </p>

                                <div className="space-y-4 pt-4">
                                    <h4 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                        <MapPin size={18} className="text-forest-light dark:text-green-500" />
                                        {language === 'bn' ? 'প্রধান দর্শনীয় স্থানসমূহ:' : 'Primary Attractions:'}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {active.spots.map((spot, i) => (
                                            <motion.span 
                                                key={spot}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.1 + 0.3 }}
                                                className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300"
                                            >
                                                {spot}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <button className="flex items-center gap-3 px-8 py-4 bg-forest-light text-white rounded-2xl font-bold shadow-lg shadow-forest-light/20 hover:scale-105 transition-transform group">
                                        {language === 'bn' ? 'বিস্তারিত দেখুন' : 'Explore More'}
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Side: Animated Map */}
                    <div className="order-1 lg:order-2 relative flex justify-center items-center h-[400px] md:h-[500px]">
                        {/* Bangladesh Outline Stylized */}
                        <div className="relative w-full h-full max-w-md opacity-20 select-none pointer-events-none">
                             <svg viewBox="0 0 100 120" className="w-full h-full fill-forest-light/30 dark:fill-green-500/20">
                                <path d="M50,5 L60,10 L75,5 L85,20 L95,40 L90,60 L92,80 L85,100 L70,115 L50,110 L30,115 L15,100 L10,80 L15,60 L5,40 L15,20 L25,5 Z" />
                             </svg>
                        </div>

                        {/* Pulsing Dots */}
                        <div className="absolute inset-0 w-full h-full max-w-md mx-auto">
                            {discoveries.map((item, index) => (
                                <div 
                                    key={item.id}
                                    className="absolute"
                                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                                >
                                    <div className="relative flex items-center justify-center">
                                        <motion.div 
                                            animate={{ 
                                                scale: activeIndex === index ? [1, 2, 1] : 1,
                                                opacity: activeIndex === index ? [0.5, 0, 0.5] : 0.2
                                            }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute w-12 h-12 rounded-full bg-forest-light dark:bg-green-500"
                                        />
                                        <button
                                            onClick={() => setActiveIndex(index)}
                                            className={`w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 shadow-md transition-all duration-500 relative z-10 
                                                ${activeIndex === index ? 'bg-forest-light dark:bg-green-500 scale-150' : 'bg-gray-300 dark:bg-slate-700 hover:bg-forest-light'}`}
                                        />
                                        
                                        {activeIndex === index && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="absolute bottom-6 bg-white dark:bg-slate-800 px-3 py-1 rounded-lg shadow-xl border border-gray-100 dark:border-slate-700 whitespace-nowrap z-20"
                                            >
                                                <span className="text-xs font-black text-forest-light dark:text-green-500">{item.name}</span>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Background blobs for depth */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-forest-light/5 dark:bg-green-500/5 rounded-full blur-3xl" />
                        <div className="absolute -z-10 top-1/4 right-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default MapDiscovery;
