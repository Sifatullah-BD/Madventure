import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, PenLine, Send } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const TABS = ['draft', 'review', 'published', 'rejected'];
export default function MyArticles() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [tab, setTab] = useState('draft');
    useEffect(() => { if (!user?.id) return; supabase.from('blog_posts').select('*').eq('author_id', user.id).order('updated_at', { ascending: false }).then(({ data }) => setPosts(data || [])); }, [user?.id]);
    const filtered = posts.filter(post => post.status === tab);
    if (!user) return <div className="p-10 text-center">Log in to manage your articles.</div>;
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8"><div className="mx-auto max-w-5xl"><div className="mb-6 flex items-center justify-between"><div><h1 className="text-2xl font-black">My Articles</h1><p className="text-sm text-gray-500">Drafts, submissions and published stories</p></div><Link to="/blog/write" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-bold text-white"><PenLine size={16} /> Write</Link></div><div className="mb-5 flex gap-2 overflow-x-auto">{TABS.map(key => <button key={key} onClick={() => setTab(key)} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === key ? 'bg-primary text-white' : 'border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>{key} ({posts.filter(post => post.status === key).length})</button>)}</div>{filtered.length ? <div className="space-y-3">{filtered.map(post => <div key={post.id} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><FileText className="text-primary" /><div className="min-w-0 flex-1"><p className="truncate font-bold">{post.title}</p><p className="text-xs text-gray-500">{post.category || 'Uncategorized'} · {post.status}</p></div>{post.status === 'draft' && <Link to={`/blog/edit/${post.id}`} className="p-2 text-primary" title="Submit or edit"><Send size={16} /></Link>}</div>)}</div> : <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-500">No {tab} articles yet.</div>}</div></div>;
}