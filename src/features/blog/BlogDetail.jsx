import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, Eye, Share2, Facebook, Twitter, Link as LinkIcon, User, Heart, Plane } from 'lucide-react';
import { blogService } from './blogService';
import BlogCard from './BlogCard';
import { useToast } from '../../components/ui/Toast';

const BlogDetail = ({ user, onOpenLogin }) => {
    const { slug } = useParams();
    const toast = useToast();
    
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const data = await blogService.getPostBySlug(slug);
                setPost(data);
                
                // Fetch related posts
                if (data && data.category) {
                    const related = await blogService.getRelatedPosts(data.id, data.category);
                    setRelatedPosts(related);
                }
                
                // Set mock likes for UI demonstration
                setLikes(Math.floor(Math.random() * 100) + 10);
            } catch (error) {
                console.error("Failed to load post:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
        window.scrollTo(0, 0);
    }, [slug]);

    const handleShare = (platform) => {
        const url = window.location.href;
        const title = post?.title || 'Madventure Blog';
        
        switch(platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
                break;
            case 'whatsapp':
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                break;
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B5E20]"></div></div>;
    }

    if (!post) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><h1 className="text-2xl font-bold">Post not found!</h1></div>;
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(post.language === 'bn' ? 'bn-BD' : 'en-US', options);
    };

    const canUseAsPlan = /itinerary|ভ্রমণসূচি|travel plan/i.test(`${post.category || ''} ${post.title || ''} ${post.content || ''}`);

    return (
        <div className="bg-white min-h-screen pt-20 pb-16 font-sans">
            {/* SEO Metadata */}
            <Helmet>
                <title>{post.meta_title || post.title} | Madventure</title>
                <meta name="description" content={post.meta_description || post.excerpt} />
                <meta property="og:title" content={post.meta_title || post.title} />
                <meta property="og:description" content={post.meta_description || post.excerpt} />
                <meta property="og:image" content={post.cover_image} />
                <meta property="og:type" content="article" />
                <meta property="article:published_time" content={post.published_at} />
                <link rel="canonical" href={window.location.href} />
            </Helmet>

            {/* Hero Image */}
            <div className="w-full h-[40vh] md:h-[60vh] relative bg-gray-900">
                <img 
                    src={post.cover_image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1'} 
                    alt={post.title} 
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-4xl mx-auto right-0">
                    <span className="inline-block bg-[#1B5E20] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                        {post.category}
                    </span>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-md" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-200 text-sm">
                        <span className="flex items-center gap-1"><User size={16} /> {post.author?.first_name || 'Admin'}</span>
                        <span>•</span>
                        <span>{formatDate(post.published_at)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock size={16} /> {post.reading_time || 5} min read</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Eye size={16} /> {post.views} views</span>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-12">
                
                {/* Main Article */}
                <article className="lg:w-3/4 prose prose-lg md:prose-xl prose-green max-w-none prose-img:rounded-xl prose-headings:font-bold prose-a:text-[#1B5E20]" style={{ fontFamily: post.language === 'bn' ? "'Hind Siliguri', sans-serif" : "Inter, sans-serif" }}>
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />

                    {canUseAsPlan && (
                        <Link to={`/tour-plans?destination=${encodeURIComponent(post.title)}`} className="mt-8 flex items-center gap-3 rounded-2xl bg-[#1B5E20] p-5 text-white hover:bg-green-800 transition-colors">
                            <Plane size={21} />
                            <span><strong className="block">Use This Plan</strong><span className="text-sm text-white/75">Start a trip plan from this guide.</span></span>
                        </Link>
                    )}
                    
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-100">
                            <span className="font-bold mr-2 text-gray-700">Tags:</span>
                            {post.tags.map(tag => (
                                <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </article>

                {/* Sidebar */}
                <aside className="lg:w-1/4 space-y-6">
                    {/* Reaction Widget */}
                    <div className="sticky top-28 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Heart size={18} /> React to this post
                        </h3>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => {
                                    if (!user && onOpenLogin) {
                                        onOpenLogin();
                                    } else {
                                        if (liked) {
                                            setLiked(false);
                                            setLikes(prev => prev - 1);
                                            toast?.success?.('Like removed');
                                        } else {
                                            setLiked(true);
                                            setLikes(prev => prev + 1);
                                            toast?.success?.('Post Liked! ❤️');
                                        }
                                    }
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors ${liked ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-white border border-gray-200 text-gray-600 hover:text-red-500 hover:border-red-200'}`}
                            >
                                <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                                <span>{likes} {liked ? 'Liked' : 'Like'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Share Widget */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Share2 size={18} /> Share this guide
                        </h3>
                        <div className="flex gap-3">
                            <button onClick={() => handleShare('facebook')} className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition">
                                <Facebook size={18} />
                            </button>
                            <button onClick={() => handleShare('twitter')} className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition">
                                <Twitter size={18} />
                            </button>
                            <button onClick={() => handleShare('whatsapp')} className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            </button>
                            <button onClick={() => handleShare('copy')} className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition relative">
                                {copied && <span className="absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded">Copied!</span>}
                                <LinkIcon size={18} />
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>আরও পড়ুন</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedPosts.map(relPost => (
                            <BlogCard key={relPost.id} post={relPost} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogDetail;
