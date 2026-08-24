import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO';
import BlogCard from './BlogCard';
import { blogService } from './blogService';
import { Search, Loader, PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Destination Guide', 'Budget Travel', 'Travel Tips', 'News'];

const BlogList = ({ user, onOpenLogin }) => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const currentLang = i18n.language === 'en' ? 'en' : 'bn';
    
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                let data = [];
                if (activeCategory === 'All') {
                    data = await blogService.getPublishedPosts(currentLang);
                } else {
                    data = await blogService.getPostsByCategory(activeCategory, currentLang);
                }
                setPosts(data || []);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [activeCategory, currentLang]);

    // Simple client-side search
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <SEO 
                title="Travel Blog & Guides | Madventure"
                description="Read expert travel guides, budget tips, and destination reviews for Bangladesh."
            />
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header & Search */}
                <div className="text-center mb-12">
                    <div className="flex flex-col items-center justify-center gap-4 mb-6">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 drop-shadow-sm" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                            ট্রাভেল ব্লগ ও গাইড
                        </h1>
                        <button 
                            onClick={() => {
                                if (!user && onOpenLogin) {
                                    onOpenLogin();
                                } else {
                                    navigate('/blog/write');
                                }
                            }}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1B5E20] text-white rounded-full font-bold shadow-lg shadow-[#1B5E20]/20 hover:bg-green-700 transition-all group"
                        >
                            <PenTool size={18} className="group-hover:rotate-12 transition-transform" />
                            আপনার ভ্রমণ গল্প লিখুন
                        </button>
                    </div>
                    
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
                        ভ্রমণ কাহিনী, টিপস, এবং বাজেট গাইড — আপনার পরবর্তী ট্যুরের জন্য দরকারি সব তথ্য।
                    </p>
                    
                    <div className="max-w-xl mx-auto relative">
                        <input 
                            type="text" 
                            placeholder="যেমন: সাজেক, সেন্টমার্টিন, বাজেট..."
                            className="w-full bg-white border border-gray-200 rounded-full py-4 pl-12 pr-6 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/50 focus:border-transparent transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                                activeCategory === cat 
                                ? 'bg-[#1B5E20] text-white shadow-md scale-105' 
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Posts Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader className="animate-spin text-[#1B5E20]" size={40} />
                    </div>
                ) : filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map(post => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <p className="text-gray-500 text-lg">দুঃখিত, কোনো পোস্ট পাওয়া যায়নি।</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList;
