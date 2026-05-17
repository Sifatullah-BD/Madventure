import React from 'react';
import { MessageSquare, Heart, CheckCircle2, Pin, Share2, Bookmark, Link as LinkIcon, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { DISTRICTS } from '../../data/madventure-data';

const CategoryDetails = {
    tips: { label: 'TIPS', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
    question: { label: 'QUESTION', color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
    review: { label: 'REVIEW', color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10' },
    alert: { label: 'ALERT', color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10' }
};

const ThreadCard = ({ thread, onClick }) => {
    const district = DISTRICTS.find(d => d.id === thread.districtId);
    const cat = CategoryDetails[thread.category] || { label: thread.category, color: 'text-gray-400', border: 'border-gray-500/30', bg: 'bg-gray-500/10' };
    
    return (
        <motion.div 
            whileHover={{ x: 10 }}
            onClick={() => onClick(thread.id)}
            className="group relative bg-white dark:bg-[#0a0a0a] rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-md dark:shadow-none"
        >
            {/* Ambient Background Line (Animated) */}
            <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Author Info (Vertical on desktop) */}
                <div className="flex md:flex-col items-center gap-4 shrink-0">
                    <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 to-cyan-500">
                        <div className="w-full h-full rounded-full bg-black overflow-hidden">
                            {thread.avatar ? (
                                <img src={thread.avatar} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white font-black bg-gray-800 dark:bg-black">
                                    {thread.author?.charAt(0) || 'A'}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="md:text-center">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-0.5">Level</p>
                        <p className="text-emerald-400 font-black text-sm italic">{thread.authorLevel || 10}</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-grow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${cat.border} ${cat.bg} ${cat.color} tracking-widest`}>
                                {cat.label}
                            </span>
                            {district && (
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                                    {district.nameEn}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">{thread.createdAt}</span>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                        {thread.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">
                        {thread.content}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-gray-500 hover:text-red-400 transition-colors">
                                <Heart size={18} />
                                <span className="text-xs font-black">{thread.likes}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 hover:text-emerald-400 transition-colors">
                                <MessageSquare size={18} />
                                <span className="text-xs font-black">{thread.replyCount}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white transition-all">
                                <Bookmark size={18} />
                            </button>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white transition-all">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Glowing Corner Decor */}
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-emerald-500/10 blur-[40px] rounded-full group-hover:bg-emerald-500/20 transition-all"></div>
        </motion.div>
    );
};

export default ThreadCard;
