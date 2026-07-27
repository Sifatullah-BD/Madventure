import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getReviews } from '../../services/communityService';
import { uploadImages } from '../../services/storageService';
import { unicornService } from '../../services/unicornService';
import { Star, Image as ImageIcon, CheckCircle, Upload, ShieldCheck, BadgeCheck, Loader2, XCircle, MessageSquare } from 'lucide-react';

const ReviewSection = ({ entityType, entityId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [files, setFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
        // eslint-disable-next-line
    }, [entityId, entityType]);

    const fetchReviews = async () => {
        setLoading(true);
        const { data, error } = await getReviews(entityType, entityId);
        if (!error && data) {
            setReviews(data);
        }
        setLoading(false);
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files).slice(0, 3)); // Max 3 images
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to submit a review.');
            return;
        }

        setSubmitting(true);
        try {
            let photoUrls = [];

            // Upload images if exist
            if (files.length > 0) {
                const { data, error } = await uploadImages('reviews_media', files);
                if (!error && data) {
                    photoUrls = data;
                }
            }

            // UNICORN FEATURE: Verified Review Submission
            const newReview = await unicornService.submitReview(
                user.id,
                entityType,
                entityId,
                rating,
                comment,
                photoUrls
            );

            if (newReview) {
                setReviews([newReview, ...reviews]);
                setComment('');
                setRating(5);
                setFiles([]);
                alert("Review published successfully!");
            }
        } catch (err) {
            alert(err.message || "Failed to submit review.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 mt-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-2xl font-black font-heading text-gray-900 flex items-center gap-2">
                        <Star className="text-yellow-400 fill-current" /> 
                        Experience Feedback
                    </h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Authentic Traveler Reviews ({reviews.length})</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                    <ShieldCheck className="text-blue-600" size={16} />
                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-tighter">100% Verified System</span>
                </div>
            </div>

            {/* Review Input Box */}
            <div className="bg-gray-50/50 border border-gray-100 rounded-[1.5rem] p-6 mb-12 shadow-inner">
                {user ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="shrink-0">
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Your Rating</label>
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-all hover:scale-125"
                                        >
                                            <Star
                                                size={24}
                                                className={star <= rating ? "text-yellow-400 fill-current drop-shadow-sm" : "text-gray-200"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Share Your Thoughts</label>
                                <textarea
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm text-sm"
                                    placeholder="What made your trip special? (Minimum 10 characters)"
                                    rows={3}
                                    required
                                    minLength={10}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2 border-t border-gray-100/50">
                            <div className="flex items-center gap-3">
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden" 
                                    id="reviewPhotos" 
                                />
                                <label htmlFor="reviewPhotos" className="cursor-pointer text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white border border-gray-200 hover:border-primary hover:text-primary px-5 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-sm">
                                    <ImageIcon size={14} /> Add Photos {files.length > 0 && `(${files.length})`}
                                </label>
                                {files.length > 0 && (
                                    <button onClick={() => setFiles([])} className="text-red-400 hover:text-red-600"><XCircle size={14}/></button>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full sm:w-auto bg-primary hover:bg-green-800 text-white font-black px-10 py-3 rounded-full shadow-xl shadow-green-900/10 hover:shadow-green-900/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={20}/> : 'Publish Review'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-8">
                        <BadgeCheck className="mx-auto mb-3 text-gray-300" size={40} />
                        <p className="text-gray-500 font-bold mb-3">Authentic reviews help the community.</p>
                        <button className="bg-white border border-gray-200 text-primary px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">Log in to Review</button>
                    </div>
                )}
            </div>

            {/* Display Reviews */}
            <div className="space-y-10">
                {loading ? (
                    <div className="flex items-center gap-3 text-gray-400 font-bold italic animate-pulse">
                        <Loader2 className="animate-spin" size={18}/> Validating reviews...
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageSquare className="mx-auto mb-4 text-gray-100" size={64} />
                        <p className="text-gray-400 font-medium italic">No stories shared yet. Be the first to break the silence!</p>
                    </div>
                ) : (
                    reviews.map((rev) => (
                        <div key={rev.id} className="group">
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                <div className="flex flex-row sm:flex-col items-center gap-3 sm:w-24 shrink-0">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-[1rem] sm:rounded-[1.5rem] flex items-center justify-center text-gray-500 font-black text-xl shadow-sm border border-white">
                                       {rev.user_name?.[0] || 'A'}
                                    </div>
                                    <div className="text-center">
                                        <p className="font-black text-gray-900 text-[10px] uppercase truncate max-w-[100px]">{rev.user_name || 'Adventurer'}</p>
                                        <p className="text-[9px] text-gray-400 font-bold">{new Date(rev.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex-1 bg-gray-50/30 p-5 rounded-[1.5rem] border border-gray-100 relative group-hover:border-primary/20 group-hover:bg-white transition-all">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className={i < rev.rating ? "text-yellow-400 fill-current" : "text-gray-200"} />
                                            ))}
                                        </div>
                                        {rev.verified_booking && (
                                            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100 animate-in fade-in zoom-in duration-500">
                                                <BadgeCheck size={12} />
                                                <span className="text-[9px] font-black uppercase tracking-tighter">Verified Buyer</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed font-medium italic">"{rev.review || rev.comment}"</p>
                                    
                                    {/* Render Attached Photos */}
                                    {rev.photos && rev.photos.length > 0 && (
                                        <div className="flex gap-3 mt-5 overflow-x-auto pb-2 no-scrollbar">
                                            {rev.photos.map((photo, i) => (
                                                <div key={i} className="relative group/img overflow-hidden rounded-[1rem] shadow-sm border border-white">
                                                    <img src={photo} alt="" className="w-28 h-28 object-cover group-hover/img:scale-110 transition-transform duration-500" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
