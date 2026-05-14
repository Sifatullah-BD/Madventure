import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Star, Check, Shield, MessageCircle, ArrowLeft, Users, Heart, Loader2 } from 'lucide-react';
import { agencies } from '../data/tourData';
import TourBookingModal from '../components/tours/TourBookingModal';
import { supabaseService } from '../services/supabaseService';
import { addToWishlist, removeFromWishlist, getWishlist } from '../api/community';
import { useAuth } from '../hooks/useAuth';
import ReviewSection from '../components/reviews/ReviewSection';
import InteractiveMap from '../components/map/InteractiveMap';

const TourDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistId, setWishlistId] = useState(null);
    const [wishlisting, setWishlisting] = useState(false);

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const data = await supabaseService.getTourById(id);
                setEvent(data);
                
                if (user) {
                    const { data: wishlist } = await getWishlist(user.id);
                    const item = wishlist?.find(w => w.item_id === id && w.item_type === 'tour');
                    if (item) {
                        setIsWishlisted(true);
                        setWishlistId(item.id);
                    }
                }
            } catch (error) {
                console.error("Error fetching tour:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTour();
    }, [id, user]);

    const toggleWishlist = async () => {
        if (!user) {
            alert("Please login to add to wishlist.");
            return;
        }
        setWishlisting(true);
        if (isWishlisted) {
            await removeFromWishlist(wishlistId);
            setIsWishlisted(false);
            setWishlistId(null);
        } else {
            const { data, error } = await addToWishlist(user.id, 'tour', id);
            if (data) {
                setIsWishlisted(true);
                setWishlistId(data.id);
            }
        }
        setWishlisting(false);
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin text-primary" size={40}/></div>;
    if (!event) return <div className="pt-24 text-center">Event not found</div>;

    // Handle Supabase snake_case keys
    const agencyId = event.agencyId || event.agency_id;
    const agency = agencies.find(a => a.id === agencyId) || { name: 'Verified Agency', rating: 4.8, logo: 'https://ui-avatars.com/api/?name=Agency&background=random' };
    const startDate = event.dates?.start || event.start_date;
    const capacity = event.capacity || event.max_group_size || 20;
    const bookingMoney = event.bookingMoney || 1000;
    const images = event.images || (event.image_url ? [event.image_url] : ['https://via.placeholder.com/800x400']);

    const handleBookingConfirm = (bookingData) => {
        setShowBookingModal(false);
        // Simulate booking success
        alert(`Booking Confirmed! Paid: ৳${bookingData.amount}. You have been added to the Trip Chat Group.`);
        navigate('/tours'); // Or to a "My Bookings" page
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-8">
                    <div className="relative h-64 md:h-96">
                        <img src={images[0]} alt={event.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                        {/* Top Buttons */}
                        <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10">
                            <button
                                onClick={() => navigate(-1)}
                                className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <button
                                onClick={toggleWishlist}
                                disabled={wishlisting}
                                className={`p-2.5 rounded-full backdrop-blur-md transition-all ${isWishlisted ? 'bg-red-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}
                            >
                                <Heart size={24} className={isWishlisted ? 'fill-current' : ''} />
                            </button>
                        </div>

                        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
                            <span className="bg-[#1B5E20] px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">
                                {event.category}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-bold mb-2">{event.title}</h1>
                            <div className="flex items-center gap-4 text-sm md:text-base opacity-90">
                                <div className="flex items-center gap-1"><MapPin size={16} /> {event.destination}</div>
                                <div className="flex items-center gap-1"><Clock size={16} /> {event.duration}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overview */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {event.description || `Join us for an unforgettable journey to ${event.destination}. Experience the beauty of nature, thrilling adventures, and make memories that last a lifetime. Organized by ${agency.name}, ensuring a safe and premium experience.`}
                            </p>

                            {event.youtube_url && (
                                <div className="mb-8">
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
                                        ট্যুরের ভিডিও
                                    </h3>
                                    <YouTubeEmbed url={event.youtube_url} title={event.title} />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">Includes</h3>
                                    <ul className="space-y-2">
                                        {(event.includes || ['Breakfast', 'Transport', 'Guide']).map((item, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                <Check size={14} className="text-green-500" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">Excludes</h3>
                                    <ul className="space-y-2">
                                        {(event.excludes || ['Personal Expenses', 'Dinner']).map((item, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                <span className="text-red-400 text-xs">✕</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Itinerary */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Itinerary</h2>
                            <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                                {(event.itinerary || [
                                    {day: 'Day 1', title: 'Arrival', description: 'Arrive at destination and check-in.'},
                                    {day: 'Day 2', title: 'Exploration', description: 'Visit main attractions.'}
                                ]).map((day, i) => (
                                    <div key={i} className="relative pl-12">
                                        <div className="absolute left-0 top-0 w-8 h-8 bg-[#1B5E20] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-green-900/20">
                                            {day.day || i+1}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{day.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{day.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cancellation Policy */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Shield className="text-orange-500" /> Cancellation Policy
                            </h2>
                            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                                <h4 className="font-bold text-orange-800 mb-1">
                                    {event.cancellation_policies?.name || 'Flexible Cancellation'}
                                </h4>
                                <p className="text-sm text-orange-700">
                                    {event.cancellation_policies?.description || '100% refund up to 72 hours before departure.'}
                                </p>
                            </div>
                        </div>

                        {/* Location Mini-Map */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <MapPin className="text-[#1B5E20]" /> Destination Location
                            </h2>
                            <InteractiveMap items={[event]} height="300px" />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Booking Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <p className="text-sm text-gray-500">Starting from</p>
                                    <p className="text-3xl font-bold text-[#1B5E20]">৳{event.price}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                                        Booking Money: ৳{bookingMoney}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-xl">
                                    <span className="text-gray-500">Date</span>
                                    <span className="font-bold text-gray-900">{startDate}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-xl">
                                    <span className="text-gray-500">Capacity</span>
                                    <span className="font-bold text-gray-900">{capacity} Seats</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(`/tours/${id}/book`)}
                                className="w-full py-4 bg-[#1B5E20] text-white rounded-xl font-bold shadow-lg shadow-green-900/20 hover:bg-green-800 transition-all transform hover:-translate-y-1 mb-4"
                            >
                                Book Seat Now
                            </button>

                            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                <Shield size={12} />
                                <span>Secure Payment & Verified Agency</span>
                            </div>
                        </div>

                        {/* Partner Linkage Card */}
                        <div className="bg-orange-50 p-6 rounded-2xl shadow-sm border border-orange-100">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center shrink-0">
                                    <Users size={24}/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">ভ্রমণসঙ্গী খুঁজছেন?</h4>
                                    <p className="text-sm text-gray-600 mb-4">এই ট্যুরে শেয়ারে যাওয়ার জন্য পার্টনার খুঁজুন।</p>
                                    <button 
                                        onClick={() => navigate(`/community?tab=partner&districtId=${event.destination_id || id}`)}
                                        className="text-orange-600 font-bold bg-white border-2 border-orange-200 px-4 py-2.5 rounded-xl text-sm w-full hover:bg-orange-600 hover:border-orange-600 hover:text-white transition-all shadow-sm"
                                    >
                                        সঙ্গী খুঁজুন
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Organizer Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">Organized by</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <img src={agency.logo} alt={agency.name} className="w-12 h-12 rounded-full" />
                                <div>
                                    <p className="font-bold text-gray-900 flex items-center gap-1">
                                        {agency.name}
                                        {agency.verified && <Check size={14} className="text-blue-500" />}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                                        <Star size={12} fill="currentColor" />
                                        {agency.rating} Rating
                                    </div>
                                </div>
                            </div>
                            <button className="w-full py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
                                <MessageCircle size={16} />
                                Chat with Organizer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <ReviewSection entityType="tour" entityId={id} />
            </div>

            <TourBookingModal
                event={event}
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                onConfirm={handleBookingConfirm}
            />
        </div>
    );
};

export default TourDetails;
