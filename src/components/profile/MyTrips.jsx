import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, MapPin, Loader2, Image, ChevronRight } from 'lucide-react';
import { bookingService } from '../../services/bookingService';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const MyTrips = ({ user }) => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('upcoming');
    const navigate = useNavigate();
    const { language } = useLanguage();

    useEffect(() => {
        const fetchTrips = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const data = await bookingService.getMyBookings();
                if (data) {
                    setTrips(data);
                }
            } catch (error) {
                console.error("Error fetching trips:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, [user]);

    const isUpcoming = (booking) => {
        if (!booking.travel_date) return false;
        return new Date(booking.travel_date) > new Date() && booking.status !== 'cancelled';
    };

    const isCompleted = (booking) => {
        if (!booking.travel_date) return false;
        return new Date(booking.travel_date) <= new Date() && booking.status !== 'cancelled';
    };

    const isCancelled = (booking) => booking.status === 'cancelled';

    const filteredTrips = trips.filter(trip => {
        if (filter === 'upcoming') return isUpcoming(trip);
        if (filter === 'completed') return isCompleted(trip);
        if (filter === 'cancelled') return isCancelled(trip);
        return true;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed':
                return <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{language === 'bn' ? 'নিশ্চিত' : 'Confirmed'}</span>;
            case 'pending':
                return <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{language === 'bn' ? 'অপেক্ষমাণ' : 'Pending'}</span>;
            case 'cancelled':
                return <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{language === 'bn' ? 'বাতিল' : 'Cancelled'}</span>;
            default:
                return null;
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
                        <Briefcase className="text-forest-light" /> 
                        {language === 'bn' ? 'আমার ট্রিপসমূহ' : 'My Trips'}
                    </h3>
                    <p className="text-gray-400 text-sm">
                        {language === 'bn' ? 'আপনার বুক করা এবং সম্পূর্ণ করা ট্রিপগুলো পরিচালনা করুন' : 'Manage your upcoming and completed adventures'}
                    </p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-xl">
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'upcoming' ? 'bg-forest-light text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        {language === 'bn' ? 'আসন্ন' : 'Upcoming'}
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'completed' ? 'bg-forest-light text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        {language === 'bn' ? 'সম্পন্ন' : 'Completed'}
                    </button>
                    <button
                        onClick={() => setFilter('cancelled')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'cancelled' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        {language === 'bn' ? 'বাতিল' : 'Cancelled'}
                    </button>
                </div>
            </div>

            {filteredTrips.length === 0 ? (
                <div className="text-center py-20 bg-black/20 rounded-3xl border border-dashed border-white/10">
                    <MapPin size={48} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-gray-400 font-bold">{language === 'bn' ? 'কোনো ট্রিপ পাওয়া যায়নি' : 'No trips found in this category'}</p>
                    <button 
                        onClick={() => navigate('/tour-plans')}
                        className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold text-sm transition-all"
                    >
                        {language === 'bn' ? 'নতুন ট্রিপ খুঁজুন' : 'Explore Tours'}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredTrips.map(trip => (
                        <div key={trip.id} className="bg-white/5 border border-white/10 hover:border-forest-light/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 transition-all group">
                            
                            {/* Trip Image Thumbnail */}
                            <div className="w-full sm:w-40 h-32 rounded-xl bg-gray-900 overflow-hidden shrink-0 relative">
                                {trip.tours?.images?.[0] ? (
                                    <img src={trip.tours.images[0]} alt="tour" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
                                        <Image size={24} />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    {getStatusBadge(trip.status)}
                                </div>
                            </div>

                            {/* Trip Details */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-lg font-black text-white mb-1 group-hover:text-forest-light transition-colors">
                                        {trip.tours?.title || 'Custom Trip'}
                                    </h4>
                                    <p className="text-gray-400 text-sm flex items-center gap-2 mb-3">
                                        <MapPin size={14} className="text-gray-500" /> {trip.tours?.destination || 'Multiple'}
                                    </p>
                                    
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500">
                                        <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg">
                                            <Calendar size={14} className="text-forest-light" />
                                            {trip.travel_date ? new Date(trip.travel_date).toLocaleDateString() : 'TBD'}
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg">
                                            <Briefcase size={14} className="text-sky-400" />
                                            {trip.travelers || 1} {language === 'bn' ? 'জন' : 'Travelers'}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 sm:mt-0 flex justify-end">
                                    <button 
                                        onClick={() => navigate(`/bookings/${trip.id}`)}
                                        className="text-forest-light hover:text-white text-sm font-bold flex items-center gap-1 transition-colors"
                                    >
                                        {language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'} <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTrips;
