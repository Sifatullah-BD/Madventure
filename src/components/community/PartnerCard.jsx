import React from 'react';
import { MapPin, Calendar, Wallet, Users, MessageCircle, Share2, Star, ShieldCheck, Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { DISTRICTS } from '../../data/madventure-data';

const PartnerCard = ({ partner, onWhatsApp, onJoin }) => {
    const district = DISTRICTS.find(d => d.id === partner.destination_id);
    const profile = partner.profiles || {};
    const rating = profile.rating || 4.9;

    // Simulate co-travelers for the "Network" look
    const joinedTravelers = [
        { id: 1, avatar: 'https://i.pravatar.cc/150?u=1' },
        { id: 2, avatar: 'https://i.pravatar.cc/150?u=2' },
    ];

    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative h-[550px] w-full group overflow-visible"
        >
            {/* Background Network Wavy Lines (SVG) */}
            <div className="absolute inset-0 -z-10 opacity-20 group-hover:opacity-40 transition-opacity">
                <svg width="100%" height="100%" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-emerald-500/30">
                    <path d="M50 100 Q 150 50, 200 150 T 350 200" strokeWidth="1" strokeDasharray="4 4" />
                    <path d="M350 400 Q 250 450, 200 350 T 50 300" strokeWidth="1" strokeDasharray="4 4" />
                </svg>
            </div>

            {/* Central Node: The Destination & Host */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[320px] z-10">
                <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden">
                    {/* Interior Glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 blur-[60px]"></div>
                    
                    {/* Host Avatar Node */}
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="relative mb-4">
                            <motion.div 
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 6 }}
                                className="w-24 h-24 rounded-[2.5rem] overflow-hidden border-4 border-emerald-500/20 shadow-2xl"
                            >
                                <img src={profile.avatar_url || 'https://i.pravatar.cc/150?u=host'} className="w-full h-full object-cover" />
                            </motion.div>
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black p-1.5 rounded-2xl shadow-lg">
                                <ShieldCheck size={16} />
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-white tracking-tight">{profile.full_name}</h3>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1">Lead Traveler</p>
                    </div>

                    {/* Destination Pill */}
                    <div className="bg-black/40 rounded-3xl p-5 border border-white/5 mb-6 text-center">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Adventure To</span>
                        <h4 className="text-lg font-black text-white flex items-center justify-center gap-2">
                            <MapPin size={16} className="text-emerald-400" />
                            {district?.name || 'Dhaka'}
                        </h4>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Date</p>
                            <p className="text-xs font-black text-white uppercase">{new Date(partner.travel_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Budget</p>
                            <p className="text-xs font-black text-white">{partner.budget_range}</p>
                        </div>
                    </div>

                    {/* Action */}
                    <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onWhatsApp(profile.phone)}
                        className="w-full h-14 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-400 transition-colors shadow-2xl"
                    >
                        <MessageCircle size={18} /> Chat with {profile.full_name?.split(' ')[0]}
                    </motion.button>
                </div>
            </div>

            {/* Satellite Nodes (Co-travelers) */}
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-20 right-4 w-16 h-16 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 p-1 z-20 shadow-2xl"
            >
                <img src={joinedTravelers[0].avatar} className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black"></div>
            </motion.div>

            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 left-4 w-20 h-20 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 p-1 z-20 shadow-2xl overflow-hidden"
            >
                <img src={joinedTravelers[1].avatar} className="w-full h-full rounded-[1.8rem] object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-black text-xs">Joined</span>
                </div>
            </motion.div>

            {/* Empty Spot Satellite */}
            <motion.div 
                whileHover={{ rotate: 45 }}
                className="absolute top-1/4 left-10 w-12 h-12 rounded-full border-2 border-dashed border-emerald-500/40 flex items-center justify-center text-emerald-500/40 hover:text-emerald-500 hover:border-emerald-500 transition-all cursor-pointer z-20"
                onClick={() => onJoin(partner.id)}
            >
                <Plus size={20} />
            </motion.div>

            {/* Floating Info Pill 1 */}
            <motion.div 
                animate={{ x: [0, 5, 0] }}
                className="absolute top-10 left-1/4 px-4 py-2 bg-emerald-500/10 backdrop-blur-md rounded-full border border-emerald-500/20 flex items-center gap-2 z-20 shadow-xl"
            >
                <Sparkles size={12} className="text-emerald-400" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Premium Group</span>
            </motion.div>

            {/* Floating Info Pill 2 */}
            <motion.div 
                animate={{ x: [0, -5, 0] }}
                className="absolute bottom-10 right-1/4 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 z-20 shadow-xl"
            >
                <Users size={12} className="text-gray-400" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">{partner.joined_count || 3}/{partner.group_size || 6} Slots</span>
            </motion.div>

            {/* Decorative Connection Line (Hand-drawn style) */}
            <svg className="absolute inset-0 w-full h-full -z-0 pointer-events-none opacity-40">
                <path d="M70 200 Q 150 250, 200 300" stroke="url(#emeraldGradient)" strokeWidth="2" fill="none" />
                <defs>
                    <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>
            </svg>
        </motion.div>
    );
};

export default PartnerCard;
