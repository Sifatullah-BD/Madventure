import React from 'react';
import { Activity, Database, Key, ShieldAlert } from 'lucide-react';

const AuditLogTable = ({ logs, loading }) => {
    if (loading) {
        return <div className="h-64 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse text-gray-400">Loading audit logs...</div>;
    }

    const getActionIcon = (action) => {
        if (action.includes('UPDATE')) return <Key size={14} className="text-blue-500" />;
        if (action.includes('DELETE')) return <ShieldAlert size={14} className="text-red-500" />;
        if (action.includes('EXPORT')) return <Database size={14} className="text-green-500" />;
        return <Activity size={14} className="text-gray-500" />;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900">Audit Logs</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                            <th className="px-6 py-4">Action</th>
                            <th className="px-6 py-4">Admin</th>
                            <th className="px-6 py-4">Target</th>
                            <th className="px-6 py-4 text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {logs?.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center">
                                            {getActionIcon(log.action)}
                                        </div>
                                        <span className="font-bold text-gray-900 text-xs">{log.action}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                    {log.user_profiles?.full_name || 'System Admin'}
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-xs font-bold text-gray-700">{log.target_table}</p>
                                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">{log.target_id || 'N/A'}</p>
                                </td>
                                <td className="px-6 py-4 text-right text-[11px] text-gray-500 font-medium">
                                    {new Date(log.created_at).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        {(!logs || logs.length === 0) && (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-medium">No audit logs recorded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogTable;
