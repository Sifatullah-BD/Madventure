import React from 'react';
import { Backpack, CheckCircle, Wallet, Clock } from 'lucide-react';

const StudentTourPlan = ({ tours }) => {
    if (!tours || tours.length === 0) return null;

    return (
        <div className="py-12 bg-green-50/30">
            <div className="max-w-[1140px] mx-auto px-4">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-green-100 rounded-full text-green-700">
                        <Backpack size={28} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Student Budget Tour Plan</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tours.map((tour, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                Recommended
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-2">{tour.title}</h3>

                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                                <div className="flex items-center gap-1">
                                    <Clock size={16} className="text-orange-500" />
                                    {tour.duration}
                                </div>
                                <div className="flex items-center gap-1 font-bold text-green-700">
                                    <Wallet size={16} />
                                    {tour.budget}
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                {tour.spots.map((spot, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                                        <CheckCircle size={16} className="text-green-500 shrink-0" />
                                        <span>{spot}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-500 italic border border-gray-100">
                                <strong>Note:</strong> {tour.notes}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentTourPlan;
