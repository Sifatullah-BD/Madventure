import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, MapPin, Briefcase, Camera, TrendingUp, Users } from 'lucide-react';

const CommunitySidebar = ({ onAction }) => {
    return (
        <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Quick Tools */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Briefcase size={18} className="text-primary" /> Travel Tools
                </h3>
                <div className="space-y-3">
                    <button
                        onClick={() => onAction('ask')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors group"
                    >
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors">
                            <HelpCircle size={18} />
                        </div>
                        <span className="font-medium text-sm">Ask a Question</span>
                    </button>

                    <button
                        onClick={() => onAction('location')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-green-600 transition-colors group"
                    >
                        <div className="bg-green-100 p-2 rounded-lg text-green-600 group-hover:bg-green-200 transition-colors">
                            <MapPin size={18} />
                        </div>
                        <span className="font-medium text-sm">Share Location</span>
                    </button>

                    <button
                        onClick={() => onAction('packing')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors group"
                    >
                        <div className="bg-orange-100 p-2 rounded-lg text-orange-600 group-hover:bg-orange-200 transition-colors">
                            <Briefcase size={18} />
                        </div>
                        <span className="font-medium text-sm">Packing Helper</span>
                    </button>

                    <button
                        onClick={() => onAction('photo')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors group"
                    >
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600 group-hover:bg-purple-200 transition-colors">
                            <Camera size={18} />
                        </div>
                        <span className="font-medium text-sm">Upload Photo</span>
                    </button>
                </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-red-500" /> Trending Now
                </h3>
                <div className="flex flex-wrap gap-2">
                    {['#SajekValley', '#CoxsBazar', '#SoloTrip', '#Foodie', '#BudgetTravel'].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-full cursor-pointer transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Users size={18} className="text-yellow-500" /> Top Experts
                </h3>
                <div className="space-y-4">
                    {[
                        { name: 'Sarah Khan', role: 'Explorer', color: 'bg-green-100 text-green-700' },
                        { name: 'Rahim Ahmed', role: 'Guide', color: 'bg-blue-100 text-blue-700' },
                        { name: 'Travel Pro', role: 'Photographer', color: 'bg-purple-100 text-purple-700' }
                    ].map((expert, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs">
                                    {expert.name[0]}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">{expert.name}</p>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${expert.color} font-bold uppercase`}>
                                        {expert.role}
                                    </span>
                                </div>
                            </div>
                            <button className="text-xs font-bold text-primary hover:underline">Follow</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommunitySidebar;
