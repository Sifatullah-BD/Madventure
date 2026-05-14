import React from 'react';

const DashboardHeader = ({ title, subtitle, action }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 mb-6 sticky top-0 z-10">
            {/* Left Side: Title */}
            <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                    {title}
                </h1>
                {/* Subtitle (Hidden on mobile for compactness) */}
                {subtitle && (
                    <p className="text-xs text-gray-500 mt-1 hidden md:block">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Right Side: Action Button */}
            <div className="mt-2 md:mt-0">
                {action}
            </div>
        </div>
    );
};

export default DashboardHeader;
