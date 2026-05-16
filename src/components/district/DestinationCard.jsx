import React from 'react';
import { MapPin, ArrowRight, Star, Mountain, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DestinationCard = ({ place }) => {
    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className="group relative h-[450px] w-full rounded-[2.5rem] overflow-hidden bg-gray-900 shadow-2xl transition-all duration-500"
        >
            {/* Background Image with Parallax-like effect */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={place.image} 
                    alt={place.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            </div>

            {/* Liquid Glass Overlay (Top Right) */}
            <div className="absolute top-6 right-6 z-20">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center gap-2 shadow-xl">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{place.region}</span>
                </div>
            </div>

            {/* Floating Icons (Animated) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="relative">
                    <div className="w-24 h-24 bg-cyan-500/20 blur-[40px] rounded-full"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        {place.type === 'mountain' ? <Mountain size={48} className="text-white/40" /> : <Waves size={48} className="text-white/40" />}
                    </div>
                </div>
            </div>

            {/* Content Container (Bottom) */}
            <div className="absolute inset-x-0 bottom-0 p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {/* Badge Row */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1 bg-yellow-400/20 backdrop-blur-md px-3 py-1 rounded-full border border-yellow-400/30">
                        <Star size={12} className="text-yellow-400 fill-current" />
                        <span className="text-[10px] font-black text-yellow-400">4.9</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <MapPin size={10} className="text-gray-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">BD</span>
                    </div>
                </div>

                <h3 className="text-3xl font-black text-white mb-2 tracking-tight group-hover:text-cyan-400 transition-colors duration-300">
                    {place.name}
                </h3>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {place.description}
                </p>

                <Link 
                    to={`/place/${place.id}`}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition-all group/btn"
                >
                    Explore Now
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Decorative Edge Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
        </motion.div>
    );
};

export default DestinationCard;
