import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, BadgeCheck, Sparkles, Phone } from 'lucide-react';
import { BUSINESS_CATEGORIES } from '../../data/businessData';

const categoryColors = {
    HOTEL: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    RESTAURANT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    TRANSPORT: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    GUIDE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    SHOP: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    EVENT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    EMERGENCY: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const BusinessCard = ({ business }) => {
    const cat = BUSINESS_CATEGORIES.find(c => c.id === business.category);

    return (
        <Link
            to={`/business/${business.slug}`}
            className="group bg-white dark:bg-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1 block"
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={business.cover_image || business.images?.[0]}
                    alt={business.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Category Badge */}
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${categoryColors[business.category]}`}>
                    {cat?.label || business.category}
                </div>

                {/* Featured Badge */}
                {business.isFeatured && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <Sparkles size={10} /> ফিচার্ড
                    </div>
                )}

                {/* Price Range */}
                <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 dark:text-white shadow-sm">
                    {business.priceRange}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-bold text-gray-800 dark:text-white group-hover:text-primary transition-colors line-clamp-1 flex items-center gap-1.5">
                        {business.name}
                        {business.isVerified && (
                            <BadgeCheck size={16} className="text-blue-500 flex-shrink-0" />
                        )}
                    </h3>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <MapPin size={12} />
                    <span className="line-clamp-1">{business.location}</span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 mb-3">
                    {business.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    {/* Rating */}
                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-md">
                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-bold text-gray-800 dark:text-white">{business.rating}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">({business.reviewCount})</span>
                    </div>

                    {/* Quick Contact */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(`tel:${business.phone}`);
                        }}
                        className="text-gray-400 hover:text-primary transition-colors p-1"
                        title="কল করুন"
                    >
                        <Phone size={16} />
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default BusinessCard;
