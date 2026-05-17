import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ItineraryGenerator from '../components/planner/ItineraryGenerator';
import BudgetCalculator from '../components/planner/BudgetCalculator';
import SmartChecklist from '../components/planner/SmartChecklist';
import { useLanguage } from '../context/LanguageContext';

const SmartPlanner = () => {
    const [activeTab, setActiveTab] = useState('itinerary');
    const { language } = useLanguage();

    // Simple scroll to top on tab change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
            <DashboardHeader
                title={language === 'bn' ? "স্মার্ট ট্রিপ প্ল্যানার" : "Smart Trip Planner"}
                subtitle={language === 'bn' ? "আপনার পারফেক্ট ট্রিপ ডিজাইন করুন এআই-এর সহায়তায়। রুট, বাজেট এবং প্যাকিং এখন এক জায়গাতেই।" : "Design your perfect trip with AI assistance. Route, budget, and packing all in one place."}
            />

            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 w-full">
                <div className="bg-white dark:bg-gray-800 rounded-xl flex shadow-sm border border-gray-200 dark:border-gray-700 p-1 mx-auto max-w-2xl text-center font-bold">
                    <button
                        onClick={() => setActiveTab('itinerary')}
                        className={`flex-1 py-3 px-4 rounded-lg transition-all ${activeTab === 'itinerary'
                            ? 'bg-primary text-white shadow-md scale-[1.02]'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                            }`}
                    >
                        {language === 'bn' ? 'যাত্রাপথ (Itinerary)' : 'Itinerary'}
                    </button>
                    <button
                        onClick={() => setActiveTab('budget')}
                        className={`flex-1 py-3 px-4 rounded-lg transition-all ${activeTab === 'budget'
                            ? 'bg-primary text-white shadow-md scale-[1.02]'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                            }`}
                    >
                        {language === 'bn' ? 'বাজেট (Budget)' : 'Budget'}
                    </button>
                    <button
                        onClick={() => setActiveTab('checklist')}
                        className={`flex-1 py-3 px-4 rounded-lg transition-all ${activeTab === 'checklist'
                            ? 'bg-primary text-white shadow-md scale-[1.02]'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                            }`}
                    >
                        {language === 'bn' ? 'চেকলিস্ট (Checklist)' : 'Checklist'}
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-[1200px] w-full mx-auto px-4 pb-24 mt-4 flex-grow">
                {activeTab === 'itinerary' && <ItineraryGenerator />}
                {activeTab === 'budget' && <BudgetCalculator />}
                {activeTab === 'checklist' && <SmartChecklist />}
            </div>
        </div>
    );
};

export default SmartPlanner;
