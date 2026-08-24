import React, { useState, useEffect } from 'react';
import { Calendar, Loader2, ChevronRight, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { useLanguage } from '../../context/LanguageContext';

const ProfileBookings = ({ user }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { language } = useLanguage();

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const data = await bookingService.getMyBookings();
                setBookings(data || []);
            } catch (err) {
                console.error('Error fetching bookings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return <CheckCircle2 className="text-emerald-500" size={16} />;
            case 'pending': return <Clock className="text-amber-500" size={16} />;
            case 'cancelled': return <XCircle className="text-red-500" size={16} />;
            case 'refunded': return <AlertCircle className="text-blue-500" size={16} />;
            default: return <Clock className="text-gray-500" size={16} />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-32 bg-[#0d1a11] rounded-[2.5rem] border border-white/5 shadow-xl">
                <Loader2 className="animate-spin text-forest-light" size={40} />
            </div>
        );
    }

    return (
        <div className="bg-[#0d1a11] p-6 sm:p-10 rounded-[2.5rem] border border-white/5 shadow-xl min-h-[60vh]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-3 mb-2">
                        <Calendar className="text-forest-light" /> 
                        {language === 'bn' ? 'আমার বুকিংসমূহ' : 'My Bookings'}
                    </h3>
                    <p className="text-gray-400 text-sm">
                        {language === 'bn' ? 'আপনার সকল বুকিংয়ের তালিকা' : 'A complete list of all your bookings'}
                    </p>
                </div>
                <button 
                    onClick={() => navigate('/bookings')}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold text-white border border-white/10 transition-all flex items-center gap-2"
                >
                    {language === 'bn' ? 'পূর্ণাঙ্গ হিস্টোরি' : 'Full History'}
                    <ChevronRight size={16} />
                </button>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-20 bg-black/20 rounded-3xl border border-dashed border-white/10">
                    <Calendar size={48} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-gray-400 font-bold">{language === 'bn' ? 'কোনো বুকিং পাওয়া যায়নি' : 'No bookings found'}</p>
                    <button 
                        onClick={() => navigate('/tour-plans')}
                        className="mt-4 px-6 py-2 bg-forest-light hover:bg-forest-light/80 rounded-xl text-white font-bold text-sm transition-all"
                    >
                        {language === 'bn' ? 'বুকিং করুন' : 'Make a Booking'}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.slice(0, 10).map(booking => (
                        <div key={booking.id} className="bg-white/5 border border-white/10 hover:border-forest-light/30 p-5 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 transition-all">
                            <div>
                                <h4 className="text-white font-bold mb-1">{booking.tours?.title || 'Unknown Tour'}</h4>
                                <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                                    <span>ID: #{booking.id.slice(0, 8)}</span>
                                    <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1">
                                        {getStatusIcon(booking.status)} 
                                        <span className="uppercase tracking-wider">{booking.status}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:justify-center">
                                <span className="text-lg font-black text-white">৳{(booking.total_amount || 0).toLocaleString()}</span>
                                <button 
                                    onClick={() => navigate(`/bookings/${booking.id}`)}
                                    className="text-forest-light hover:text-white text-sm font-bold"
                                >
                                    {language === 'bn' ? 'বিস্তারিত' : 'Details'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfileBookings;
