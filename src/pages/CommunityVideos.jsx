import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Video, Upload } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import { buildVideoMeta } from '../services/videoProviderService';
import { createCommunityPost, listCommunityPosts } from '../services/communityService';
import { useAuth } from '../hooks/useAuth';

export default function CommunityVideos() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [query, setQuery] = useState('');
    const [form, setForm] = useState({ title: '', content: '', destination_text: '', source_url: '' });
    const [message, setMessage] = useState('');
    const [publishing, setPublishing] = useState(false);
    const load = useCallback(() => listCommunityPosts({ type: 'VIDEO', query }).then(setPosts).catch(error => { setPosts([]); setMessage(error.message); }), [query]);
    useEffect(() => { load(); }, [load]);
    const publish = async event => {
        event.preventDefault();
        if (publishing) return;
        setMessage('');
        setPublishing(true);
        try {
            const meta = buildVideoMeta(form.source_url);
            await createCommunityPost({ post_type: 'VIDEO', title: form.title.trim(), content: form.content.trim() || null, destination_text: form.destination_text.trim() || null, visibility: 'public', ...meta });
            setForm({ title: '', content: '', destination_text: '', source_url: '' }); setMessage('Video published.'); load();
        } catch (error) { setMessage(error.message); }
        finally { setPublishing(false); }
    };
    return <div className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-gray-950 dark:text-white"><div className="mx-auto max-w-6xl"><div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-black">Community Videos</h1><p className="text-sm text-gray-500 dark:text-gray-400">Share verified YouTube and BiliBili links with travelers.</p></div><Link to="/community" className="font-bold text-primary">Back to community</Link></div><div className="grid gap-6 lg:grid-cols-[320px_1fr]"><form onSubmit={publish} className="h-fit space-y-3 rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center gap-2 font-bold"><Upload size={18} className="text-primary" /> Share a video</div><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full rounded-xl bg-gray-50 p-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400" /><input required type="url" value={form.source_url} onChange={e => setForm({ ...form, source_url: e.target.value })} placeholder="YouTube or BiliBili URL" className="w-full rounded-xl bg-gray-50 p-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400" /><input value={form.destination_text} onChange={e => setForm({ ...form, destination_text: e.target.value })} placeholder="Location tag" className="w-full rounded-xl bg-gray-50 p-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400" /><textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Description" rows={3} className="w-full rounded-xl bg-gray-50 p-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400" /><button type="submit" disabled={!user || publishing} className="w-full rounded-xl bg-primary py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{publishing ? 'Publishing...' : user ? 'Publish video' : 'Log in to publish'}</button>{message && <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>}</form><main><div className="relative mb-5"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search video posts..." className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-gray-900 outline-none placeholder:text-gray-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-400" /></div>{posts.length ? <div className="grid gap-5 md:grid-cols-2">{posts.map(post => <article key={post.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900"><VideoPlayer post={post} /><div className="p-4"><h2 className="font-bold">{post.title}</h2>{post.destination_text && <p className="mt-1 text-xs text-primary">{post.destination_text}</p>}{post.content && <p className="mt-2 line-clamp-3 text-sm text-gray-500 dark:text-gray-400">{post.content}</p>}</div></article>)}</div> : <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-500 dark:border-slate-700 dark:text-gray-400"><Video className="mx-auto mb-3" /><p>No community videos yet.</p><p className="mt-2 text-xs">Run <code>08_community_video_posts.sql</code> in Supabase to enable publishing.</p></div>}</main></div></div></div>;
}