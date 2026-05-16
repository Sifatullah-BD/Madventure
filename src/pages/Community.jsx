import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import Forum from '../components/community/Forum';
import ThreadDetail from '../components/community/ThreadDetail';
import TravelPartner from '../components/community/TravelPartner';
import { Users, MessagesSquare } from 'lucide-react';

const Community = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Parse query params to set initial state gracefully
    const searchParams = new URLSearchParams(location.search);
    const initialTab = searchParams.get('tab') || 'forum';
    const initialThread = searchParams.get('threadId') || null;

    const [activeTab, setActiveTab] = useState(initialTab); // 'forum' | 'partner'
    const [selectedThread, setSelectedThread] = useState(initialThread); // null | threadId

    // Sync state to URL without reloading
    useEffect(() => {
        const query = new URLSearchParams();
        if (activeTab !== 'forum') query.set('tab', activeTab);
        if (selectedThread) query.set('threadId', selectedThread);
        
        const newUrl = `${location.pathname}?${query.toString()}`;
        if (window.location.search !== `?${query.toString()}`) {
            navigate(newUrl, { replace: true });
        }
    }, [activeTab, selectedThread, navigate, location.pathname]);

    // Handle view back
    const handleBackToForum = () => {
        setSelectedThread(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#050f08] text-gray-100 flex flex-col">
            <div className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-forest-light/10 blur-[100px] rounded-full"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 blur-[100px] rounded-full"></div>
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>ম্যাডভেঞ্চার কমিউনিটি</h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium opacity-90">
                        অন্যান্য ট্রাভেলারদের সাথে কানেক্ট করুন, অভিজ্ঞতা শেয়ার করুন এবং আপনার পরবর্তী ট্রিপের জন্য সঙ্গী খুঁজুন।
                    </p>
                </div>
            </div>

            {/* Custom Tab Navigation - Scandi Style */}
            {!selectedThread && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 w-full">
                    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-2 mx-auto max-w-lg flex shadow-2xl">
                        <button
                            onClick={() => setActiveTab('forum')}
                            className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-[1.5rem] font-black text-sm transition-all ${activeTab === 'forum'
                                ? 'bg-forest-light text-white shadow-lg shadow-forest-light/20 scale-[1.02]'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <MessagesSquare size={18}/> ট্রাভেল ফোরাম
                        </button>
                        <button
                            onClick={() => setActiveTab('partner')}
                            className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-[1.5rem] font-black text-sm transition-all ${activeTab === 'partner'
                                ? 'bg-[#f97316] text-white shadow-lg shadow-orange-500/20 scale-[1.02]'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Users size={18}/> ট্রাভেল পার্টনার
                        </button>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="w-full mx-auto flex-grow px-4 sm:px-6 lg:px-8 pb-16">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedThread || activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {selectedThread ? (
                            <ThreadDetail threadId={selectedThread} onBack={handleBackToForum} />
                        ) : (
                            <>
                                {activeTab === 'forum' && <Forum onSelectThread={setSelectedThread} />}
                                {activeTab === 'partner' && <TravelPartner />}
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Community;
