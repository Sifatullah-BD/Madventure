import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Send, Image as ImageIcon, Settings, X, Loader2 } from 'lucide-react';
import { blogService } from '../features/blog/blogService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';

const CATEGORIES = ['Destination Guide', 'Budget Travel', 'Travel Tips', 'News', 'Stories'];

const BlogEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();
    
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showSEO, setShowSEO] = useState(false);

    const [post, setPost] = useState({
        title: '',
        slug: '',
        cover_image: '',
        content: '',
        excerpt: '',
        category: CATEGORIES[0],
        tags: '',
        language: 'bn',
        status: 'draft',
        meta_title: '',
        meta_description: ''
    });

    useEffect(() => {
        if (id) {
            // Load existing post
            const loadPost = async () => {
                setLoading(true);
                try {
                    const data = await blogService.getPostBySlug(id); // assuming id is passed as slug for edit
                    setPost({
                        ...data,
                        tags: data.tags ? data.tags.join(', ') : ''
                    });
                } catch (err) {
                    console.error("Failed to load post for editing", err);
                } finally {
                    setLoading(false);
                }
            };
            loadPost();
        }
    }, [id]);

    const handleTitleChange = (e) => {
        const title = e.target.value;
        // Auto-generate slug from title
        const slug = title.toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
            
        setPost({ ...post, title, slug: post.slug || slug });
    };

    const handleSave = async (statusToSave) => {
        if (!post.title || !post.content) {
            toast.warning('Title and Content are required!');
            return;
        }

        setSaving(true);
        try {
            const tagsArray = post.tags.split(',').map(t => t.trim()).filter(Boolean);
            
            const postData = {
                ...post,
                status: statusToSave,
                tags: tagsArray,
                author_id: user?.id
            };

            await blogService.savePost(postData);
            toast.success(`Post ${statusToSave === 'published' ? 'published' : 'saved'} successfully!`);
            navigate('/blog'); // Redirect to blog list for all users
        } catch (err) {
            console.error("Save error:", err);
            toast.error("Error saving post.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#1B5E20]" size={40} /></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-16 font-sans">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit Post' : 'Create New Post'}</h1>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 font-bold"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => handleSave('draft')}
                            disabled={saving}
                            className="px-4 py-2 text-[#1B5E20] bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 font-bold flex items-center gap-2"
                        >
                            <Save size={16} /> Save Draft
                        </button>
                        <button 
                            onClick={() => handleSave('published')}
                            disabled={saving}
                            className="px-6 py-2 text-white bg-[#1B5E20] rounded-lg hover:bg-[#2E7D32] font-bold flex items-center gap-2"
                        >
                            <Send size={16} /> Publish Now
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Title */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <input
                                type="text"
                                placeholder="Enter post title..."
                                className="w-full text-3xl font-bold text-gray-900 border-none outline-none placeholder-gray-300 bg-transparent"
                                value={post.title}
                                onChange={handleTitleChange}
                            />
                            <div className="mt-2 text-sm text-gray-400 flex items-center">
                                <span className="font-bold mr-2">Slug:</span>
                                <input 
                                    type="text" 
                                    className="border-none outline-none bg-transparent flex-grow text-primary"
                                    value={post.slug}
                                    onChange={(e) => setPost({...post, slug: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Editor (Textarea for simplicity now, ready for React Quill later) */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
                            <textarea
                                placeholder="Write your amazing content here... (Supports basic HTML like <h2>, <b>, <p>)"
                                className="w-full flex-grow text-gray-700 text-lg border-none outline-none resize-none bg-transparent"
                                value={post.content}
                                onChange={(e) => setPost({...post, content: e.target.value})}
                            ></textarea>
                        </div>
                        
                        {/* Excerpt */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Excerpt (Short Summary)</label>
                            <textarea
                                className="w-full text-gray-700 border border-gray-200 rounded-lg p-3 outline-none focus:border-[#1B5E20] resize-none"
                                rows="3"
                                value={post.excerpt}
                                onChange={(e) => setPost({...post, excerpt: e.target.value})}
                            ></textarea>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        
                        {/* Settings */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Settings size={18}/> Settings</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Language</label>
                                    <select 
                                        className="w-full border border-gray-200 rounded-lg p-2 outline-none focus:border-[#1B5E20]"
                                        value={post.language}
                                        onChange={(e) => setPost({...post, language: e.target.value})}
                                    >
                                        <option value="bn">বাংলা (Bengali)</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                                    <select 
                                        className="w-full border border-gray-200 rounded-lg p-2 outline-none focus:border-[#1B5E20]"
                                        value={post.category}
                                        onChange={(e) => setPost({...post, category: e.target.value})}
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Tags (Comma separated)</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-200 rounded-lg p-2 outline-none focus:border-[#1B5E20]"
                                        placeholder="coxs-bazar, budget, beach"
                                        value={post.tags}
                                        onChange={(e) => setPost({...post, tags: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cover Image */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><ImageIcon size={18}/> Cover Image</h3>
                            
                            {post.cover_image ? (
                                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                                    <img src={post.cover_image} alt="Cover" className="w-full h-32 object-cover" />
                                    <button 
                                        onClick={() => setPost({...post, cover_image: ''})}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Image URL</label>
                                    <input 
                                        type="url" 
                                        className="w-full border border-gray-200 rounded-lg p-2 outline-none focus:border-[#1B5E20]"
                                        placeholder="https://images.unsplash.com/..."
                                        value={post.cover_image}
                                        onChange={(e) => setPost({...post, cover_image: e.target.value})}
                                    />
                                    <p className="text-[10px] text-gray-400 mt-2">* Currently using external URLs. Supabase Storage integration coming soon.</p>
                                </div>
                            )}
                        </div>

                        {/* SEO Options */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <button 
                                onClick={() => setShowSEO(!showSEO)}
                                className="w-full flex justify-between items-center font-bold text-gray-900"
                            >
                                SEO Settings
                                <span className="text-gray-400">{showSEO ? '▲' : '▼'}</span>
                            </button>
                            
                            {showSEO && (
                                <div className="mt-4 space-y-4 animate-fade-in">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Meta Title (Max 60 chars)</label>
                                        <input 
                                            type="text" 
                                            className="w-full border border-gray-200 rounded-lg p-2 outline-none focus:border-[#1B5E20]"
                                            value={post.meta_title}
                                            onChange={(e) => setPost({...post, meta_title: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Meta Description (Max 160 chars)</label>
                                        <textarea 
                                            className="w-full border border-gray-200 rounded-lg p-2 outline-none focus:border-[#1B5E20] resize-none"
                                            rows="3"
                                            value={post.meta_description}
                                            onChange={(e) => setPost({...post, meta_description: e.target.value})}
                                        ></textarea>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogEditor;
