import React from 'react';
import { ArrowDown, ArrowUp, ImagePlus, List, Quote, Trash2, Type } from 'lucide-react';

const makeBlock = type => type === 'list'
    ? { type, ordered: false, items: [''] }
    : { type, text: '' };

export default function BlockEditor({ blocks, onChange }) {
    const add = type => onChange([...blocks, makeBlock(type)]);
    const update = (index, patch) => onChange(blocks.map((block, i) => i === index ? { ...block, ...patch } : block));
    const move = (index, direction) => {
        const target = index + direction;
        if (target < 0 || target >= blocks.length) return;
        const next = [...blocks];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
    };
    const remove = index => onChange(blocks.filter((_, i) => i !== index));
    const input = 'w-full rounded-xl bg-gray-50 dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20';
    const tools = [['heading', Type, 'Heading'], ['paragraph', Type, 'Text'], ['quote', Quote, 'Quote'], ['list', List, 'List'], ['image', ImagePlus, 'Image']];

    return <div>
        <div className="flex flex-wrap gap-2 mb-4">
            {tools.map(([type, icon, label]) => <button key={type} type="button" onClick={() => add(type)} className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-green-100 hover:text-primary">{React.createElement(icon, { size: 14 })}{label}</button>)}
        </div>
        <div className="space-y-3">
            {blocks.map((block, index) => <div key={`${block.type}-${index}`} className="rounded-2xl border border-gray-200 dark:border-slate-700 p-3">
                <div className="flex items-center gap-1 mb-2"><span className="mr-auto text-[10px] font-bold uppercase text-gray-400">{block.type}</span><button type="button" title="Move up" onClick={() => move(index, -1)} className="p-1 text-gray-400"><ArrowUp size={14} /></button><button type="button" title="Move down" onClick={() => move(index, 1)} className="p-1 text-gray-400"><ArrowDown size={14} /></button><button type="button" title="Delete" onClick={() => remove(index)} className="p-1 text-red-400"><Trash2 size={14} /></button></div>
                {block.type === 'heading' && <input value={block.text || ''} onChange={e => update(index, { text: e.target.value })} placeholder="Heading" className={`${input} font-bold`} />}
                {['paragraph', 'quote'].includes(block.type) && <textarea value={block.text || ''} onChange={e => update(index, { text: e.target.value })} placeholder={block.type === 'quote' ? 'Quote' : 'Write something...'} rows={3} className={input} />}
                {block.type === 'list' && <><label className="mb-2 flex items-center gap-2 text-xs"><input type="checkbox" checked={!!block.ordered} onChange={e => update(index, { ordered: e.target.checked })} /> Numbered list</label><textarea value={(block.items || []).join('\n')} onChange={e => update(index, { items: e.target.value.split('\n') })} placeholder="One item per line" rows={3} className={input} /></>}
                {block.type === 'image' && <><input value={block.url || ''} onChange={e => update(index, { url: e.target.value })} placeholder="Image URL" className={input} /><input value={block.caption || ''} onChange={e => update(index, { caption: e.target.value })} placeholder="Caption (optional)" className={`${input} mt-2`} /></>}
            </div>)}
            {!blocks.length && <p className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">Add a block to start writing.</p>}
        </div>
    </div>;
}