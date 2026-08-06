import React from 'react';
import ReactionPicker from './ReactionPicker';
import { useAuth } from '../../hooks/useAuth';
import { Heart, MessageSquare, Share2, Bookmark, MapPin, MoreHorizontal } from 'lucide-react';

const PostCard = ({ post, onLike, onComment, onShare, onSave }) => {
    const { user, avatar, location, time, content, image, likes, comments, type, isLiked, isSaved } = post;

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden mb-6 border border-gray-100">
            {/* Header */}
            <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                        {avatar.length > 2 ? (
                            <img src={avatar} alt={user} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-lg font-bold text-gray-600">{avatar}</span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-base">{user}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            {location && (
                                <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-medium">
                                    <MapPin size={10} /> {location}
                                </span>
                            )}
                            <span>•</span>
                            <span>{time}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {type && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase tracking-wide">
                            {type}
                        </span>
                    )}
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="px-5 pb-3">
                <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                    {content}
                </p>
            </div>

            {/* Image */}
            {image && (
                <div className="w-full h-80 overflow-hidden cursor-pointer group">
                    <img
                        src={image}
                        alt="Post content"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
            )}

            {/* Footer / Actions */}
            <div className="px-5 py-4 flex items-center justify-between border-t border-gray-50 bg-gray-50/50">
                <div className="flex items-center gap-6">
                    <ReactionPicker
                        postId={post.id}
                        userId={user?.id}
                        currentReactions={post.reactions || []}
                        setReactions={(newReactions) => {
                          // Optimistic UI: could update local state or refetch post
                          // For now, no‑op as likes count is handled elsewhere
                        }}
                    />

                    <button
                        onClick={() => onComment(post.id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-all group"
                    >
                        <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                            <MessageSquare size={20} />
                        </div>
                        <span className="font-bold text-sm">{comments?.length || 0}</span>
                    </button>

                    <button
                        onClick={() => onShare(post.id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-all group"
                    >
                        <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                            <Share2 size={20} />
                        </div>
                    </button>
                </div>

                <button
                    onClick={() => onSave(post.id)}
                    className={`flex items-center gap-2 transition-all group ${isSaved ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                >
                    <div className={`p-2 rounded-full group-hover:bg-yellow-50 transition-colors ${isSaved ? 'bg-yellow-50' : ''}`}>
                        <Bookmark size={20} className={isSaved ? 'fill-current' : ''} />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default PostCard;
