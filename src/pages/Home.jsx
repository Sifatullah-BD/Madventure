import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, DollarSign, ShieldCheck, Map, Tag, Star } from 'lucide-react';
import SEO from '../components/SEO';
import HeroVideo from '../components/ui/HeroVideo';

const Home = () => {
    const navigate = useNavigate();

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

    // Data mocks
    const popularDestinations = [
        { id: 1, name: "Cox's Bazar", image: 'https://images.unsplash.com/photo-1600295628549-05eb823b16d7?auto=format&fit=crop&w=600&q=80', price: '৳৩,০০০' },
        { id: 2, name: "Sundarbans", image: 'https://images.unsplash.com/photo-1589886307379-342410a563b7?auto=format&fit=crop&w=600&q=80', price: '৳৬,৫০০' },
        { id: 3, name: "Sajek Valley", image: 'https://images.unsplash.com/photo-1623169822765-a86f9175d713?auto=format&fit=crop&w=600&q=80', price: '৳৫,২০০' },
        { id: 4, name: "Saint Martin", image: 'https://images.unsplash.com/photo-1596895111956-bf57059e00fa?auto=format&fit=crop&w=600&q=80', price: '৳৪,৮০০' },
        { id: 5, name: "Sylhet", image: 'https://images.unsplash.com/photo-1579781498175-1e0e84b2c140?auto=format&fit=crop&w=600&q=80', price: '৳৩,৫০০' },
        { id: 6, name: "Bandarban", image: 'https://images.unsplash.com/photo-1596404983574-d4508ee00057?auto=format&fit=crop&w=600&q=80', price: '৳৪,২০০' },
    ];

    const trendingTours = [
        { id: 1, title: 'সাজেক মেঘকন্যা রিলাক্স ট্যুর (৩ দিন)', image: 'https://images.unsplash.com/photo-1623169822765-a86f9175d713?auto=format&fit=crop&w=600&q=80', price: '৳৫,৫০০', agency: 'Green Valley Tours' },
        { id: 2, title: 'সুন্দরবন এডভেঞ্চার ক্রুজ (৪ দিন)', image: 'https://images.unsplash.com/photo-1589886307379-342410a563b7?auto=format&fit=crop&w=600&q=80', price: '৳১২,০০০', agency: 'River Trips BD' },
        { id: 3, title: 'সেন্টমার্টিন স্পেশাল প্যাকেজ (৩ দিন)', image: 'https://images.unsplash.com/photo-1596895111956-bf57059e00fa?auto=format&fit=crop&w=600&q=80', price: '৳৬,২০০', agency: 'Ocean Travels' },
        { id: 4, title: 'সিলেট-শ্রীমঙ্গল এক্সপ্লোর (২ দিন)', image: 'https://images.unsplash.com/photo-1579781498175-1e0e84b2c140?auto=format&fit=crop&w=600&q=80', price: '৳৪,৫০০', agency: 'Sylhet Guides' },
        { id: 5, title: 'বান্দরবান ট্রেকিং প্যাক (৩ দিন)', image: 'https://images.unsplash.com/photo-1596404983574-d4508ee00057?auto=format&fit=crop&w=600&q=80', price: '৳৪,৮০০', agency: 'Mountain BD' },
    ];

    const reviews = [
        { id: 1, name: 'রাকিব হাসান', rating: 5, text: 'সাজেক ট্যুর বুকিং করা এত সহজ হবে ভাবিনি। এজেন্সির গাইড অনেক হেল্পফুল ছিল।', avatar: 'https://ui-avatars.com/api/?name=Rakib+Hassan&background=1B5E20&color=fff' },
        { id: 2, name: 'ফারজানা আক্তার', rating: 5, text: 'সুন্দরবন প্যাকেজের প্রাইস অন্যান্য সাইটের চেয়ে বেশ কম পেয়েছি। রিকমেন্ডেড!', avatar: 'https://ui-avatars.com/api/?name=Farzana+Akter&background=2E7D32&color=fff' },
        { id: 3, name: 'শরীফ উদ্দিন', rating: 4, text: 'বিকাশ পেমেন্ট খুব স্মুথ ছিল। টিকিট সাথে সাথেই মেসেজ করে কনফার্ম করেছে।', avatar: 'https://ui-avatars.com/api/?name=Sharif+Uddin&background=4CAF50&color=fff' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <SEO 
                title="বাংলাদেশ ঘুরে দেখো | Madventure" 
                description="সবচেয়ে সহজে এবং নিরাপদভাবে আপনার পরবর্তী ট্রিপ বুক করুন। বেস্ট প্রাইসে হোটেল, ট্যুর প্যাকেজ এবং ট্রান্সপোর্ট।"
            />

            {/* 1. Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                <HeroVideo url="https://youtu.be/OsyvEjbR6Ew" />

                <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center mt-16 md:mt-0">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8 drop-shadow-lg leading-tight" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                        বাংলাদেশ ঘুরে দেখো
                    </h1>

                    {/* Search Bar Container */}
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 md:p-4 shadow-2xl mx-auto max-w-4xl flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0">
                        
                        {/* Destination */}
                        <div className="flex-1 flex items-center bg-gray-50 md:bg-transparent rounded-xl md:rounded-none px-4 py-3 md:py-2 w-full border border-gray-100 md:border-none focus-within:bg-gray-50 transition-colors">
                            <MapPin className="text-[#1B5E20] mr-3 shrink-0" size={20} />
                            <input 
                                type="text" 
                                placeholder="কোথায় যাবেন?" 
                                className="bg-transparent border-none outline-none w-full text-gray-800 placeholder-gray-500 font-medium text-sm md:text-base"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </div>

                        {/* Divider (Desktop) */}
                        <div className="hidden md:block w-px h-12 bg-gray-200 mx-2"></div>

                        {/* Date */}
                        <div className="flex-1 flex items-center bg-gray-50 md:bg-transparent rounded-xl md:rounded-none px-4 py-3 md:py-2 w-full border border-gray-100 md:border-none focus-within:bg-gray-50 transition-colors">
                            <Calendar className="text-[#1B5E20] mr-3 shrink-0" size={20} />
                            <input 
                                type="date" 
                                className="bg-transparent border-none outline-none w-full text-gray-800 placeholder-gray-500 font-medium text-sm md:text-base"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        {/* Divider (Desktop) */}
                        <div className="hidden md:block w-px h-12 bg-gray-200 mx-2"></div>

                        {/* Budget */}
                        <div className="flex-1 flex items-center bg-gray-50 md:bg-transparent rounded-xl md:rounded-none px-4 py-3 md:py-2 w-full border border-gray-100 md:border-none focus-within:bg-gray-50 transition-colors">
                            <DollarSign className="text-[#1B5E20] mr-3 shrink-0" size={20} />
                            <select 
                                className="bg-transparent border-none outline-none w-full text-gray-800 font-medium appearance-none text-sm md:text-base"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                            >
                                <option value="">বাজেট</option>
                                <option value="low">৳০ - ৳৩,০০০</option>
                                <option value="med">৳৩,০০০ - ৳৭,০০০</option>
                                <option value="high">৳৭,০০০+</option>
                            </select>
                        </div>

                        {/* Search Button */}
                        <button 
                            onClick={handleSearch}
                            className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white px-8 py-3.5 md:py-4 rounded-xl font-bold w-full md:w-auto transition-colors flex items-center justify-center shadow-lg mt-2 md:mt-0 md:ml-4 whitespace-nowrap"
                        >
                            <Search className="mr-2" size={18} />
                            Trip Plan করো
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. Popular Destinations */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>জনপ্রিয় গন্তব্য</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        {popularDestinations.map(dest => (
                            <div key={dest.id} onClick={() => navigate(`/destinations?q=${dest.name}`)} className="group cursor-pointer rounded-2xl overflow-hidden relative shadow-sm hover:shadow-xl transition-all aspect-[4/3]">
                                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-4">
                                    <h3 className="text-white font-bold text-lg md:text-xl">{dest.name}</h3>
                                    <p className="text-gray-200 text-sm">শুরু {dest.price} থেকে</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Trending Tours (Horizontal Scroll) */}
            <section className="py-16 bg-gray-50 overflow-hidden">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>ট্রেন্ডিং প্যাকেজ</h2>
                    
                    <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        {trendingTours.map(tour => (
                            <div key={tour.id} onClick={() => navigate(`/tour-details`)} className="min-w-[280px] md:min-w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 snap-center cursor-pointer group">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-[#1B5E20]">
                                        Best Seller
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{tour.title}</h3>
                                    <p className="text-sm text-gray-500 mb-3">{tour.agency}</p>
                                    <div className="flex justify-between items-center mt-auto">
                                        <p className="text-[#1B5E20] font-black text-lg">{tour.price}</p>
                                        <button className="text-sm font-bold bg-green-50 text-[#1B5E20] px-3 py-1.5 rounded-lg group-hover:bg-[#1B5E20] group-hover:text-white transition-colors">
                                            বিস্তারিত
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Trust Section (কেন Madventure?) */}
            <section className="py-16 bg-white border-y border-gray-100">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-10" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>কেন Madventure?</h2>
                    
                    <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
                        <div className="flex items-center gap-4 bg-gray-50 md:bg-transparent p-4 rounded-xl">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-[#1B5E20] shrink-0">
                                <ShieldCheck size={24} />
                            </div>
                            <span className="font-bold text-gray-800 text-lg">Safe Booking</span>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-gray-50 md:bg-transparent p-4 rounded-xl">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-[#1B5E20] shrink-0">
                                <Map size={24} />
                            </div>
                            <span className="font-bold text-gray-800 text-lg">Local Guide</span>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-gray-50 md:bg-transparent p-4 rounded-xl">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-[#1B5E20] shrink-0">
                                <Tag size={24} />
                            </div>
                            <span className="font-bold text-gray-800 text-lg">Best Price</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. User Reviews */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>ট্রাভেলার রিভিউ</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {reviews.map(review => (
                            <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex gap-1 mb-3">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} size={14} className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'} />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-4 text-sm leading-relaxed min-h-[60px]">"{review.text}"</p>
                                <div className="flex items-center gap-3">
                                    <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full" />
                                    <span className="font-bold text-gray-900 text-sm">{review.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Footer is globally managed in App.jsx */}
        </div>
    );
};

export default Home;
