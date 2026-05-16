import { useLanguage } from '../context/LanguageContext';

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
        navigate(`/destinations?${queryParams.toString()}`);
    };

    const trendingTours = [
        { 
            id: 1, 
            title: language === 'bn' ? 'সাজেক মেঘকন্যা রিলাক্স ট্যুর' : 'Sajek Valley Relax Tour', 
            image: 'https://images.unsplash.com/photo-1623169822765-a86f9175d713?auto=format&fit=crop&w=600&q=80', 
            price: language === 'bn' ? '৳৫,৫০০' : '৳5,500', 
            agency: 'Green Valley Tours', 
            rating: 4.8 
        },
        { 
            id: 2, 
            title: language === 'bn' ? 'সুন্দরবন এডভেঞ্চার ক্রুজ' : 'Sundarban Adventure Cruise', 
            image: 'https://images.unsplash.com/photo-1589886307379-342410a563b7?auto=format&fit=crop&w=600&q=80', 
            price: language === 'bn' ? '৳১২,০০০' : '৳12,000', 
            agency: 'River Trips BD', 
            rating: 4.9 
        },
        { 
            id: 3, 
            title: language === 'bn' ? 'সেন্টমার্টিন স্পেশাল প্যাকেজ' : 'Saint Martin Special Package', 
            image: 'https://images.unsplash.com/photo-1596895111956-bf57059e00fa?auto=format&fit=crop&w=600&q=80', 
            price: language === 'bn' ? '৳৬,২০০' : '৳6,200', 
            agency: 'Ocean Travels', 
            rating: 4.7 
        },
        { 
            id: 4, 
            title: language === 'bn' ? 'সিলেট-শ্রীমঙ্গল এক্সপ্লোর' : 'Sylhet-Srimangal Explore', 
            image: 'https://images.unsplash.com/photo-1579781498175-1e0e84b2c140?auto=format&fit=crop&w=600&q=80', 
            price: language === 'bn' ? '৳৪,৫০০' : '৳4,500', 
            agency: 'Sylhet Guides', 
            rating: 4.6 
        },
    ];

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
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" className="w-full h-full object-cover" alt="Mountain" />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-tight shadow-text">
                            {language === 'bn' ? <>নতুনত্বের টানে <br /> <span className="text-white">বাংলাদেশ ঘুরে দেখো</span></> : <>Explore the <br /> <span className="text-white">Beauty of Bangladesh</span></>}
                        </h1>
                        <p className="text-gray-100 text-lg md:text-xl mb-12 font-medium max-w-2xl mx-auto drop-shadow-lg">
                            {language === 'bn' ? '৬৪ জেলা • ৫০০+ প্যাকেজ • ১০০+ বিশ্বস্ত গাইড।' : '64 Districts • 500+ Packages • 100+ Trusted Guides.'}
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-3 md:p-4 shadow-2xl mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-4"
                    >
                        <div className="flex items-center px-5 py-3 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 group focus-within:bg-white transition-all">
                            <MapPin className="text-[#1B5E20]" size={20} />
                            <div className="text-left ml-3">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Location</p>
                                <input type="text" placeholder={language === 'bn' ? "কোথায় যাবেন?" : "Where to?"} className="bg-transparent border-none outline-none w-full text-gray-800 dark:text-white text-sm font-bold" value={destination} onChange={e => setDestination(e.target.value)} />
                            </div>
                        </div>
                        <div className="flex items-center px-5 py-3 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 group focus-within:bg-white transition-all">
                            <Calendar className="text-[#1B5E20]" size={20} />
                            <div className="text-left ml-3">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Date</p>
                                <input type="date" className="bg-transparent border-none outline-none w-full text-gray-800 dark:text-white text-sm font-bold" value={date} onChange={e => setDate(e.target.value)} />
                            </div>
                        </div>
                        <div className="flex items-center px-5 py-3 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-100 dark:border-gray-600 group focus-within:bg-white transition-all">
                            <DollarSign className="text-[#1B5E20]" size={20} />
                            <div className="text-left ml-3">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Budget</p>
                                <select className="bg-transparent border-none outline-none w-full text-gray-800 dark:text-white text-sm font-bold appearance-none cursor-pointer" value={budget} onChange={e => setBudget(e.target.value)}>
                                    <option value="">{language === 'bn' ? 'বাজেট নির্বাচন করুন' : 'Select Budget'}</option>
                                    <option value="low">৳০ - ৳৩,০০০</option>
                                    <option value="med">৳৩,০০০ - ৳৭,০০০</option>
                                    <option value="high">৳৭,০০০+</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={handleSearch} className="bg-[#1B5E20] hover:bg-green-800 text-white rounded-2xl font-black transition-all active:scale-95 shadow-lg">
                            {language === 'bn' ? 'শুরু করুন' : 'Get Started'}
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* 2. Beautiful Destinations */}
            <section className="py-24 bg-white dark:bg-[#050f08] text-gray-900 dark:text-gray-100 transition-colors">
                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 items-center">
                    <div className="flex-1 relative">
                        <div className="grid grid-cols-2 gap-4">
                            <motion.div initial={{ y: 20 }} whileInView={{ y: 0 }} className="rounded-3xl overflow-hidden h-80 shadow-xl border-4 border-white dark:border-gray-800">
                                <img src="https://images.unsplash.com/photo-1590603740183-980e7f6920eb?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover" alt="" />
                            </motion.div>
                            <motion.div initial={{ y: -20 }} whileInView={{ y: 0 }} className="rounded-3xl overflow-hidden h-80 mt-12 shadow-xl border-4 border-white dark:border-gray-800">
                                <img src="https://images.unsplash.com/photo-1589886307379-342410a563b7?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover" alt="" />
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
            <section className="py-24 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-center transition-colors">
                <div className="max-w-7xl mx-auto px-6">
                    <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">Services ——</span>
                    <h2 className="text-4xl md:text-5xl font-black mt-4 mb-16">{language === 'bn' ? 'আপনার জন্য সেরা সব ফিচার' : 'Best Features For You'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: "⛺", title: language === 'bn' ? "অজস্র পছন্দ" : "Lots of Choices", desc: "We provide several choices of destinations and travelling packages." },
                            { icon: "🗺️", title: language === 'bn' ? "সেরা ট্যুর গাইড" : "Best Tour Guide", desc: "Professional tour guides who understand the local culture." },
                            { icon: "🎟️", title: language === 'bn' ? "সহজ বুকিং" : "Easy Booking", desc: "Easy to book tickets or the place you want with one click." }
                        ].map((f, i) => (
                            <motion.div 
                                key={i} 
                                whileHover={{ y: -10 }}
                                className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center space-y-6 transition-all"
                            >
                                <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950 rounded-2xl flex items-center justify-center text-3xl">{f.icon}</div>
                                <h4 className="text-xl font-black">{f.title}</h4>
                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Top Destinations */}
            <section className="py-24 bg-white dark:bg-[#050f08] text-gray-900 dark:text-gray-100 text-center transition-colors">
                <div className="max-w-7xl mx-auto px-6">
                    <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">Trending ——</span>
                    <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4">{language === 'bn' ? 'আপনার পছন্দের গন্তব্যটি খুঁজে নিন' : "Explore Your Dream Destination!"}</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-16">{language === 'bn' ? 'আমরা প্রতি সপ্তাহে জনপ্রিয় সব ট্যুর প্যাকেজ সাজিয়ে থাকি।' : "Popular destinations recommended every week just for you."}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trendingTours.map((tour) => (
                            <motion.div 
                                key={tour.id} 
                                whileHover={{ scale: 1.02 }}
                                className="bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 group transition-all"
                            >
                                <div className="h-64 relative overflow-hidden">
                                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-orange-500">
                                        ⭐ {tour.rating}
                                    </div>
                                </div>
                                <div className="p-6 text-left flex justify-between items-center">
                                    <div className="flex-1 pr-2">
                                        <h4 className="font-black text-lg truncate">{tour.title}</h4>
                                        <p className="text-gray-400 text-xs flex items-center gap-1 mt-1"><MapPin size={12} /> Bangladesh</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-xl font-black text-sm whitespace-nowrap">{tour.price}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <button onClick={() => navigate('/destinations')} className="mt-16 bg-orange-500 text-white px-10 py-4 rounded-2xl font-black hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30">
                        {language === 'bn' ? 'আরও দেখুন' : 'View More'}
                    </button>
                </div>
            </section>

            {/* 5. Testimonials - Traver Style */}
            <section className="py-24 bg-gray-50 text-gray-900">
                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-24 items-center">
                    <div className="flex-1 space-y-8">
                        <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">What They Say ——</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900">What Our Customer <br /> Say About Us</h2>
                        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative">
                            <Quote className="text-orange-100 absolute top-8 right-8" size={80} />
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#FFD700" className="text-yellow-400" />)}
                            </div>
                            <p className="text-gray-600 text-lg leading-relaxed italic mb-8 relative z-10">"{reviews[0].text}"</p>
                            <div className="flex items-center gap-4">
                                <img src={reviews[0].avatar} className="w-14 h-14 rounded-full border-2 border-orange-500" alt="" />
                                <div>
                                    <h4 className="font-black text-gray-900">{reviews[0].name}</h4>
                                    <p className="text-xs text-gray-400 font-bold">Travel Enthusiast</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className={`rounded-2xl overflow-hidden h-40 ${i % 2 === 0 ? 'mt-8' : ''}`}>
                                    <img src={`https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&w=400&q=80`} className="w-full h-full object-cover" alt="" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Blog - Vertical Cinematic Cards */}
            <section className="py-32 bg-[#08140c]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-24">
                        <div>
                            <span className="text-forest-light font-black tracking-[0.5em] uppercase text-xs mb-4 block">Travel Guides</span>
                            <h2 className="text-5xl md:text-6xl font-black text-white">ভ্রমণ ডায়েরি</h2>
                        </div>
                        <button onClick={() => navigate('/blog')} className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black hover:bg-forest-light transition-all flex items-center gap-3">
                            সব পড়ুন <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { id: 1, title: 'সাজেক ভ্যালি ভ্রমণের সঠিক সময় এবং টিপস', image: 'https://images.unsplash.com/photo-1623169822765-a86f9175d713?auto=format&fit=crop&w=800&q=80', date: '১২ মে, ২০২৪', category: 'Guide' },
                            { id: 2, title: 'সুন্দরবনে কি কি দেখবেন? পূর্ণাঙ্গ গাইডলাইন', image: 'https://images.unsplash.com/photo-1589886307379-342410a563b7?auto=format&fit=crop&w=800&q=80', date: '১০ মে, ২০২৪', category: 'Adventure' },
                            { id: 3, title: 'কক্সবাজার ভ্রমণে খরচ বাঁচানোর ৫টি উপায়', image: 'https://images.unsplash.com/photo-1600295628549-05eb823b16d7?auto=format&fit=crop&w=800&q=80', date: '০৫ মে, ২০২৪', category: 'Budget' }
                        ].map(post => (
                            <motion.div 
                                key={post.id} 
                                whileHover={{ y: -15 }}
                                className="group cursor-pointer relative"
                            >
                                <div className="h-[550px] rounded-[3.5rem] overflow-hidden relative shadow-2xl border border-white/5">
                                    <OptimizedImage src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
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
