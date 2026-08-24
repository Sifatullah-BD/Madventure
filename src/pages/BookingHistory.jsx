import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Clock, 
    CheckCircle2, 
    XCircle, 
    AlertCircle, 
    RefreshCcw, 
    ChevronRight, 
    Search,
    Filter,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { bookingService } from '../services/bookingService';
import { useToast } from '../components/ui/Toast';

const BookingHistory = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, upcoming, completed, cancelled
    const [refundModal, setRefundModal] = useState({ open: false, bookingId: null, amount: 0 });
    const [refundReason, setRefundReason] = useState('');
    const [submittingRefund, setSubmittingRefund] = useState(false);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await bookingService.getMyBookings();
            setBookings(data || []);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const handleRequestRefund = async (e) => {
        e.preventDefault();
        setSubmittingRefund(true);
        try {
            const { error } = await supabase
                .from('refund_requests')
                .insert({
                    booking_id: refundModal.bookingId,
                    reason: refundReason,
                    refund_amount: refundModal.amount,
                    refund_status: 'pending'
                });
            
            if (error) throw error;
            
            // Update booking status to 'refund_pending' or similar if needed
            toast.success('Refund request submitted successfully!');
            setRefundModal({ open: false, bookingId: null, amount: 0 });
            setRefundReason('');
            fetchBookings();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmittingRefund(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            case 'refunded': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050f08] flex flex-col transition-colors">
            <DashboardHeader 
                title="বুকিং ও ট্রানজাকশন হিস্টোরি"
                subtitle="আপনার সকল ট্যুর এবং ইভেন্ট বুকিংয়ের বিস্তারিত তথ্য এখানে দেখুন।"
            />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full py-8">
                
                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto no-scrollbar">
                        {['all', 'upcoming', 'completed', 'cancelled'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${filter === f ? 'bg-primary text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="বুকিং আইডি দিয়ে খুঁজুন..." 
                            className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm w-full sm:w-64 text-gray-900 dark:text-white placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Booking List */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
                ) : (
                    <div className="space-y-4">
                        {bookings.length > 0 ? bookings.map(booking => (
                            <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyles(booking.booking_status)}`}>
                                                {booking.booking_status}
                                            </span>
                                            <span className="text-gray-400 text-xs font-mono">#{booking.id.slice(0, 8)}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{booking.tour_title || 'Tour Name'}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1.5"><Clock size={16}/> {new Date(booking.created_at).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">৳{booking.total_amount || 0}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 md:flex-col md:items-end justify-center">
                                        <button 
                                            onClick={() => navigate(`/booking-confirmation?booking_id=${booking.id}`)}
                                            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                                        >
                                            View Ticket <ChevronRight size={16}/>
                                        </button>
                                        
                                        {booking.booking_status === 'confirmed' && (
                                            <button 
                                                onClick={() => setRefundModal({ open: true, bookingId: booking.id, amount: booking.total_amount })}
                                                className="text-red-500 hover:text-red-700 text-xs font-bold underline flex items-center gap-1"
                                            >
                                                <RefreshCcw size={14}/> Request Refund
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                                <AlertCircle className="mx-auto mb-4 text-gray-300 dark:text-gray-600" size={48} />
                                <p className="text-gray-500 dark:text-gray-400 font-bold">এখনো কোনো বুকিং পাওয়া যায়নি।</p>
                                <button onClick={() => navigate('/destinations')} className="mt-4 text-primary font-black hover:underline">নতুন ট্যুর খুঁজুন →</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Refund Modal */}
            {refundModal.open && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-red-50 p-6 text-red-700 border-b border-red-100">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <RefreshCcw size={24}/> রিফান্ড রিকোয়েস্ট
                            </h2>
                            <p className="text-xs mt-1 text-red-600/80 font-medium tracking-tight">আপনার বুকিং আইডি: #{refundModal.bookingId.slice(0, 8)}</p>
                        </div>
                        <form onSubmit={handleRequestRefund} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">রিফান্ড এমাউন্ট</label>
                                <div className="bg-gray-100 p-3 rounded-xl font-black text-gray-800">৳{refundModal.amount}</div>
                                <p className="text-[10px] text-gray-400 mt-2 italic">* রিফান্ড পলিসি অনুযায়ী এডমিন চার্জ প্রযোজ্য হতে পারে।</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">রিফান্ডের কারণ</label>
                                <textarea 
                                    required
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-red-100 resize-none"
                                    rows="4"
                                    placeholder="কেন রিফান্ড চাচ্ছেন তা বিস্তারিত লিখুন..."
                                ></textarea>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setRefundModal({ open: false, bookingId: null, amount: 0 })}
                                    className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    বাতিল
                                </button>
                                <button 
                                    type="submit"
                                    disabled={submittingRefund}
                                    className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                                >
                                    {submittingRefund ? <Loader2 className="animate-spin" size={18}/> : 'রিকোয়েস্ট পাঠান'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingHistory;
