import React, { useState, useEffect } from 'react';
import { MessageSquare, Loader2, ChevronRight, PenTool, Image, Eye, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { blogService } from '../../features/blog/blogService';
import { useLanguage } from '../../context/LanguageContext';

const MyPosts = ({ user }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { language } = useLanguage();

    useEffect(() => {
        const fetchPosts = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const data = await blogService.getUserPosts(user.id, language);
                setPosts(data || []);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [user, language]);

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
                        <MessageSquare className="text-indigo-400" /> 
                        {language === 'bn' ? 'আমার ট্রাভেল স্টোরি' : 'My Travel Stories'}
                    </h3>
                    <p className="text-gray-400 text-sm">
                        {language === 'bn' ? 'আপনার প্রকাশিত ব্লগ এবং অভিজ্ঞতা' : 'Your published blogs and experiences'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => navigate('/blog/write')}
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-sm font-bold text-white transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                    >
                        <PenTool size={16} />
                        {language === 'bn' ? 'নতুন স্টোরি লিখুন' : 'Write Story'}
                    </button>
                    <button 
                        onClick={() => navigate('/blog')}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold text-white border border-white/10 transition-all flex items-center gap-2"
                    >
                        {language === 'bn' ? 'সব ব্লগ দেখুন' : 'Read Blogs'}
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-20 bg-black/20 rounded-3xl border border-dashed border-white/10">
                    <MessageSquare size={48} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-gray-400 font-bold">{language === 'bn' ? 'আপনি এখনো কোনো স্টোরি লিখেননি' : 'You haven\'t written any stories yet'}</p>
                    <button 
                        onClick={() => navigate('/blog/write')}
                        className="mt-4 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/20"
                    >
                        {language === 'bn' ? 'আপনার অভিজ্ঞতা শেয়ার করুন' : 'Share your experience'}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white/5 border border-white/10 hover:border-indigo-500/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 transition-all group">
                            
                            <div className="w-full sm:w-48 h-32 rounded-xl bg-gray-900 overflow-hidden shrink-0 relative">
                                {post.cover_image ? (
                                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
                                        <Image size={24} />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md ${post.status === 'published' ? 'bg-emerald-500/80' : 'bg-amber-500/80'}`}>
                                        {post.status}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-lg font-black text-white mb-1 group-hover:text-indigo-400 transition-colors">
                                        {post.title}
                                    </h4>
                                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                                        {post.excerpt || (post.content && post.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...')}
                                    </p>
                                    
                                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500">
                                        <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-lg">
                                            <Eye size={14} className="text-sky-400" />
                                            {post.views || 0}
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-lg">
                                            <Clock size={14} className="text-amber-400" />
                                            {post.reading_time || 3} min
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 sm:mt-0 flex justify-end gap-2">
                                    <button 
                                        onClick={() => navigate(`/blog/edit/${post.slug}`)}
                                        className="text-gray-400 hover:text-white text-sm font-bold flex items-center gap-1 transition-colors px-3 py-1.5 bg-white/5 rounded-lg"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => navigate(`/blog/${post.slug}`)}
                                        className="text-indigo-400 hover:text-white text-sm font-bold flex items-center gap-1 transition-colors px-3 py-1.5 bg-indigo-500/10 rounded-lg"
                                    >
                                        {language === 'bn' ? 'পড়ুন' : 'Read'} <ChevronRight size={16} />
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

export default MyPosts;
