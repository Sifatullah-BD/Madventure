import React, { useEffect, useState } from 'react';
import { Eye, Save, Send, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { blogService } from '../features/blog/blogService';
import BlockEditor from '../components/blog/BlockEditor';

const slugify = value => (value || '').toLowerCase().trim().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-').replace(/(^-|-$)/g, '');
const renderBlocks = blocks => blocks.map(block => {
    if (block.type === 'heading') return `<h2>${block.text || ''}</h2>`;
    if (block.type === 'quote') return `<blockquote>${block.text || ''}</blockquote>`;
    if (block.type === 'image') return block.url ? `<figure><img src="${block.url}" alt="${block.caption || ''}" />${block.caption ? `<figcaption>${block.caption}</figcaption>` : ''}</figure>` : '';
    if (block.type === 'list') { const tag = block.ordered ? 'ol' : 'ul'; return `<${tag}>${(block.items || []).map(item => `<li>${item}</li>`).join('')}</${tag}>`; }
    return `<p>${block.text || ''}</p>`;
}).join('');

export default function ArticleEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState({ title: '', slug: '', excerpt: '', category: 'Destination Guide', language: 'bn', cover_image: '' });
    const [blocks, setBlocks] = useState([]);
    const [preview, setPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => { if (id) blogService.getPostById(id).then(data => { setPost(data); setBlocks(data.content_blocks || []); }).catch(() => setMessage('Unable to load this article.')); }, [id]);
    const update = (key, value) => setPost(current => ({ ...current, [key]: value }));
    const save = async status => {
        if (!post.title.trim() || !blocks.length) return setMessage('Add a title and at least one content block.');
        setSaving(true); setMessage('');
        try {
            const result = await blogService.savePost({ ...post, title: post.title.trim(), slug: post.slug || slugify(post.title), content: renderBlocks(blocks), status, author_id: user?.id, reading_time: Math.max(1, Math.ceil(JSON.stringify(blocks).split(/\s+/).length / 200)) }, id);
            setPost(current => ({ ...current, ...result }));
            setMessage(status === 'review' ? 'Submitted for review.' : 'Draft saved.');
            if (!id && result?.id) navigate(`/blog/edit/${result.id}`, { replace: true });
        } catch (error) { setMessage(error.message || 'Could not save article.'); } finally { setSaving(false); }
    };

    return <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8"><div className="mx-auto max-w-6xl"><div className="mb-5 flex items-center gap-3"><button onClick={() => navigate('/my-articles')} className="text-gray-500">Back</button><h1 className="text-2xl font-black">{id ? 'Edit Article' : 'Write a Story'}</h1></div><div className="grid gap-6 lg:grid-cols-[1fr_300px]"><main className="space-y-5"><section className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><input value={post.title} onChange={e => { update('title', e.target.value); if (!post.slug) update('slug', slugify(e.target.value)); }} placeholder="Article title" className="w-full bg-transparent text-3xl font-black outline-none" /><textarea value={post.excerpt || ''} onChange={e => update('excerpt', e.target.value)} placeholder="Short excerpt" rows={2} className="mt-4 w-full rounded-xl bg-gray-50 p-3 text-sm outline-none dark:bg-slate-800" /><input value={post.cover_image || ''} onChange={e => update('cover_image', e.target.value)} placeholder="Cover image URL" className="mt-3 w-full rounded-xl bg-gray-50 p-3 text-sm outline-none dark:bg-slate-800" /></section><section className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"><BlockEditor blocks={blocks} onChange={setBlocks} /></section></main><aside className="h-fit space-y-3 rounded-3xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><button disabled={saving} onClick={() => save('draft')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-100 py-3 font-bold dark:bg-slate-800"><Save size={16} /> Save Draft</button><button disabled={saving} onClick={() => save('review')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-white"><Send size={16} /> Submit for Review</button><button onClick={() => setPreview(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 font-bold"><Eye size={16} /> Preview</button>{message && <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>}</aside></div></div>{preview && <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4" onClick={() => setPreview(false)}><div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 dark:bg-slate-900" onClick={e => e.stopPropagation()}><button onClick={() => setPreview(false)} className="mb-5"><X /></button><h1 className="text-4xl font-black">{post.title || 'Untitled'}</h1><div className="prose mt-6 max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: renderBlocks(blocks) }} /></div></div>}</div>;
}