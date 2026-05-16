import React from 'react';
import { Star, ShoppingCart, Calendar, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onRent, onBuy }) => {
    const isRent = product.category === 'Rent';

    return (
        <motion.div 
            whileHover={{ scale: 1.05 }}
            className="group relative bg-[#111] rounded-[3rem] p-1 shadow-2xl overflow-hidden h-full flex flex-col"
        >
            {/* Animated Gradient Background Blob */}
            <div className={`absolute top-0 left-0 w-32 h-32 blur-[60px] -z-10 group-hover:w-full group-hover:h-full transition-all duration-700 ${isRent ? 'bg-emerald-500/20' : 'bg-cyan-500/20'}`}></div>
            
            <div className="bg-[#0a0a0a] rounded-[2.9rem] overflow-hidden flex flex-col h-full border border-white/5">
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Floating Badge */}
                    <div className="absolute top-6 left-6">
                        <div className={`px-4 py-1.5 rounded-full backdrop-blur-xl border border-white/20 text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2 ${isRent ? 'bg-emerald-500/30' : 'bg-cyan-500/30'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isRent ? 'bg-emerald-400' : 'bg-cyan-400'}`}></div>
                            {product.category}
                        </div>
                    </div>

                    {/* Rating Overlay */}
                    <div className="absolute bottom-6 right-6">
                        <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 flex items-center gap-1.5 shadow-2xl">
                            <Star size={12} className="text-yellow-400 fill-current" />
                            <span className="text-xs font-black text-white">{product.rating}</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow">
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{product.type}</span>
                            <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Premium Gear</span>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-emerald-400 transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2 font-medium">
                            {product.description}
                        </p>
                    </div>

                    {/* Pricing and Footer */}
                    <div className="pt-6 border-t border-white/5 mt-auto">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">{isRent ? 'DAILY RATE' : 'FULL PRICE'}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-white">৳{product.price}</span>
                                    {isRent && <span className="text-xs font-black text-gray-500 uppercase tracking-widest">/DAY</span>}
                                </div>
                            </div>
                            {isRent && (
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1 text-emerald-400">
                                        <Zap size={12} className="fill-current" />
                                        <span className="text-[10px] font-black">-{((1 - product.price / product.retailPrice) * 100).toFixed(0)}% OFF</span>
                                    </div>
                                    <p className="text-[10px] font-black text-gray-700 line-through tracking-tighter">Retail ৳{product.retailPrice}</p>
                                </div>
                            )}
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => isRent ? onRent(product) : onBuy(product)}
                            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                                isRent
                                ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.3)]'
                                : 'bg-white text-black hover:bg-cyan-400'
                            }`}
                        >
                            {isRent ? <Calendar size={18} /> : <ShoppingCart size={18} />}
                            {isRent ? 'Rent for your trip' : 'Secure Purchase'}
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
