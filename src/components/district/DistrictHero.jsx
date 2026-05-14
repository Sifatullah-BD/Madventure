import React from 'react';

const DistrictHero = ({ district }) => {
    return (
        <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-b-[40px] shadow-lg">
            <img
                src={district.hero_image}
                alt={district.name_en}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white">
                <h1 className="text-5xl md:text-7xl font-heading font-bold mb-2 drop-shadow-lg">{district.name_en}</h1>
                <p className="text-xl md:text-2xl font-medium opacity-90">{district.short_description}</p>
            </div>

            {/* Sticker Effect Border */}
            <div className="absolute inset-0 border-[10px] border-white/20 rounded-b-[40px] pointer-events-none"></div>
        </div>
    );
};

export default DistrictHero;
