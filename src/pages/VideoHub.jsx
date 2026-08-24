import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Play, Search, Video, Loader2, Heart } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../components/ui/Toast';

const VideoHub = ({ user, onOpenLogin }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likedVideos, setLikedVideos] = useState({});
    const { t } = useTranslation();
    const toast = useToast();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const { data, error } = await supabase
                    .from('videos')
                    .select('*')
                    .eq('visibility', 'public')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setVideos(data || []);
            } catch (err) {
                console.error('Error fetching videos:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-16">
            <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Video Hub
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Explore beautiful travel stories and moments.
                    </p>
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-primary w-10 h-10" />
                    </div>
                ) : videos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map(video => (
                            <div key={video.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                                <div className="relative aspect-video bg-gray-100 dark:bg-slate-700">
                                    <video 
                                        src={video.video_url} 
                                        poster={video.thumbnail_url}
                                        controls 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{video.title}</h3>
                                    {video.description && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                                            {video.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-700 pt-3">
                                        <button 
                                            onClick={() => {
                                                if (!user && onOpenLogin) {
                                                    onOpenLogin();
                                                } else {
                                                    setLikedVideos(prev => ({...prev, [video.id]: !prev[video.id]}));
                                                    toast?.success?.(likedVideos[video.id] ? 'Like removed' : 'Video Liked! ❤️');
                                                }
                                            }}
                                            className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${likedVideos[video.id] ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                                        >
                                            <Heart size={18} fill={likedVideos[video.id] ? "currentColor" : "none"} />
                                            Like
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl">
                        <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No videos yet</h2>
                        <p className="text-gray-500">Check back later for exciting travel videos.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoHub;
