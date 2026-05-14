import React from 'react';

const FamousItems = ({ items }) => {
    return (
        <div className="py-12 bg-gray-50">
            <div className="max-w-[1140px] mx-auto px-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-primary pl-4">Famous For</h2>
                <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                    {items.map((item, index) => (
                        <div key={index} className="flex-shrink-0 flex flex-col items-center gap-3 group cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden transition-transform transform group-hover:scale-110 group-hover:shadow-xl">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-sm font-bold text-gray-700 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FamousItems;
