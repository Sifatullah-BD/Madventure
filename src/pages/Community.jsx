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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <DashboardHeader
                title="ম্যাডভেঞ্চার কমিউনিটি"
                subtitle="অন্যান্য লোকাল ট্রাভেলারদের সাথে কানেক্ট করুন, এক্সপেরিয়েন্স শেয়ার করুন এবং ট্রাভেল পার্টনার খুঁজুন।"
            />

            {/* Custom Tab Navigation */}
            {!selectedThread && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 w-full">
                    <div className="bg-white rounded-xl flex shadow-sm border border-gray-200 p-1 mx-auto max-w-2xl text-center font-bold">
                        <button
                            onClick={() => setActiveTab('forum')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${activeTab === 'forum'
                                ? 'bg-primary text-white shadow-md scale-[1.02]'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                }`}
                        >
                            <MessagesSquare size={18}/> ট্রাভেল ফোরাম
                        </button>
                        <button
                            onClick={() => setActiveTab('partner')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${activeTab === 'partner'
                                ? 'bg-[#f97316] text-white shadow-md scale-[1.02]'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                }`}
                        >
                            <Users size={18}/> ট্রাভেল পার্টনার
                        </button>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="w-full mx-auto flex-grow">
                {selectedThread ? (
                    <ThreadDetail threadId={selectedThread} onBack={handleBackToForum} />
                ) : (
                    <>
                        {activeTab === 'forum' && <Forum onSelectThread={setSelectedThread} />}
                        {activeTab === 'partner' && <TravelPartner />}
                    </>
                )}
            </div>
        </div>
    );
};

export default Community;
