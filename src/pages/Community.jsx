import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Users, MessagesSquare } from 'lucide-react';

import Forum from '../components/community/Forum';
import ThreadDetail from '../components/community/ThreadDetail';
import TravelPartner from '../components/community/TravelPartner';
import LoginModal from '../components/LoginModal';
import DistrictDropdown from '../components/community/DistrictDropdown';

import { useLanguage } from '../context/LanguageContext';

const Community = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { language } = useLanguage();

    const searchParams = new URLSearchParams(location.search);
    const initialTab = searchParams.get('tab') || 'forum';
    const initialThread = searchParams.get('threadId') || null;

    const [activeTab, setActiveTab] = useState(initialTab);
    const [selectedThread, setSelectedThread] = useState(initialThread);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        const query = new URLSearchParams();

        if (activeTab !== 'forum') {
            query.set('tab', activeTab);
        }

        if (selectedThread) {
            query.set('threadId', selectedThread);
        }

        navigate(
            {
                pathname: location.pathname,
                search: query.toString(),
            },
            { replace: true }
        );
    }, [activeTab, selectedThread, location.pathname, navigate]);

    const handleBackToForum = () => {
        setSelectedThread(null);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050f08] text-gray-900 dark:text-gray-100 flex flex-col">

            {/* Hero */}
            <div className="relative pt-20 md:pt-24 pb-6 md:pb-8 px-4 text-center overflow-hidden bg-white dark:bg-transparent">

                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-400/10 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400/10 blur-[120px] rounded-full"></div>
                </div>

                <div className="relative z-10">
                    <h1
                        className="text-3xl md:text-5xl font-black mb-2"
                        style={{
                            fontFamily: "'Hind Siliguri', sans-serif",
                        }}
                    >
                        {language === 'bn'
                            ? 'ম্যাডভেঞ্চার কমিউনিটি'
                            : 'Madventure Community'}
                    </h1>

                    <p className="max-w-3xl mx-auto text-sm md:text-base text-gray-600 dark:text-gray-300">
                        {language === 'bn'
                            ? 'অন্যান্য ভ্রমণপ্রেমীদের সাথে সংযুক্ত হোন, অভিজ্ঞতা শেয়ার করুন এবং নতুন ট্রাভেল পার্টনার খুঁজে নিন।'
                            : 'Connect with fellow travelers, share experiences, ask questions and find your next travel partner.'}
                    </p>
                </div>

                <div className="mt-4"><DistrictDropdown /></div>
            </div>

            {/* Tabs */}
            {!selectedThread && (
                <div className="max-w-7xl mx-auto w-full px-4 mb-5">

                    <div className="max-w-lg mx-auto bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-1.5 flex">

                        <button
                            onClick={() => setActiveTab('forum')}
                            className={`flex-1 py-2.5 rounded-xl flex justify-center items-center gap-2 font-bold text-sm transition ${activeTab === 'forum'
                                    ? 'bg-green-600 text-white'
                                    : 'text-gray-500'
                                }`}
                        >
                            <MessagesSquare size={18} />
                            {language === 'bn'
                                ? 'ট্রাভেল ফোরাম'
                                : 'Travel Forum'}
                        </button>

                        <button
                            onClick={() => setActiveTab('partner')}
                            className={`flex-1 py-2.5 rounded-xl flex justify-center items-center gap-2 font-bold text-sm transition ${activeTab === 'partner'
                                    ? 'bg-orange-500 text-white'
                                    : 'text-gray-500'
                                }`}
                        >
                            <Users size={18} />
                            {language === 'bn'
                                ? 'ট্রাভেল পার্টনার'
                                : 'Travel Partner'}
                        </button>

                    </div>
                </div>
            )}

            {/* Content */}

            <div className="flex-grow max-w-7xl mx-auto w-full px-4 pb-8">

                <AnimatePresence mode="wait">

                    <motion.div
                        key={selectedThread || activeTab}
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -20,
                        }}
                        transition={{
                            duration: 0.35,
                        }}
                    >
                        {selectedThread ? (
                            <ThreadDetail
                                threadId={selectedThread}
                                onBack={handleBackToForum}
                            />
                        ) : (
                            <>
                                {activeTab === 'forum' && (
                                    <Forum
                                        onSelectThread={setSelectedThread}
                                        onLoginRequired={() =>
                                            setShowLoginModal(true)
                                        }
                                    />
                                )}

                                {activeTab === 'partner' && (
                                    <TravelPartner />
                                )}
                            </>
                        )}
                    </motion.div>

                </AnimatePresence>

            </div>

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLogin={() => setShowLoginModal(false)}
            />

        </div>
    );
};

export default Community;