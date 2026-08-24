import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * StatCard — reusable KPI card for Partner Portal dashboard.
 */
const StatCard = ({
    label,
    value,
    icon,
    iconBg = 'bg-emerald-100 dark:bg-emerald-900/40',
    iconColor = 'text-emerald-600 dark:text-emerald-400',
    delta,
    deltaLabel = 'from yesterday',
}) => {
    const hasDelta = delta !== undefined && delta !== null;
    const isUp = hasDelta && delta >= 0;

    return (
        <div className="
            bg-white dark:bg-white/5
            border border-gray-100 dark:border-white/10
            rounded-2xl p-5 shadow-sm
            hover:shadow-md hover:-translate-y-0.5
            transition-all duration-200
            backdrop-blur-sm
        ">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{value}</h3>
                </div>
                <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor}`}>
                    {icon}
                </div>
            </div>

            {hasDelta && (
                <div className={`flex items-center gap-1 text-xs font-semibold ${isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                    {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    <span>{isUp ? '+' : ''}{delta}%</span>
                    <span className="font-normal text-gray-400">{deltaLabel}</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
