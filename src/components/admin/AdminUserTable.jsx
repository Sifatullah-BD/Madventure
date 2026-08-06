import React, { useState } from 'react';
import { MoreVertical, Edit, Shield, ShieldOff, Check, X, Loader2 } from 'lucide-react';
import { supabaseService } from '../../services/supabaseService'; // Fallback
import { useToast } from '../ui/Toast';

const AdminUserTable = ({ users, loading, onUpdate }) => {
    const toast = useToast();
    const [updating, setUpdating] = useState(null);

    const handleRoleUpdate = async (userId, newRole) => {
        setUpdating(userId);
        try {
            // Ideally call our API route /api/v1/admin/users
            // Since we're in Vite, we might need a custom fetch or use Supabase directly if we have rights
            // We'll mock the fetch to our backend API for consistency with the plan
            const res = await fetch('/api/v1/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole })
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error?.message || 'Failed to update role');
            
            toast?.success?.('Updated', `User role changed to ${newRole}`);
            onUpdate && onUpdate();
        } catch (error) {
            toast?.error?.('Error', error.message);
        } finally {
            setUpdating(null);
        }
    };

    if (loading) {
        return <div className="h-64 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse text-gray-400">Loading users...</div>;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900">User Management</h3>
                <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">{users?.length || 0} Total</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users?.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                            {u.full_name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{u.full_name || 'Unnamed'}</p>
                                            <p className="text-xs text-gray-400">{u.phone || 'No phone'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                        u.role === 'admin' || u.role === 'super_admin' 
                                            ? 'bg-purple-100 text-purple-700' 
                                            : u.role === 'guide' 
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {u.role === 'admin' && <Shield size={10} />}
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                        u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {u.status === 'active' ? <Check size={10} /> : <X size={10} />}
                                        {u.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                                    {new Date(u.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {updating === u.id ? (
                                        <Loader2 className="animate-spin text-primary inline-block" size={18} />
                                    ) : (
                                        <div className="relative group inline-block">
                                            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl p-2 hidden group-hover:block z-10">
                                                <p className="text-[10px] font-black uppercase text-gray-400 px-3 py-1 mb-1">Change Role</p>
                                                {['traveler', 'guide', 'admin'].map(r => (
                                                    <button 
                                                        key={r}
                                                        onClick={() => handleRoleUpdate(u.id, r)}
                                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors ${u.role === r ? 'text-primary bg-primary/5' : 'text-gray-700'}`}
                                                    >
                                                        {r}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {(!users || users.length === 0) && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserTable;
