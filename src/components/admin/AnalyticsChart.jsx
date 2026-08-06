import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users } from 'lucide-react';

const AnalyticsChart = ({ data, loading }) => {
    if (loading) {
        return <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl animate-pulse text-gray-400">Loading chart data...</div>;
    }

    if (!data || data.length === 0) {
        return <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 font-medium">No analytics data available</div>;
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Revenue & Bookings</h3>
                    <p className="text-xs text-gray-500 font-medium">Last 30 days performance</p>
                </div>
                <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-1.5 text-primary">
                        <div className="w-2 h-2 rounded-full bg-primary"></div> Revenue (৳)
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-500">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div> Bookings
                    </div>
                </div>
            </div>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1B5E20" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#1B5E20" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis 
                            dataKey="day" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: '#9ca3af' }} 
                            dy={10} 
                            tickFormatter={(str) => {
                                const date = new Date(str);
                                return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
                            }}
                        />
                        <YAxis 
                            yAxisId="left" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                            tickFormatter={(val) => `৳${val > 1000 ? (val/1000).toFixed(1) + 'k' : val}`}
                        />
                        <YAxis 
                            yAxisId="right" 
                            orientation="right" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ color: '#4b5563', fontWeight: 'bold', marginBottom: '4px' }}
                        />
                        <Area yAxisId="left" type="monotone" dataKey="total_revenue" stroke="#1B5E20" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        <Area yAxisId="right" type="monotone" dataKey="total_bookings" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsChart;
