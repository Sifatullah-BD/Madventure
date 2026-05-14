import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Tag } from 'lucide-react';

const BlogCard = ({ post }) => {
    // Format date nicely
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(post.language === 'bn' ? 'bn-BD' : 'en-US', options);
    };

    return (
        <Link to={`/blog/${post.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
            
            {/* Cover Image */}
            <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-200">
                <img 
                    src={post.cover_image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1B5E20] flex items-center gap-1 shadow-sm">
                    <Tag size={12} /> {post.category || 'Travel Guide'}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1B5E20] transition-colors" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                    {post.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
                    {post.excerpt}
                </p>
                
                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100 mt-auto">
                    <span>{formatDate(post.published_at)}</span>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1" title="Reading Time"><Clock size={14} /> {post.reading_time || 3} min</span>
                        <span className="flex items-center gap-1" title="Views"><Eye size={14} /> {post.views || 0}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
