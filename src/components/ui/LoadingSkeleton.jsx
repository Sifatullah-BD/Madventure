import React from 'react';

const SkeletonBase = ({ className = '' }) => (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`} />
);

// Card skeleton with image, title, and description
export const CardSkeleton = ({ count = 1 }) => (
    <>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-surface rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                <SkeletonBase className="h-48 rounded-none" />
                <div className="p-5 space-y-3">
                    <SkeletonBase className="h-4 w-3/4" />
                    <SkeletonBase className="h-3 w-full" />
                    <SkeletonBase className="h-3 w-5/6" />
                    <div className="flex items-center justify-between pt-3">
                        <SkeletonBase className="h-5 w-20" />
                        <SkeletonBase className="h-8 w-8 rounded-full" />
                    </div>
                </div>
            </div>
        ))}
    </>
);

// Text block skeleton
export const TextSkeleton = ({ lines = 3 }) => (
    <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
            <SkeletonBase
                key={i}
                className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
            />
        ))}
    </div>
);

// Avatar + name skeleton
export const AvatarSkeleton = () => (
    <div className="flex items-center gap-3">
        <SkeletonBase className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="space-y-2 flex-1">
            <SkeletonBase className="h-3 w-24" />
            <SkeletonBase className="h-2 w-16" />
        </div>
    </div>
);

// Banner / Hero skeleton
export const BannerSkeleton = () => (
    <div className="relative">
        <SkeletonBase className="h-64 md:h-80 rounded-none" />
        <div className="absolute bottom-0 left-0 w-full p-6 space-y-3">
            <SkeletonBase className="h-6 w-48 rounded-lg" />
            <SkeletonBase className="h-4 w-72 rounded-lg" />
        </div>
    </div>
);

// Page-level loading with multiple card skeletons
export const PageSkeleton = ({ cards = 8, columns = 4 }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-end">
            <div className="space-y-2">
                <SkeletonBase className="h-8 w-64" />
                <SkeletonBase className="h-4 w-40" />
            </div>
            <SkeletonBase className="h-10 w-32 rounded-full" />
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
            <CardSkeleton count={cards} />
        </div>
    </div>
);

const LoadingSkeleton = ({ variant = 'card', ...props }) => {
    switch (variant) {
        case 'text': return <TextSkeleton {...props} />;
        case 'avatar': return <AvatarSkeleton />;
        case 'banner': return <BannerSkeleton />;
        case 'page': return <PageSkeleton {...props} />;
        case 'card':
        default: return <CardSkeleton {...props} />;
    }
};

export default LoadingSkeleton;
