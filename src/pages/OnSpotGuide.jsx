import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import FareChart from '../components/guide/FareChart';
import FoodFinder from '../components/guide/FoodFinder';
import HiddenGems from '../components/guide/HiddenGems';

const OnSpotGuide = () => {
    const [activeTab, setActiveTab] = useState('fares');

    // Scroll to top on tab change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <DashboardHeader
                title="লোকাল অন-স্পট গাইড"
                subtitle="আপনার রিয়েল-টাইম ট্রাভেল সঙ্গী। অচেনা গন্তব্যে লোকাল ভাড়া, হালাল খাবার এবং লুকানো রত্নের খোঁজ নিন নিমেষেই।"
            />

            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 w-full">
                <div className="bg-white rounded-xl flex shadow-sm border border-gray-200 p-1 mx-auto max-w-2xl text-center font-bold">
                    <button
                        onClick={() => setActiveTab('fares')}
                        className={`flex-1 py-3 px-4 rounded-lg transition-all ${activeTab === 'fares'
                            ? 'bg-primary text-white shadow-md scale-[1.02]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                    >
                        যাতায়াত ভাড়া
                    </button>
                    <button
                        onClick={() => setActiveTab('food')}
                        className={`flex-1 py-3 px-4 rounded-lg transition-all ${activeTab === 'food'
                            ? 'bg-orange-500 text-white shadow-md scale-[1.02]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                    >
                        ফুড ফাইন্ডার
                    </button>
                    <button
                        onClick={() => setActiveTab('gems')}
                        className={`flex-1 py-3 px-4 rounded-lg transition-all ${activeTab === 'gems'
                            ? 'bg-gray-900 border border-gray-700 text-white shadow-md scale-[1.02]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                    >
                        অজানা গন্তব্য
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-[1200px] w-full mx-auto px-4 pb-24 mt-4 flex-grow">
                {activeTab === 'fares' && <FareChart />}
                {activeTab === 'food' && <FoodFinder />}
                {activeTab === 'gems' && <HiddenGems />}
            </div>
        </div>
    );
};

export default OnSpotGuide;
