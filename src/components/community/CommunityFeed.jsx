// src/components/community/CommunityFeed.jsx
import React, { useEffect, useState, useCallback } from 'react';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import { Search, Filter, PenSquare } from 'lucide-react';
import useRealtime from '../../hooks/useRealtime';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../ui/Toast';

const CATEGORIES = ['All', 'General', 'Help Needed', 'Review', 'Travel Buddies', 'Hidden Gem'];

const CommunityFeed = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load posts from Supabase
  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('community_posts')
        .select('*, profiles(full_name, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(20);

      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      if (search) {
        query = query.ilike('content', `%${search}%`);
      }

      const { data } = await query;

      // Fallback mock posts if no DB data
      if (!data || data.length === 0) {
        setPosts([
          {
            id: 1,
            user: 'Rana Ahmed',
            avatar: 'RA',
            location: 'Sajek Valley',
            time: '২ ঘণ্টা আগে',
            content: 'সাজেক ভ্যালিতে এসে আমি অবাক হয়ে গেছি! মেঘের ভেতর দিয়ে হেঁটে যাচ্ছি মনে হচ্ছিল। সবাইকে অবশ্যই একবার আসতে হবে! 🏔️',
            image: '/images/destinations_hero_1_1778975470949.png',
            likes: 42,
            comments: [],
            type: 'Review',
            isLiked: false,
            isSaved: false,
            reactions: []
          },
          {
            id: 2,
            user: 'Fatima Khanam',
            avatar: 'FK',
            location: "Cox's Bazar",
            time: '৫ ঘণ্টা আগে',
            content: "কক্সবাজারে এখন অনেক ভিড়। সকাল ৬টায় সূর্যোদয় দেখতে গেলে একটু শান্তি পাবেন। আমার অভিজ্ঞতা শেয়ার করলাম। 🌅",
            image: null,
            likes: 28,
            comments: [],
            type: 'Tips',
            isLiked: false,
            isSaved: false,
            reactions: []
          }
        ]);
      } else {
        setPosts(data.map(p => ({
          ...p,
          user: p.profiles?.full_name || 'Anonymous',
          avatar: p.profiles?.avatar_url || p.profiles?.full_name?.charAt(0) || 'U',
          time: new Date(p.created_at).toLocaleDateString('bn-BD'),
          likes: p.likes_count || 0,
          comments: [],
          isLiked: false,
          isSaved: false,
          reactions: p.reactions || []
        })));
      }
    } catch (err) {
      console.warn('CommunityFeed: failed to load posts', err);
    }
    setLoading(false);
  }, [category, search]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Realtime: new post appears at top
  useRealtime({
    table: 'community_posts',
    event: 'INSERT',
    onNew: (newPost) => {
      setPosts(prev => {
        const exists = prev.some(p => p.id === newPost.id);
        if (exists) return prev;
        return [{ ...newPost, user: 'New User', avatar: 'U', time: 'এইমাত্র', likes: 0, comments: [], isLiked: false, isSaved: false, reactions: [] }, ...prev];
      });
    }
  });

  const handleCreatePost = async (postData) => {
    if (!user) { toast?.warning?.('পোস্ট করতে লগইন করুন!'); return; }
    try {
      const { error } = await supabase.from('community_posts').insert([{
        user_id: user.id,
        content: postData.content,
        category: postData.category,
        location: postData.location || null,
        created_at: new Date().toISOString()
      }]);
      if (!error) {
        toast?.success?.('পোস্ট সফল! 🎉');
        loadPosts();
      }
    } catch (err) {
      toast?.error?.('পোস্ট করতে সমস্যা হয়েছে।');
    }
  };

  const handleLike = (postId) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const handleSave = (postId) => {
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, isSaved: !p.isSaved } : p
    ));
    toast?.success?.('সংরক্ষিত হয়েছে! 🔖');
  };

  const handleShare = (postId) => {
    const url = `${window.location.origin}/community?postId=${postId}`;
    navigator.clipboard?.writeText(url);
    toast?.success?.('লিংক কপি হয়েছে! 🔗');
  };

  const handleComment = (postId) => {
    // Opens community/forum thread page
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      {/* Create Post Button */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
            {user ? (user.email?.charAt(0).toUpperCase() || 'U') : '👋'}
          </div>
          <button
            onClick={() => user ? setShowCreateModal(true) : toast?.info?.('লগইন করুন')}
            className="flex-1 text-left bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3 text-sm text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700"
          >
            আপনার ভ্রমণ অভিজ্ঞতা শেয়ার করুন...
          </button>
          <button
            onClick={() => user ? setShowCreateModal(true) : toast?.info?.('লগইন করুন')}
            className="p-2 bg-primary text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <PenSquare size={18} />
          </button>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="পোস্ট খুঁজুন..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              category === cat
                ? 'bg-primary text-white border-primary'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-400">লোড হচ্ছে...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            কোনো পোস্ট নেই। প্রথম পোস্ট করুন! ✍️
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onSave={handleSave}
            />
          ))
        )}
      </div>

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePost}
        user={user ? { name: user.email, avatar: user.email?.charAt(0).toUpperCase() } : null}
      />
    </div>
  );
};

export default CommunityFeed;
