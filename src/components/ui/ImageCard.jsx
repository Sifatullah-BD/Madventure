import React from 'react';

export default function ImageCard({ image, title, subtitle, tag }) {
    return (
        <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg group">

            {/* 1. Image (Zoom Effect) */}
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* 2. Permanent Shade (Gradient Overlay) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            {/* 3. Text Content */}
            <div className="absolute bottom-0 left-0 p-5 w-full z-10">
                {tag && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block shadow-sm">
                        {tag}
                    </span>
                )}
                <h3 className="text-xl font-bold text-white mb-1 leading-tight">
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-gray-300 text-sm font-medium">{subtitle}</p>
                )}
            </div>
        </div>
    );
}
