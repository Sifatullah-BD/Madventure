import React, { useState, useEffect, useRef } from 'react';
import districtsData from '../../data/districts_list.json';
import ThreadCard from './ThreadCard';
import { Search, Filter, MessageSquarePlus, X, Loader2 } from 'lucide-react';
import { getForumThreads, createThread } from '../../services/communityService';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import useRealtime from '../../hooks/useRealtime';
import { useToast } from '../ui/Toast';

const CATEGORIES = [
    { id: 'all', label: 'সব' },
    { id: 'question', label: 'প্রশ্ন' },
    { id: 'tips', label: 'টিপস' },
    { id: 'review', label: 'রিভিউ' },
    { id: 'alert', label: 'সতর্কতা' }
];

const Forum = ({ onSelectThread, onLoginRequired }) => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const toast = useToast();
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [districtId, setDistrictId] = useState('');
    const [districtSearch, setDistrictSearch] = useState('');
    const [sortStrategy, setSortStrategy] = useState('recent');
    const [showNewThreadModal, setShowNewThreadModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form states
    const [newThreadData, setNewThreadData] = useState({ title: '', category: 'question', content: '', tags: '' });

    const mountedRef = useRef(true);
    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    const fetchThreads = async () => {

        setLoading(true);
        try {
            const data = await getForumThreads();
            if (mountedRef.current && data) setThreads(data);
        } catch (e) {
            console.warn('fetchThreads error', e);
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchThreads();
    }, []);

    // Live feed: new threads appear at the top instantly
    useRealtime({
        table: 'forum_threads',
        event: 'INSERT',
        onNew: (newThread) => {
            setThreads(prev => {
                const exists = prev.some(t => t.id === newThread.id);
                if (exists) return prev;
                return [newThread, ...prev];
            });
        },
    });

    const handleCreateThread = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.warning("Please login to post a thread.");
            return;
        }
        setSubmitting(true);
        const tagsArray = newThreadData.tags.split(',').map(t => t.trim()).filter(t => t);
        if (newThreadData.category !== 'all') tagsArray.push(newThreadData.category);
        
        try {
            await createThread(user.id, newThreadData.title, newThreadData.content, tagsArray);
            setShowNewThreadModal(false);
            setNewThreadData({ title: '', category: 'question', content: '', tags: '' });
            // Realtime will push new thread, but also refresh to get profile join
            fetchThreads();
            toast.success("Thread posted successfully!");
        } catch (error) {
            toast.error(error.message);
        }
        setSubmitting(false);
    };

    // Filter threads
    let filteredThreads = threads.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                              t.body.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === 'all' || (t.tags && t.tags.includes(category));
        // Add district match if district_id is in DB (optional enhancement)
        return matchesSearch && matchesCategory;
    });

    // Sort threads
    if (sortStrategy === 'recent') {
        filteredThreads.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortStrategy === 'popular') {
        filteredThreads.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    }

    // Filter districts for sidebar
    const ALL_DISTRICTS = districtsData.districts || [];
    const filteredDistricts = ALL_DISTRICTS.filter(d => 
        d.name.toLowerCase().includes(districtSearch.toLowerCase()) || 
        d.bn_name.includes(districtSearch)
    );

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 relative min-h-screen">
            {/* Header & Categories */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{language === 'bn' ? 'ট্রাভেলার ফোরাম' : 'Traveler Forum'}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{language === 'bn' ? 'আপনার প্রশ্ন করুন, অভিজ্ঞতা শেয়ার করুন এবং কমিউনিটির সাহায্য নিন।' : 'Ask questions, share experiences, and get help from the community.'}</p>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                    {CATEGORIES.map(c => (
                        <button 
                            key={c.id} 
                            onClick={() => setCategory(c.id)}
                            className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${category === c.id ? 'bg-[#1B5E20] text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content Area */}
                <div className="flex-1">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text"
                                placeholder={language === 'bn' ? "ফোরামে খুঁজুন..." : "Search in forum..."}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-green-50 dark:focus:ring-green-900/30 text-gray-900 dark:text-white placeholder-gray-400"
                            />
                        </div>
                        <select 
                            value={sortStrategy}
                            onChange={(e) => setSortStrategy(e.target.value)}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg outline-none font-medium text-gray-700 dark:text-gray-300 focus:border-primary"
                        >
                            <option value="recent">{language === 'bn' ? 'সাম্প্রতিক' : 'Recent'}</option>
                            <option value="popular">{language === 'bn' ? 'জনপ্রিয়' : 'Popular'}</option>
                        </select>
                    </div>

                    {/* Threads */}
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40}/></div>
                    ) : (
                        <div className="space-y-4">
                            {filteredThreads.map(thread => (
                                <ThreadCard 
                                    key={thread.id} 
                                    thread={{
                                        ...thread,
                                        author: thread.profiles?.full_name || 'Anonymous',
                                        avatar: thread.profiles?.avatar_url,
                                        createdAt: thread.created_at,
                                        content: thread.body,
                                        likes: thread.upvotes || 0,
                                        replyCount: 0 // Fetching replies separately in detail
                                    }} 
                                onClick={onSelectThread} 
                                    onLoginRequired={onLoginRequired}
                                />
                            ))}
                            {filteredThreads.length === 0 && (
                                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">{language === 'bn' ? 'কোন থ্রেড পাওয়া যায়নি।' : 'No threads found.'}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar Filter */}
                <div className="w-full lg:w-72">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm sticky top-6">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2"><Filter size={18}/> {language === 'bn' ? 'গন্তব্য ফিল্টার' : 'Destination Filter'}</h3>
                        
                        <div className="mb-4 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input 
                                type="text"
                                placeholder={language === 'bn' ? "জেলা খুঁজুন..." : "Search district..."}
                                value={districtSearch}
                                onChange={e => setDistrictSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-primary text-gray-900 dark:text-white"
                            />
                        </div>

                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            <button 
                                onClick={() => setDistrictId('')}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${districtId === '' ? 'bg-green-50 dark:bg-green-900/30 text-primary dark:text-green-400' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                            >
                                {language === 'bn' ? 'সব জেলা' : 'All Districts'}
                            </button>
                            {filteredDistricts.map(d => (
                                <button 
                                    key={d.id}
                                    onClick={() => setDistrictId(d.id)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${districtId === d.id ? 'bg-green-50 dark:bg-green-900/30 text-primary dark:text-green-400' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                                >
                                    {language === 'bn' ? d.bn_name : d.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <button 
                onClick={() => setShowNewThreadModal(true)}
                className="fixed bottom-8 right-8 bg-[#f97316] text-white p-4 rounded-full shadow-lg shadow-orange-500/30 hover:bg-orange-600 hover:scale-105 transition-all z-40 group"
            >
                <MessageSquarePlus size={24} />
                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 w-max bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    নতুন প্রশ্ন করুন
                </span>
            </button>

            {/* New Thread Modal */}
            {showNewThreadModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">নতুন থ্রেড শুরু করুন</h2>
                            <button onClick={() => setShowNewThreadModal(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"><X size={20}/></button>
                        </div>
                        {!user ? (
                            <div className="p-8 text-center bg-orange-50 dark:bg-orange-900/20">
                                <h3 className="text-xl font-bold text-orange-800 dark:text-orange-400 mb-2">লগইন প্রয়োজন</h3>
                                <p className="text-orange-700 dark:text-orange-300 mb-6">ফোরামে নতুন প্রশ্ন করতে বা অভিজ্ঞতা শেয়ার করতে আপনাকে লগইন করতে হবে।</p>
                                <button onClick={() => setShowNewThreadModal(false)} className="px-6 py-2 bg-[#1B5E20] text-white rounded-lg font-bold shadow-md hover:bg-green-800 transition-colors">
                                    ঠিক আছে
                                </button>
                            </div>
                        ) : (
                            <form className="p-6 space-y-5" onSubmit={handleCreateThread}>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">শিরোনাম <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={newThreadData.title}
                                        onChange={e => setNewThreadData({...newThreadData, title: e.target.value})}
                                        className="w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary px-4 py-2 border outline-none text-gray-900 dark:text-white" 
                                        placeholder="আপনার প্রশ্ন বা টিপসের মূল কথা..." 
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">ক্যাটাগরি <span className="text-red-500">*</span></label>
                                        <select 
                                            value={newThreadData.category}
                                            onChange={e => setNewThreadData({...newThreadData, category: e.target.value})}
                                            className="w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary px-4 py-2 border outline-none text-gray-900 dark:text-white"
                                        >
                                            {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">বিস্তারিত <span className="text-red-500">*</span></label>
                                    <textarea 
                                        required 
                                        rows="6" 
                                        value={newThreadData.content}
                                        onChange={e => setNewThreadData({...newThreadData, content: e.target.value})}
                                        className="w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary px-4 py-3 border outline-none resize-none text-gray-900 dark:text-white" 
                                        placeholder="বিস্তারিত লিখুন..."
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">ট্যাগস (কমা দিয়ে আলাদা করুন)</label>
                                    <input 
                                        type="text" 
                                        value={newThreadData.tags}
                                        onChange={e => setNewThreadData({...newThreadData, tags: e.target.value})}
                                        className="w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary px-4 py-2 border outline-none text-gray-900 dark:text-white" 
                                        placeholder="যেমন: কক্সবাজার, বাজেট ট্রিপ, বর্ষাকাল" 
                                    />
                                </div>
                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowNewThreadModal(false)} className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">বাতিল</button>
                                    <button type="submit" disabled={submitting} className="px-6 py-2 bg-[#1B5E20] hover:bg-green-800 text-white rounded-lg font-bold shadow-md disabled:opacity-50">
                                        {submitting ? 'পোস্ট হচ্ছে...' : 'পোস্ট করুন'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Forum;
