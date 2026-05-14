import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Globe, Facebook, Star, BadgeCheck, Sparkles, Clock, Users, ChevronLeft, Share2, Heart, ExternalLink, ArrowRight, Loader2 } from 'lucide-react';
import { businessService } from '../services/businessService';
import { BUSINESS_CATEGORIES } from '../data/businessData';
import BusinessReviewCard from '../components/business/BusinessReviewCard';
import BusinessBookingModal from '../components/business/BusinessBookingModal';
import BusinessCard from '../components/business/BusinessCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import ReviewSection from '../components/reviews/ReviewSection';
import { addToWishlist, removeFromWishlist, getWishlist } from '../api/community';
import { useAuth } from '../hooks/useAuth';

const BusinessDetail = () => {
    const { slug } = useParams();
    const { user } = useAuth();
    const [business, setBusiness] = useState(null);
    const [listings, setListings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [similar, setSimilar] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [bookingListing, setBookingListing] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistId, setWishlistId] = useState(null);
    const [wishlisting, setWishlisting] = useState(false);

    useEffect(() => {
        loadBusiness();
    }, [slug, user]);

    const loadBusiness = async () => {
        setIsLoading(true);
        try {
            const biz = await businessService.getBusinessBySlug(slug);
            setBusiness(biz);
            if (biz) {
                const [ls, rv, sm] = await Promise.all([
                    businessService.getListingsByBusiness(biz.id),
                    businessService.getReviewsByBusiness(biz.id),
                    businessService.getSimilarBusinesses(biz.category, biz.id),
                ]);
                setListings(ls);
                setReviews(rv);
                setSimilar(sm);

                if (user) {
                    const { data: wishlist } = await getWishlist(user.id);
                    const item = wishlist?.find(w => w.item_id === biz.id && w.item_type === 'business');
                    if (item) {
                        setIsWishlisted(true);
                        setWishlistId(item.id);
                    }
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

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
            const { data, error } = await addToWishlist(user.id, 'business', business.id);
            if (data) {
                setIsWishlisted(true);
                setWishlistId(data.id);
            }
        }
        setWishlisting(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
                <div className="max-w-[1140px] mx-auto">
                    <LoadingSkeleton variant="banner" />
                    <div className="mt-6"><LoadingSkeleton variant="text" lines={5} /></div>
                </div>
            </div>
        );
    }

    if (!business) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="text-center">
                    <p className="text-6xl mb-4">😕</p>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">ব্যবসা পাওয়া যায়নি</h2>
                    <Link to="/explore" className="text-primary font-bold hover:underline">এক্সপ্লোর পেজে ফিরে যান</Link>
                </div>
            </div>
        );
    }

    const cat = BUSINESS_CATEGORIES.find(c => c.id === business.category);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Photo Gallery Header */}
            <div className="relative h-72 md:h-96 overflow-hidden">
                <img
                    src={business.images?.[activeImage] || business.cover_image}
                    alt={business.name}
                    className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Nav */}
                <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
                    <Link to="/explore" className="bg-black/40 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/60 transition-colors">
                        <ChevronLeft size={20} />
                    </Link>
                    <div className="flex gap-2">
                        <button className="bg-black/40 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/60 transition-colors">
                            <Share2 size={18} />
                        </button>
                        <button
                            onClick={toggleWishlist}
                            disabled={wishlisting}
                            className={`backdrop-blur-md p-2 rounded-full transition-all shadow-lg ${isWishlisted ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'}`}
                        >
                            <Heart size={18} className={isWishlisted ? 'fill-white' : ''} />
                        </button>
                    </div>
                </div>

                {/* Thumbnail strip */}
                {business.images?.length > 1 && (
                    <div className="absolute bottom-4 left-4 flex gap-2 z-10">
                        {business.images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="max-w-[1140px] mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Main Content */}
                    <div className="flex-1 space-y-8">
                        {/* Business Info */}
                        <div>
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full mb-2">
                                        {cat?.label}
                                    </span>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{business.name}</h1>
                                </div>
                                <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-xl flex-shrink-0">
                                    <Star size={18} className="text-yellow-500 fill-yellow-500" />
                                    <span className="text-lg font-bold text-gray-800 dark:text-white">{business.rating}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">({business.reviewCount})</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-4">
                                <MapPin size={14} /> {business.location}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{business.description}</p>
                        </div>

                        {/* Amenities */}
                        {business.amenities?.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">সুবিধাসমূহ</h3>
                                <div className="flex flex-wrap gap-2">
                                    {business.amenities.map((a, i) => (
                                        <span key={i} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full text-sm border border-gray-200 dark:border-gray-700 font-medium">
                                            {a}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Listings */}
                        {listings.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                                    উপলব্ধ সার্ভিস / রুম
                                </h3>
                                <div className="space-y-4">
                                    {listings.map(listing => (
                                        <div key={listing.id} className="bg-white dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow">
                                            {listing.images?.[0] && (
                                                <img src={listing.images[0]} alt={listing.title} className="w-full md:w-40 h-28 rounded-xl object-cover flex-shrink-0" />
                                            )}
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-800 dark:text-white mb-1">{listing.title}</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{listing.description}</p>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {listing.features?.map((f, i) => (
                                                        <span key={i} className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md">{f}</span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-xl font-black text-primary">৳{listing.price.toLocaleString()}</span>
                                                        <span className="text-xs text-gray-500 ml-1">/ {listing.priceUnit === 'per_night' ? 'রাত' : listing.priceUnit === 'per_person' ? 'জন' : 'ট্রিপ'}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => setBookingListing(listing)}
                                                        className="bg-primary text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-green-700 transition-all hover:scale-105"
                                                    >
                                                        বুক করুন
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <ReviewSection entityType="business" entityId={business.id} />
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-full lg:w-80 space-y-4 flex-shrink-0">
                        <div className="bg-white dark:bg-surface p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-20">
                            <h4 className="font-bold text-gray-800 dark:text-white mb-4">যোগাযোগ</h4>
                            <div className="space-y-3">
                                {business.phone && (
                                    <a href={`tel:${business.phone}`} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <Phone size={18} className="text-primary flex-shrink-0" />
                                        <span className="font-medium">{business.phone}</span>
                                    </a>
                                )}
                                {business.whatsapp && (
                                    <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-white bg-green-500 hover:bg-green-600 transition-colors p-3 rounded-xl font-bold">
                                        <MessageCircle size={18} />
                                        <span>WhatsApp এ মেসেজ করুন</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {bookingListing && (
                <BusinessBookingModal
                    listing={bookingListing}
                    business={business}
                    onClose={() => setBookingListing(null)}
                />
            )}
        </div>
    );
};

export default BusinessDetail;
