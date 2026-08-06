import React, { useState, useRef } from 'react';
import { X, Image, MapPin, Smile, Send, Tag } from 'lucide-react';

const CreatePostModal = ({ isOpen, onClose, onSubmit, user }) => {
    const [content, setContent] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('General');
    const [image, setImage] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!content.trim()) return;

        const newPost = {
            content,
            location,
            category,
            image,
            timestamp: new Date().toISOString()
        };

        onSubmit(newPost);
        // Reset form
        setContent('');
        setLocation('');
        setCategory('General');
        setImage(null);
        onClose();
    };

    const categories = ['General', 'Help Needed', 'Review', 'Travel Buddies', 'Hidden Gem'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800">Create New Post</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="flex gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border border-gray-100">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">
                                    {user?.name?.[0] || 'U'}
                                </div>
                            )}
                        </div>
                        <div className="flex-grow">
                            <textarea
                                placeholder={`What's on your mind, ${user?.name || 'Traveler'}?`}
                                className="w-full min-h-[120px] resize-none outline-none text-gray-700 placeholder-gray-400 text-lg"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Image Preview */}
                    {image && (
                        <div className="relative mb-4 rounded-xl overflow-hidden group">
                            <img src={image} alt="Preview" className="w-full h-48 object-cover" />
                            <button
                                onClick={() => setImage(null)}
                                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {/* Tools */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${category === cat ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-1">
                                <button className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors" title="Add Photo">
                                    <Image size={20} />
                                </button>
                                <button className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Add Location">
                                    <MapPin size={20} />
                                </button>
                                <button className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors" title="Add Feeling">
                                    <Smile size={20} />
                                </button>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={!content.trim()}
                                className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${content.trim() ? 'bg-primary text-white hover:bg-green-700 shadow-md hover:shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                                Post <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;
