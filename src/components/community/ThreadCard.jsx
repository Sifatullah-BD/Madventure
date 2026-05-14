import React from 'react';
import { MessageSquare, Heart, Eye, CheckCircle2, Pin } from 'lucide-react';
import { DISTRICTS } from '../../data/madventure-data';

const CategoryDetails = {
    tips: { label: 'টিপস', color: 'bg-green-100 text-green-700' },
    question: { label: 'প্রশ্ন', color: 'bg-blue-100 text-blue-700' },
    review: { label: 'রিভিউ', color: 'bg-yellow-100 text-yellow-700' },
    alert: { label: 'সতর্কতা', color: 'bg-red-100 text-red-700' }
};

const ThreadCard = ({ thread, onClick }) => {
    const district = DISTRICTS.find(d => d.id === thread.districtId);
    const cat = CategoryDetails[thread.category] || { label: thread.category, color: 'bg-gray-100 text-gray-700' };

    return (
        <div 
            onClick={() => onClick(thread.id)}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer relative"
        >
            {thread.isPinned && (
                <div className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg" title="Pinned">
                    <Pin size={16} className="fill-current" />
                </div>
            )}

            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex gap-2 items-center flex-wrap">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${cat.color}`}>
                        {cat.label}
                    </span>
                    {district && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            📍 {district.name}
                        </span>
                    )}
                    {thread.isSolved && (
                        <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded flex items-center gap-1 font-bold">
                            <CheckCircle2 size={12}/> সমাধানকৃত
                        </span>
                    )}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{thread.createdAt}</span>
            </div>

            <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{thread.title}</h3>
            
            <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                {thread.content}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs uppercase">
                        {thread.author.avatar}
                    </div>
                    <div className="text-xs">
                        <p className="font-bold text-gray-700">{thread.author.name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                    <span className="flex items-center gap-1 hover:text-red-500 transition-colors"><Heart size={14}/> {thread.likes}</span>
                    <span className="flex items-center gap-1"><Eye size={14}/> {thread.views}</span>
                    <span className="flex items-center gap-1 hover:text-blue-500 transition-colors"><MessageSquare size={14}/> {thread.replyCount}</span>
                </div>
            </div>
        </div>
    );
};

export default ThreadCard;
