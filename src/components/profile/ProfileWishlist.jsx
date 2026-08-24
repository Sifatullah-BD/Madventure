import React, { useState, useEffect } from 'react';
import { Heart, Loader2, ChevronRight, MapPin, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getWishlist } from '../../services/communityService';
import { useLanguage } from '../../context/LanguageContext';

const ProfileWishlist = ({ user }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { language } = useLanguage();

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const data = await getWishlist(user.id);
                setWishlist(data || []);
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, [user]);

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
                        <Heart className="text-pink-500" /> 
                        {language === 'bn' ? 'আমার উইশলিস্ট' : 'My Wishlist'}
                    </h3>
                    <p className="text-gray-400 text-sm">
                        {language === 'bn' ? 'আপনার সংরক্ষিত প্রিয় স্থান এবং ট্যুর' : 'Your saved favorite places and tours'}
                    </p>
                </div>
                <button 
                    onClick={() => navigate('/wishlist')}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold text-white border border-white/10 transition-all flex items-center gap-2"
                >
                    {language === 'bn' ? 'পূর্ণাঙ্গ উইশলিস্ট' : 'Full Wishlist'}
                    <ChevronRight size={16} />
                </button>
            </div>

            {wishlist.length === 0 ? (
                <div className="text-center py-20 bg-black/20 rounded-3xl border border-dashed border-white/10">
                    <Heart size={48} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-gray-400 font-bold">{language === 'bn' ? 'উইশলিস্টে কিছু নেই' : 'Your wishlist is empty'}</p>
                    <button 
                        onClick={() => navigate('/explore')}
                        className="mt-4 px-6 py-2 bg-pink-500 hover:bg-pink-600 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-pink-500/20"
                    >
                        {language === 'bn' ? 'এক্সপ্লোর করুন' : 'Explore Places'}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.slice(0, 6).map(item => (
                        <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-pink-500/50 transition-colors">
                            <div className="h-40 bg-gray-900 flex items-center justify-center relative">
                                <Image size={32} className="text-gray-700" />
                                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                                    {item.item_type}
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="text-white font-bold mb-1">Saved {item.item_type}</h4>
                                <p className="text-xs text-gray-400 flex items-center gap-1 mb-4">
                                    <MapPin size={12} /> ID: {item.item_id.toString().substring(0, 8)}...
                                </p>
                                <button 
                                    onClick={() => navigate(`/${item.item_type === 'tour' ? 'tours' : 'places'}/${item.item_id}`)}
                                    className="w-full py-2 bg-white/5 hover:bg-pink-500/10 text-pink-500 rounded-lg text-sm font-bold transition-colors"
                                >
                                    {language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfileWishlist;
