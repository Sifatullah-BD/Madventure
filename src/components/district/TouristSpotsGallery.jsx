import React from 'react';
import { ArrowRight } from 'lucide-react';

const TouristSpotsGallery = ({ spots }) => {
    return (
        <div className="py-16 bg-gray-50">
            <div className="max-w-[1140px] mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-heading font-bold text-gray-800">Top Tourist Spots</h2>
                        <p className="text-gray-500 mt-2">Must-visit destinations in this district</p>
                    </div>
                    <button className="text-primary font-bold flex items-center gap-2 hover:underline">
                        View All <ArrowRight size={18} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {spots.map((spot, index) => (
                        <div key={index} className="group relative h-80 rounded-2xl overflow-hidden shadow-md cursor-pointer">
                            <img
                                src={spot.image}
                                alt={spot.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>
                            <div className="absolute bottom-0 left-0 p-6 w-full transform transition-transform duration-300 group-hover:-translate-y-2">
                                <h3 className="text-xl font-bold text-white mb-1">{spot.name}</h3>
                                <div className="h-1 w-12 bg-primary rounded-full mb-2"></div>
                                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    Click to explore details about this amazing spot.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TouristSpotsGallery;
