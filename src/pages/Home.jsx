import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Star, Quote, ArrowRight, Tent, Map as MapIcon, Ticket } from 'lucide-react';
import BlogPosts from '../components/home/BlogPosts';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { districtsData } from '../data/districts';
import { supabaseService } from '../services/supabaseService';

const Home = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();

    // Search State
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [budget, setBudget] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams();
        if (destination) queryParams.append('q', destination);
        if (date) queryParams.append('date', date);
        if (budget) queryParams.append('budget', budget);
        navigate(`/explore?${queryParams.toString()}`);
    };

    const [trendingTours, setTrendingTours] = useState([]);
    const [loadingTours, setLoadingTours] = useState(true);

    React.useEffect(() => {
        let mounted = true;
        const fetchTours = async () => {
            try {
                const data = await supabaseService.getTours();
                if (mounted && data) {
                    setTrendingTours(data.slice(0, 4));
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (mounted) setLoadingTours(false);
            }
        };
        fetchTours();
        return () => { mounted = false; };
    }, []);

    const reviews = [
        { 
            id: 1, 
            name: language === 'bn' ? 'রাকিব হাসান' : 'Rakib Hassan', 
            rating: 5, 
            text: language === 'bn' ? 'সাজেক ট্যুর বুকিং করা এত সহজ হবে ভাবিনি। এজেন্সির গাইড অনেক হেল্পফুল ছিল।' : 'Never thought booking a Sajek tour would be this easy. The guide was very helpful.', 
            avatar: 'https://ui-avatars.com/api/?name=Rakib+Hassan&background=1B5E20&color=fff', 
            location: 'Dhaka' 
        },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#050f08] text-gray-900 dark:text-gray-100 font-sans selection:bg-forest-light selection:text-white transition-colors duration-300">
            <SEO 
                title={language === 'bn' ? "বাংলাদেশ ঘুরে দেখো | Madventure" : "Explore Bangladesh | Madventure"} 
                description={language === 'bn' ? "সবচেয়ে সহজে এবং নিরাপদভাবে আপনার পরবর্তী ট্রিপ বুক করুন।" : "Book your next trip easiest and safest way."}
            />

            {/* 1. Hero Section */}
            <section className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/home_hero_1778976642283.png" className="w-full h-full object-cover" alt="Bangladesh Landscape" />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tighter leading-tight shadow-text">
                            {language === 'bn' ? <>অজানা ট্রেইল ও সৌন্দর্যের খোঁজে <br /> <span className="text-[#A5D6A7]">ঘুরে দেখুন প্রিয় বাংলাদেশ</span></> : <>Unveil Hidden Wonders <br /> <span className="text-[#A5D6A7]">Across Scenic Bangladesh</span></>}
                        </h1>
                        <p className="text-gray-200 text-sm md:text-base mb-7 font-medium max-w-xl mx-auto drop-shadow-lg">
                            {language === 'bn' ? '৬৪ জেলা • ৫০০+ প্যাকেজ • ১০০+ বিশ্বস্ত গাইড।' : '64 Districts • 500+ Packages • 100+ Trusted Guides.'}
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-3xl p-2 md:p-3 shadow-2xl mx-auto max-w-3xl grid grid-cols-1 md:grid-cols-4 gap-3 border border-white/10"
                    >
                        <div className="flex items-center px-4 py-2 bg-white/5 dark:bg-white/5 rounded-xl border border-white/10 group focus-within:bg-white/10 transition-all">
                            <MapPin className="text-[#1B5E20]" size={18} />
                            <div className="text-left ml-2 flex-grow">
                                <p className="text-[9px] font-bold text-gray-400 uppercase">Location</p>
                                <select 
                                    className="bg-transparent border-none outline-none w-full text-gray-800 dark:text-white text-xs font-bold appearance-none cursor-pointer"
                                    value={destination} 
                                    onChange={e => setDestination(e.target.value)}
                                >
                                    <option value="" className="text-gray-400 bg-white dark:bg-gray-800">{language === 'bn' ? "কোথায় যাবেন?" : "Where to?"}</option>
                                    {districtsData.flatMap(div => 
                                        div.districts.map(d => ({ name: d.name, division: div.division }))
                                    ).sort((a, b) => a.name.localeCompare(b.name)).map((dist, idx) => (
                                        <option key={idx} value={dist.name} className="text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800">
                                            {dist.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center px-4 py-2 bg-white/5 dark:bg-white/5 rounded-xl border border-white/10 group focus-within:bg-white/10 transition-all">
                            <Calendar className="text-[#1B5E20]" size={18} />
                            <div className="text-left ml-2">
                                <p className="text-[9px] font-bold text-gray-400 uppercase">Date</p>
                                <input type="date" className="bg-transparent border-none outline-none w-full text-gray-800 dark:text-white text-xs font-bold" value={date} onChange={e => setDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="flex items-center px-4 py-2 bg-white/5 dark:bg-white/5 rounded-xl border border-white/10 group focus-within:bg-white/10 transition-all">
                            <DollarSign className="text-[#1B5E20]" size={18} />
                            <div className="text-left ml-2">
                                <p className="text-[9px] font-bold text-gray-400 uppercase">Budget</p>
                                <select className="bg-transparent border-none outline-none w-full text-gray-800 dark:text-white text-xs font-bold appearance-none cursor-pointer" value={budget} onChange={e => setBudget(e.target.value)}>
                                    <option value="">{language === 'bn' ? 'বাজেট' : 'Budget'}</option>
                                    <option value="low">৳০ - ৳৩,০০০</option>
                                    <option value="med">৳৩,০০০ - ৳৭,০০০</option>
                                    <option value="high">৳৭,০০০+</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={handleSearch} className="bg-[#1B5E20] hover:bg-green-800 text-white rounded-xl font-black transition-all active:scale-95 shadow-lg text-sm">
                            {language === 'bn' ? 'শুরু করুন' : 'Get Started'}
                        </button>
                    </motion.div>

                </div>
            </section>

            {/* 2. Beautiful Destinations */}
            <section className="py-12 bg-white dark:bg-[#050f08] text-gray-900 dark:text-gray-100 transition-colors">
                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 items-center">
                    <div className="flex-1 relative">
                        <div className="grid grid-cols-2 gap-4">
                            <motion.div initial={{ y: 20 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-50px" }} className="rounded-3xl overflow-hidden h-64 shadow-xl border-4 border-white dark:border-gray-800">
                                <img src="/images/home_dest_1_1778976669789.png" className="w-full h-full object-cover" alt="" />
                            </motion.div>
                            <motion.div initial={{ y: -20 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-50px" }} className="rounded-3xl overflow-hidden h-64 mt-12 shadow-xl border-4 border-white dark:border-gray-800">
                                <img src="/images/home_dest_2_1778976690365.png" className="w-full h-full object-cover" alt="" />
                            </motion.div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-[#1B5E20] text-white p-8 rounded-3xl shadow-2xl z-20">
                            <p className="text-4xl font-black">20+</p>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-80">{language === 'bn' ? 'বছরের অভিজ্ঞতা' : 'Years Experience'}</p>
                        </div>
                    </div>
                    <div className="flex-1 space-y-8 text-left">
                        <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">{language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'} ——</span>
                        <h2 className="text-4xl md:text-5xl font-black leading-tight">
                            {language === 'bn' ? <>সেরা গন্তব্যগুলো <br /> আমরাই বেছে দেই প্রতি মাসে</> : <>We Recommend Beautiful <br /> Destinations Every Month</>}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                            {language === 'bn' ? 'আপনার স্বপ্নের ট্রিপটি আমাদের সাথে খুঁজে নিন। আমরা প্রতি সপ্তাহে সেরা ডিল এবং গন্তব্য শেয়ার করি।' : "Let's choose your dream destinations here, we provide many destinations and we offer the best destinations every week."}
                        </p>
                        <div className="grid grid-cols-3 gap-8 pt-4">
                            <div>
                                <p className="text-3xl font-black">2000+</p>
                                <p className="text-xs text-gray-400 font-bold uppercase">Explorers</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black">100+</p>
                                <p className="text-xs text-gray-400 font-bold uppercase">Destinations</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black">500+</p>
                                <p className="text-xs text-gray-400 font-bold uppercase">Guides</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Features Section */}
            <section className="py-12 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-center transition-colors">
                <div className="max-w-7xl mx-auto px-6">
                    <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">Services ——</span>
                    <h2 className="text-3xl md:text-4xl font-black mt-4 mb-12">{language === 'bn' ? 'আপনার জন্য সেরা সব ফিচার' : 'Best Features For You'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: "⛺", title: language === 'bn' ? "অজস্র পছন্দ" : "Lots of Choices", desc: language === 'bn' ? "আমরা বিভিন্ন ধরনের গন্তব্য এবং ট্রাভেল প্যাকেজ সরবরাহ করি।" : "We provide several choices of destinations and travelling packages." },
                            { icon: "🗺️", title: language === 'bn' ? "সেরা ট্যুর গাইড" : "Best Tour Guide", desc: language === 'bn' ? "স্থানীয় সংস্কৃতি বোঝে এমন পেশাদার ট্যুর গাইড।" : "Professional tour guides who understand the local culture." },
                            { icon: "🎟️", title: language === 'bn' ? "সহজ বুকিং" : "Easy Booking", desc: language === 'bn' ? "এক ক্লিকেই আপনার পছন্দের জায়গা বুক করুন।" : "Easy to book tickets or the place you want with one click." }
                        ].map((f, i) => (
                            <motion.div 
                                key={i} 
                                whileHover={{ y: -10 }}
                                className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center space-y-4 transition-all group"
                            >
                                <div className="w-14 h-14 bg-orange-50 dark:bg-orange-950 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">{f.icon}</div>
                                <h4 className="text-lg font-black text-gray-900 dark:text-gray-100">{f.title}</h4>
                                <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Top Destinations */}
            <section className="py-12 bg-white dark:bg-[#050f08] text-gray-900 dark:text-gray-100 text-center transition-colors">
                <div className="max-w-7xl mx-auto px-6">
                    <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">Trending ——</span>
                    <h2 className="text-3xl md:text-4xl font-black mt-4 mb-3">{language === 'bn' ? 'আপনার পছন্দের গন্তব্যটি খুঁজে নিন' : "Explore Your Dream Destination!"}</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-sm">{language === 'bn' ? 'আমরা প্রতি সপ্তাহে জনপ্রিয় সব ট্যুর প্যাকেজ সাজিয়ে থাকি।' : "Popular destinations recommended every week just for you."}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {loadingTours ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-3xl h-64 animate-pulse" />
                            ))
                        ) : trendingTours.length === 0 ? (
                            <div className="col-span-4 text-center text-gray-400 py-12">
                                <Tent size={40} className="mx-auto mb-3 opacity-40" />
                                <p>No tours yet. Be the first to add one!</p>
                            </div>
                        ) : (
                            trendingTours.map((tour) => (
                                <motion.div 
                                    key={tour.id} 
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => navigate(`/tours/${tour.id}`)}
                                    className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 group transition-all cursor-pointer"
                                >
                                    <div className="h-48 relative overflow-hidden">
                                        <img src={tour.images?.[0] || tour.image || 'https://placehold.co/400x300/1B5E20/white?text=Tour'} alt={tour.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-orange-500 shadow-sm">
                                            ⭐ {tour.rating || 4.5}
                                        </div>
                                    </div>
                                    <div className="p-5 text-left flex justify-between items-center">
                                        <div className="flex-1 pr-2">
                                            <h4 className="font-black text-base truncate text-gray-900 dark:text-gray-100">{tour.title}</h4>
                                            <p className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1 mt-1"><MapPin size={12} /> {tour.location || 'Bangladesh'}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-xl font-black text-xs whitespace-nowrap">৳{tour.price || tour.booking_money || 5000}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                    <button onClick={() => navigate('/tour-plans')} className="mt-10 bg-orange-500 text-white px-10 py-3 rounded-2xl font-black hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 text-sm">
                        {language === 'bn' ? 'আরও দেখুন' : 'View More'}
                    </button>
                </div>
            </section>

            {/* 5. Testimonials */}
            <section className="py-12 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
                <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">{language === 'bn' ? 'মতামত' : 'What They Say'} ——</span>
                        <h2 className="text-3xl md:text-4xl font-black">{language === 'bn' ? <>আমাদের গ্রাহকরা <br /> কী বলেন</> : <>What Our Customers <br /> Say About Us</>}</h2>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative max-w-md">
                            <Quote className="text-orange-100 dark:text-orange-900/30 absolute top-6 right-6" size={60} />
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#FFD700" className="text-yellow-400" />)}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic mb-6 relative z-10">"{reviews[0].text}"</p>
                            <div className="flex items-center gap-3">
                                <img src={reviews[0].avatar} className="w-10 h-10 rounded-full border-2 border-orange-500" alt="" />
                                <div>
                                    <h4 className="font-black text-sm">{reviews[0].name}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{language === 'bn' ? 'ভ্রমণ উৎসাহী' : 'Travel Enthusiast'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                '/images/home_dest_1_1778976669789.png',
                                '/images/destinations_hero_1_1778975470949.png',
                                '/images/destinations_hero_2_1778975509415.png',
                                '/images/destinations_hero_3_1778975530619.png',
                                '/images/home_dest_2_1778976690365.png',
                                '/images/home_hero_1778976642283.png'
                            ].map((url, i) => (
                                <div key={i} className={`rounded-2xl overflow-hidden h-32 ${i % 2 === 0 ? 'mt-6' : ''}`}>
                                    <img src={url} className="w-full h-full object-cover" alt="" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-[#08140c]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <span className="text-forest-light font-black tracking-[0.5em] uppercase text-xs mb-4 block">Travel Guides</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white">{language === 'bn' ? 'ভ্রমণ ডায়েরি' : 'Travel Diary'}</h2>
                        </div>
                        <button onClick={() => navigate('/blog')} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black hover:bg-forest-light transition-all flex items-center gap-3">
                            {language === 'bn' ? 'সব পড়ুন' : 'Read All'} <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { id: 1, title: language === 'bn' ? 'সাজেক ভ্যালি ভ্রমণের সঠিক সময় এবং টিপস' : 'Best Time & Tips for Sajek Valley', image: '/images/destinations_hero_1_1778975470949.png', date: language === 'bn' ? '১২ মে, ২০২৪' : 'May 12, 2024', category: 'Guide', slug: 'sajek-valley-tips' },
                            { id: 2, title: language === 'bn' ? 'সুন্দরবনে কি কি দেখবেন? পূর্ণাঙ্গ গাইডলাইন' : 'What to see in Sundarbans? Complete Guideline', image: '/images/destinations_hero_2_1778975509415.png', date: language === 'bn' ? '১০ মে, ২০২৪' : 'May 10, 2024', category: 'Adventure', slug: 'sundarbans-guide' },
                            { id: 3, title: language === 'bn' ? 'কক্সবাজার ভ্রমণে খরচ বাঁচানোর ৫টি উপায়' : '5 Ways to Save Money on Cox\'s Bazar Trip', image: '/images/destinations_hero_3_1778975530619.png', date: language === 'bn' ? '০৫ মে, ২০২৪' : 'May 5, 2024', category: 'Budget', slug: 'coxs-bazar-budget' }
                        ].map(post => (
                            <motion.div 
                                key={post.id} 
                                whileHover={{ y: -10 }}
                                onClick={() => navigate(`/blog/${post.slug}`)}
                                className="group cursor-pointer relative"
                            >
                                <div className="h-[550px] rounded-[3.5rem] overflow-hidden relative shadow-2xl border border-white/5">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050f08] via-[#050f08]/10 to-transparent"></div>
                                    <div className="absolute top-10 left-10">
                                        <span className="px-5 py-2 bg-forest-light/90 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest">{post.category}</span>
                                    </div>
                                    <div className="absolute bottom-10 left-10 right-10">
                                        <p className="text-forest-light font-black text-[10px] uppercase tracking-[0.2em] mb-4">{post.date}</p>
                                        <h4 className="text-2xl md:text-3xl font-black text-white leading-tight group-hover:text-green-400 transition-colors">{post.title}</h4>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
