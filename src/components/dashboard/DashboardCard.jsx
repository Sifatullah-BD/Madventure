import React from 'react';
import { ArrowRight } from 'lucide-react';

const DashboardCard = ({
    title,
    subtitle,
    icon: Icon,
    color = 'blue',
    stats,
    action,
    onAction,
    className = ''
}) => {
    // Color mapping for dynamic themes
    const colorClasses = {
        blue: {
            border: 'border-blue-500',
            bgIcon: 'bg-blue-100',
            textIcon: 'text-blue-600',
            bgStats: 'bg-blue-50',
            borderStats: 'border-blue-100',
            textStats: 'text-blue-800',
            btn: 'bg-blue-600 hover:bg-blue-700 text-white',
            btnOutline: 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50'
        },
        purple: {
            border: 'border-purple-500',
            bgIcon: 'bg-purple-100',
            textIcon: 'text-purple-600',
            bgStats: 'bg-purple-50',
            borderStats: 'border-purple-100',
            textStats: 'text-purple-800',
            btn: 'bg-purple-600 hover:bg-purple-700 text-white',
            btnOutline: 'border-2 border-purple-500 text-purple-600 hover:bg-purple-50'
        },
        green: {
            border: 'border-green-500',
            bgIcon: 'bg-green-100 dark:bg-green-950/40',
            textIcon: 'text-green-600 dark:text-green-400',
            bgStats: 'bg-green-50 dark:bg-green-900/20',
            borderStats: 'border-green-100 dark:border-green-800/30',
            textStats: 'text-green-800 dark:text-green-200',
            btn: 'bg-green-600 hover:bg-green-750 text-white dark:bg-green-700 dark:hover:bg-green-600',
            btnOutline: 'border-2 border-green-500 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/30'
        },
        orange: {
            border: 'border-orange-500',
            bgIcon: 'bg-orange-100',
            textIcon: 'text-orange-600',
            bgStats: 'bg-orange-50',
            borderStats: 'border-orange-100',
            textStats: 'text-orange-800',
            btn: 'bg-orange-600 hover:bg-orange-700 text-white',
            btnOutline: 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50'
        },
        red: {
            border: 'border-red-500',
            bgIcon: 'bg-red-100',
            textIcon: 'text-red-600',
            bgStats: 'bg-red-50',
            borderStats: 'border-red-100',
            textStats: 'text-red-800',
            btn: 'bg-red-600 hover:bg-red-700 text-white',
            btnOutline: 'border-2 border-red-500 text-red-600 hover:bg-red-50'
        },
        teal: {
            border: 'border-teal-500',
            bgIcon: 'bg-teal-100',
            textIcon: 'text-teal-600',
            bgStats: 'bg-teal-50',
            borderStats: 'border-teal-100',
            textStats: 'text-teal-800',
            btn: 'bg-teal-600 hover:bg-teal-700 text-white',
            btnOutline: 'border-2 border-teal-500 text-teal-600 hover:bg-teal-50'
        },
        indigo: {
            border: 'border-indigo-500',
            bgIcon: 'bg-indigo-100',
            textIcon: 'text-indigo-600',
            bgStats: 'bg-indigo-50',
            borderStats: 'border-indigo-100',
            textStats: 'text-indigo-800',
            btn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
            btnOutline: 'border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50'
        },
        pink: {
            border: 'border-pink-500',
            bgIcon: 'bg-pink-100',
            textIcon: 'text-pink-600',
            bgStats: 'bg-pink-50',
            borderStats: 'border-pink-100',
            textStats: 'text-pink-800',
            btn: 'bg-pink-600 hover:bg-pink-700 text-white',
            btnOutline: 'border-2 border-pink-500 text-pink-600 hover:bg-pink-50'
        },
        yellow: {
            border: 'border-yellow-500',
            bgIcon: 'bg-yellow-100',
            textIcon: 'text-yellow-600',
            bgStats: 'bg-yellow-50',
            borderStats: 'border-yellow-100',
            textStats: 'text-yellow-800',
            btn: 'bg-yellow-600 hover:bg-yellow-700 text-white',
            btnOutline: 'border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50'
        },
        gray: {
            border: 'border-gray-500',
            bgIcon: 'bg-gray-100',
            textIcon: 'text-gray-600',
            bgStats: 'bg-gray-50',
            borderStats: 'border-gray-100',
            textStats: 'text-gray-800',
            btn: 'bg-gray-600 hover:bg-gray-700 text-white',
            btnOutline: 'border-2 border-gray-500 text-gray-600 hover:bg-gray-50'
        },
    };

    const theme = colorClasses['green']; // enforce consistent green theme

    return (
        <div className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 ease-out border-l-4 ${theme.border} ${className} group`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${theme.bgIcon} rounded-xl flex items-center justify-center ${theme.textIcon} transition-transform group-hover:scale-110 duration-500 ease-out`}>
                        {Icon && <Icon size={24} strokeWidth={2.5} />}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight transition-colors duration-300">{title}</h3>
                        {subtitle && <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mt-1 transition-colors duration-300">{subtitle}</p>}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {stats && (
                    <div className={`${theme.bgStats} p-3 rounded-lg border ${theme.borderStats} min-h-[60px] flex flex-col justify-center`}>
                        {stats}
                    </div>
                )}

                {action && (
                    <button
                        onClick={onAction}
                        className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${stats ? theme.btnOutline : theme.btn}`}
                    >
                        {action} <ArrowRight size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default DashboardCard;
