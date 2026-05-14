import React, { useState, useEffect } from 'react';
import { HIDDEN_GEMS, DISTRICTS } from '../../data/madventure-data';
import { MapPin, Eye, Navigation, Heart, Users, Compass, ExternalLink } from 'lucide-react';

const CrowdColors = {
    "low": "text-green-600 bg-green-50 border-green-200",
    "medium": "text-yellow-600 bg-yellow-50 border-yellow-200",
    "high": "text-red-600 bg-red-50 border-red-200"
};

const CrowdLabels = {
    "low": "🟢 নির্জন",
    "medium": "🟡 মাঝারি",
    "high": "🔴 ভিড়"
};

const HiddenGems = () => {
    const [districtId, setDistrictId] = useState('');
    const [visitedGems, setVisitedGems] = useState([]);
    const [likedGems, setLikedGems] = useState([]);

    useEffect(() => {
        const savedVisited = localStorage.getItem('madventure_visited_gems');
        const savedLiked = localStorage.getItem('madventure_liked_gems');
        if (savedVisited) setVisitedGems(JSON.parse(savedVisited));
        if (savedLiked) setLikedGems(JSON.parse(savedLiked));
    }, []);

    const toggleVisited = (id) => {
        let updated;
        if (visitedGems.includes(id)) {
            updated = visitedGems.filter(g => g !== id);
        } else {
            updated = [...visitedGems, id];
        }
        setVisitedGems(updated);
        localStorage.setItem('madventure_visited_gems', JSON.stringify(updated));
    };

    const toggleLike = (id) => {
        let updated;
        if (likedGems.includes(id)) {
            updated = likedGems.filter(g => g !== id);
        } else {
            updated = [...likedGems, id];
        }
        setLikedGems(updated);
        localStorage.setItem('madventure_liked_gems', JSON.stringify(updated));
    };

    const handleSurprise = () => {
        const randomGem = HIDDEN_GEMS[Math.floor(Math.random() * HIDDEN_GEMS.length)];
        setDistrictId(randomGem.districtId);
    };

    const displayGems = districtId ? HIDDEN_GEMS.filter(g => g.districtId === districtId) : HIDDEN_GEMS;

    return (
        <div className="bg-gray-900 min-h-screen pb-12 rounded-2xl overflow-hidden font-sans">
            {/* Hero Banner with mystery vibe */}
            <div className="relative py-20 px-6 text-center text-white overflow-hidden border-b border-gray-800">
                <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1518599904199-0ca897819ddb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
                
                <div className="relative z-10 max-w-2xl mx-auto">
                    <Compass size={48} className="mx-auto mb-4 text-[#22c55e] animate-pulse" />
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">অজানা গন্তব্য</h1>
                    <p className="text-gray-300 text-lg mb-8">যেসব জায়গার খোঁজ বেশিরভাগ পর্যটক জানেন না। মূল গন্তব্যের ভিড় এড়িয়ে লোকাল অভিজ্ঞতায় মিশে যান।</p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <select 
                            value={districtId} 
                            onChange={e => setDistrictId(e.target.value)}
                            className="bg-gray-800/80 border border-gray-700 text-white px-6 py-3 rounded-xl font-bold outline-none focus:border-[#22c55e] backdrop-blur-md"
                        >
                            <option value="">সব জেলার রত্ন</option>
                            {DISTRICTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                        <button 
                            onClick={handleSurprise}
                            className="bg-gradient-to-r from-[#22c55e] to-emerald-600 text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-green-900/50 hover:scale-105 transition-transform"
                        >
                            সারপ্রাইজ করুন!
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayGems.map(gem => (
                        <GemCard 
                            key={gem.id} 
                            data={gem} 
                            isVisited={visitedGems.includes(gem.id)}
                            isLiked={likedGems.includes(gem.id)}
                            onToggleVisit={() => toggleVisited(gem.id)}
                            onToggleLike={() => toggleLike(gem.id)}
                        />
                    ))}
                </div>

                <div className="mt-16 text-center bg-gray-800/50 border border-gray-700 rounded-2xl p-8 max-w-2xl mx-auto backdrop-blur-sm">
                    <h3 className="text-white font-bold text-xl mb-2">আপনার জানা কোনো লুকানো জায়গা আছে?</h3>
                    <p className="text-gray-400 text-sm mb-6">কমিউনিটির সাথে শেয়ার করুন আপনার অভিজ্ঞতা।</p>
                    <button className="border-2 border-[#22c55e] text-[#22c55e] px-6 py-2.5 rounded-lg font-bold hover:bg-[#22c55e] hover:text-white transition-colors">
                        আরেকটি লুকানো রত্ন যোগ করুন
                    </button>
                </div>
            </div>
        </div>
    );
};

const GemCard = ({ data, isVisited, isLiked, onToggleVisit, onToggleLike }) => {
    const [revealed, setRevealed] = useState(false);

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden group">
            <div 
                className="relative h-64 overflow-hidden cursor-pointer"
                onMouseEnter={() => setRevealed(true)}
                onMouseLeave={() => setRevealed(false)}
            >
                <img 
                    src={data.images[0]} 
                    alt={data.name} 
                    className={`w-full h-full object-cover transition-all duration-700 ${revealed ? 'scale-110 blur-0 grayscale-0' : 'scale-100 blur-sm grayscale'}`} 
                />
                
                {/* Overlay that disappears on hover */}
                <div className={`absolute inset-0 bg-gray-900/60 flex flex-col items-center justify-center transition-opacity duration-500 pointer-events-none ${revealed ? 'opacity-0' : 'opacity-100'}`}>
                    <Eye size={32} className="text-gray-400 mb-2" />
                    <span className="text-white font-bold tracking-widest text-sm uppercase opacity-80">Hover to reveal</span>
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border shadow-lg backdrop-blur-md ${CrowdColors[data.crowdLevel]}`}>
                        {CrowdLabels[data.crowdLevel]}
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#22c55e] transition-colors">{data.name}</h3>
                        <p className="text-gray-400 text-xs flex items-center gap-1"><MapPin size={12}/> {DISTRICTS.find(d=>d.id===data.districtId)?.name}</p>
                    </div>
                    <button onClick={onToggleLike} className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-red-500/20 text-red-500' : 'bg-gray-700 text-gray-400 hover:text-white'}`}>
                        <Heart size={20} className={isLiked ? "fill-current" : ""} />
                    </button>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-6">{data.description}</p>
                
                <div className="space-y-3 mb-6 bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">সেরা সময়:</span>
                        <span className="text-gray-200 font-medium">{data.bestTime}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">প্রবেশ ফি:</span>
                        <span className="text-gray-200 font-medium">{data.entryFee}</span>
                    </div>
                </div>

                <p className="text-xs text-gray-400 mb-6 border-l-2 border-[#f97316] pl-3 italic">
                    "কীভাবে যাবেন: {data.howToGet}"
                </p>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-700">
                    <button 
                        onClick={onToggleVisit}
                        className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${isVisited ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                    >
                        {isVisited ? "আমি গিয়েছি ✓" : "আমি গিয়েছি"}
                    </button>
                    <a 
                        href={`https://maps.google.com/?q=${data.lat},${data.lng}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                        title="গুগল ম্যাপে দেখুন"
                    >
                        <ExternalLink size={18} />
                    </a>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>❤️ {data.likes + (isLiked ? 1 : 0)} জন পছন্দ করেছেন</span>
                    <span className="flex items-center gap-1"><Users size={12}/> Added by {data.addedBy}</span>
                </div>
            </div>
        </div>
    );
};

export default HiddenGems;
