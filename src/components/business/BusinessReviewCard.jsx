import React from 'react';
import { Star, BadgeCheck, ThumbsUp } from 'lucide-react';

const BusinessReviewCard = ({ review }) => {
    return (
        <div className="bg-white dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <img
                        src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}&background=random`}
                        alt={review.userName}
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <p className="font-bold text-gray-800 dark:text-white text-sm flex items-center gap-1.5">
                            {review.userName}
                            {review.isVerifiedBooking && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full font-bold">
                                    <BadgeCheck size={10} /> ভেরিফাইড
                                </span>
                            )}
                        </p>
                        <p className="text-xs text-gray-400">{review.createdAt}</p>
                    </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                        />
                    ))}
                </div>
            </div>

            {/* Comment */}
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                {review.comment}
            </p>

            {/* Review Images */}
            {review.images?.length > 0 && (
                <div className="flex gap-2 mb-3">
                    {review.images.map((img, i) => (
                        <img key={i} src={img} alt="" className="w-16 h-16 rounded-xl object-cover" />
                    ))}
                </div>
            )}

            {/* Owner Response */}
            {review.ownerResponse && (
                <div className="mt-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border-l-4 border-primary">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">মালিকের উত্তর:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{review.ownerResponse}</p>
                </div>
            )}

            {/* Helpful Button */}
            <div className="mt-3 flex items-center gap-2">
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary transition-colors">
                    <ThumbsUp size={12} /> সহায়ক
                </button>
                {review.helpfulCount > 0 && (
                    <span className="text-xs text-gray-400">({review.helpfulCount})</span>
                )}
            </div>
        </div>
    );
};

export default BusinessReviewCard;
