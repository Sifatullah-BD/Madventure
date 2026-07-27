import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, CheckCircle2, Flag, Heart, MessageSquare, Share2, MoreVertical, Loader2 } from 'lucide-react';
import { getThreadDetails, postReply } from '../../services/communityService';
import { useAuth } from '../../hooks/useAuth';
import useRealtime from '../../hooks/useRealtime';

const ThreadDetail = ({ threadId, onBack }) => {
    const { user } = useAuth();
    const [thread, setThread] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasLiked, setHasLiked] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchDetails = useCallback(async () => {
        setLoading(true);
        const data = await getThreadDetails(threadId).catch(() => null);
        if (data) setThread(data);
        setLoading(false);
    }, [threadId]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    // Live reply subscription – appends new replies without a full reload
    useRealtime({
        table: 'forum_replies',
        event: 'INSERT',
        filter: `thread_id=eq.${threadId}`,
        enabled: !!threadId,
        onNew: (newReply) => {
            setThread(prev => {
                if (!prev) return prev;
                // Avoid duplicates (e.g. our own optimistic reply)
                const exists = (prev.replies || []).some(r => r.id === newReply.id);
                if (exists) return prev;
                return { ...prev, replies: [...(prev.replies || []), newReply] };
            });
        },
    });

    const handleReply = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to post a reply.");
            return;
        }
        if (!replyText.trim()) return;
        
        setSubmitting(true);
        try {
            const reply = await postReply(threadId, user.id, replyText);
            // Optimistically add our reply immediately (Realtime will handle dedup)
            setThread(prev => prev ? { ...prev, replies: [...(prev.replies || []), reply] } : prev);
            setReplyText('');
        } catch (err) {
            alert(err.message);
        }
        setSubmitting(false);
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40}/></div>;
    if (!thread) return <div className="p-12 text-center text-gray-500 dark:text-gray-400">থ্রেড পাওয়া যায়নি!</div>;

    const initials = thread.profiles?.full_name ? thread.profiles.full_name.charAt(0) : '?';

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white font-bold mb-6 transition-colors">
                <ArrowLeft size={18} /> ফোরামে ফিরে যান
            </button>

            {/* Original Post */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
                <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#1B5E20] text-white flex items-center justify-center font-bold text-lg pointer-events-none">
                                {initials}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{thread.profiles?.full_name || thread.author || 'Anonymous'}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(thread.created_at || new Date()).toLocaleDateString()} • {new Date(thread.created_at || new Date()).toLocaleTimeString()}</p>
                            </div>
                        </div>
                        <button className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2"><MoreVertical size={20}/></button>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{thread.title}</h1>
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6 whitespace-pre-wrap">{thread.body || thread.content}</p>

                    {/* Metadata & Tags */}
                    <div className="flex flex-wrap items-center gap-3 mb-6 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                        {thread.tags && thread.tags.map(tag => (
                            <span key={tag} className="text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex gap-4">
                            <button 
                                className={`flex items-center gap-2 font-bold transition-colors ${hasLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                            >
                                <Heart size={20} className={hasLiked ? "fill-current" : ""}/> {thread.upvotes || 0}
                            </button>
                            <span className="flex items-center gap-2 font-bold text-gray-500">
                                <MessageSquare size={20}/> {thread.replies?.length || 0}
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <button className="text-gray-500 dark:text-gray-400 hover:text-[#22c55e] font-bold text-sm flex items-center gap-1.5 transition-colors">
                                <Share2 size={16}/> শেয়ার
                            </button>
                            <button className="text-gray-400 dark:text-gray-500 hover:text-red-500 font-bold text-sm flex items-center gap-1.5 transition-colors">
                                <Flag size={16}/> রিপোর্ট
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Replies Section */}
            <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <MessageSquare className="text-primary"/> উত্তরসমূহ ({thread.replies?.length || thread.replyCount || 0})
            </h3>

            <div className="space-y-4 mb-8">
                {thread.replies?.map(reply => (
                    <div key={reply.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-100 text-[#f97316] flex items-center justify-center font-bold text-sm">
                                    {reply.profiles?.full_name ? reply.profiles.full_name.charAt(0) : '?'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                        {reply.profiles?.full_name || 'Anonymous'}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(reply.created_at).toLocaleDateString()} {new Date(reply.created_at).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed md:ml-13">{reply.body}</p>
                        
                        <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between md:ml-13">
                            <button className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">
                                <Heart size={14}/> 0
                            </button>
                        </div>
                    </div>
                ))}
                
                {(!thread.replies || thread.replies.length === 0) && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                        এখনো কেউ উত্তর দেয়নি। আপনিই প্রথম উত্তর দিন!
                    </div>
                )}
            </div>

            {/* Post Reply Box */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h4 className="font-bold text-gray-800 dark:text-white mb-4">আপনার উত্তর লিখুন</h4>
                {!user ? (
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 rounded-xl p-6 text-center">
                        <p className="text-orange-800 dark:text-orange-400 font-bold">উত্তর দিতে বা নতুন পোস্ট করতে আপনাকে লগইন করতে হবে।</p>
                    </div>
                ) : (
                    <form onSubmit={handleReply}>
                        <textarea 
                            rows="4" 
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            placeholder="আপনার অভিজ্ঞতা বা পরামর্শ এখানে শেয়ার করুন..."
                            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-green-50 dark:focus:ring-green-900/30 focus:border-primary outline-none resize-none mb-4 text-gray-900 dark:text-white placeholder-gray-400"
                        ></textarea>
                        <div className="flex justify-end">
                            <button 
                                type="submit" 
                                disabled={submitting || !replyText.trim()}
                                className="bg-[#1B5E20] text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'পোস্ট হচ্ছে...' : 'উত্তর পোস্ট করুন'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ThreadDetail;
