import React from 'react';
import { SearchX, PackageOpen, MapPinOff, FileQuestion } from 'lucide-react';

const iconMap = {
    search: SearchX,
    empty: PackageOpen,
    location: MapPinOff,
    default: FileQuestion,
};

const EmptyState = ({
    icon = 'default',
    title = 'Nothing here yet',
    description = 'We couldn\'t find anything to show.',
    actionLabel,
    onAction,
    className = '',
}) => {
    const IconComponent = iconMap[icon] || iconMap.default;

    return (
        <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
            {/* Icon Circle */}
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <IconComponent size={36} className="text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
            </div>

            {/* Text */}
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm leading-relaxed">{description}</p>

            {/* CTA Button */}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="mt-6 bg-primary text-white px-6 py-2.5 rounded-full font-bold hover:bg-green-700 transition-all hover:scale-105 shadow-md"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
