import React, { useEffect, useState } from 'react';
import { CheckCircle, Star, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { hasAdminAccess } from '../../utils/appRole';

export default function AdminBlog() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const load = () => supabase.from('blog_posts').select('*').order('created_at', { ascending: false }).then(({ data }) => setPosts(data || []));
    useEffect(() => { if (hasAdminAccess(user)) load(); }, [user]);
    const update = async (id, patch) => { await supabase.from('blog_posts').update(patch).eq('id', id); load(); };
    if (!hasAdminAccess(user)) return <div className="p-10 text-center">Access denied.</div>;
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8"><div className="mx-auto max-w-5xl"><h1 className="mb-6 text-2xl font-black">Blog Admin</h1><div className="space-y-3">{posts.map(post => <div key={post.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><div className="min-w-[220px] flex-1"><p className="font-bold">{post.title}</p><p className="text-xs text-gray-500">{post.status} · {post.category || 'Uncategorized'}</p></div><button onClick={() => update(post.id, { is_featured: !post.is_featured })} title="Feature" className={`p-2 ${post.is_featured ? 'text-yellow-500' : 'text-gray-400'}`}><Star size={18} fill={post.is_featured ? 'currentColor' : 'none'} /></button>{post.status !== 'published' && <button onClick={() => update(post.id, { status: 'published', published_at: new Date().toISOString() })} title="Approve and publish" className="p-2 text-green-600"><CheckCircle size={18} /></button>}{post.status !== 'rejected' && post.status !== 'published' && <button onClick={() => update(post.id, { status: 'rejected', rejection_reason: 'Please revise this article.' })} title="Reject" className="p-2 text-red-500"><XCircle size={18} /></button>}</div>)}</div></div></div>;
}