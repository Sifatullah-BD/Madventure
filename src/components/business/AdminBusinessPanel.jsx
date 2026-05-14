import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Clock, BadgeCheck, Sparkles, Building2, MapPin, Phone } from 'lucide-react';
import { businessService } from '../../services/businessService';
import { BUSINESS_CATEGORIES } from '../../data/businessData';

const AdminBusinessPanel = () => {
    const [pending, setPending] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        loadPending();
    }, []);

    const loadPending = async () => {
        setIsLoading(true);
        const data = await businessService.getPendingBusinesses();
        setPending(data);
        setIsLoading(false);
    };

    const handleApprove = async (id) => {
        await businessService.approveBusiness(id);
        setPending(prev => prev.filter(b => b.id !== id));
    };

    const handleReject = async () => {
        if (rejectModal) {
            await businessService.rejectBusiness(rejectModal, rejectReason);
            setPending(prev => prev.filter(b => b.id !== rejectModal));
            setRejectModal(null);
            setRejectReason('');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Building2 size={22} className="text-primary" /> ব্যবসা অনুমোদন
                </h2>
                <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
                    <Clock size={14} className="inline mr-1" /> {pending.length} টি অপেক্ষমাণ
                </span>
            </div>

            {isLoading ? (
                <div className="text-center py-8 text-gray-400 animate-pulse">লোড হচ্ছে...</div>
            ) : pending.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-surface rounded-2xl border border-gray-100 dark:border-gray-700">
                    <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">সব আবেদন পর্যালোচিত হয়েছে!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pending.map(biz => {
                        const cat = BUSINESS_CATEGORIES.find(c => c.id === biz.category);
                        return (
                            <div key={biz.id} className="bg-white dark:bg-surface p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{cat?.label}</span>
                                            <span className="text-xs text-gray-400">{biz.createdAt}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{biz.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{biz.description}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1"><MapPin size={12} /> {biz.district}</span>
                                            <span className="flex items-center gap-1"><Phone size={12} /> {biz.phone}</span>
                                            {biz.ownerName && <span>আবেদনকারী: {biz.ownerName}</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleApprove(biz.id)}
                                            className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-green-600 transition-colors"
                                        >
                                            <CheckCircle size={14} /> অনুমোদন
                                        </button>
                                        <button
                                            onClick={() => setRejectModal(biz.id)}
                                            className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                        >
                                            <XCircle size={14} /> প্রত্যাখ্যান
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-surface p-6 rounded-2xl max-w-md w-full shadow-2xl">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">প্রত্যাখ্যানের কারণ</h3>
                        <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 resize-none mb-4"
                            placeholder="প্রত্যাখ্যানের কারণ লিখুন..."
                        />
                        <div className="flex gap-2 justify-end">
                            <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                বাতিল
                            </button>
                            <button onClick={handleReject} className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-600 transition-colors">
                                প্রত্যাখ্যান নিশ্চিত করুন
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBusinessPanel;
