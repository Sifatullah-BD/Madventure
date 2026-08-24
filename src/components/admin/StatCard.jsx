import React from 'react';

/**
 * Reusable statistic card for the admin dashboard.
 * Props:
 * - title: display label
 * - value: numeric or string value
 * - icon: Lucide icon component
 * - colorClass: Tailwind background class for the icon container (e.g., "bg-forest-600")
 * - trend: optional percentage change (positive or negative)
 */
const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-800 group hover:shadow-xl transition-all duration-300">
    <div className="flex justify-between items-center mb-4">
      <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10 text-white`}>
        <Icon size={24} />
      </div>
      {trend !== undefined && (
        <span className={`flex items-center gap-1 text-[10px] font-black ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
    <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
      {typeof value === 'number' && title.includes('Revenue') ? `৳${value.toLocaleString()}` : value}
    </h3>
  </div>
);

export default StatCard;
