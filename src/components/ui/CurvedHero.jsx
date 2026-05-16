import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';

const CurvedHero = ({ 
    title = "FIND SOMEONE", 
    subtitle = "TO TAKE YOU THERE", 
    image = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    items = [], // Dynamic items for the bottom slider
    onAction = () => {}
}) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="relative w-full h-[600px] md:h-[750px] bg-white overflow-hidden rounded-[4rem] shadow-2xl my-10 group/hero">
            {/* Left Content */}
            <div className="absolute inset-0 flex items-center z-10 pointer-events-none">
                <div className="pl-12 md:pl-24 max-w-2xl pointer-events-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <span className="h-1 w-12 bg-[#007b8a] rounded-full"></span>
                            <span className="text-xs font-black tracking-[0.3em] text-gray-400 uppercase">Discover Companions</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-[#007b8a] leading-[0.9] mb-4 tracking-tighter">
                            {title}
                        </h2>
                        <h3 className="text-5xl md:text-7xl font-black text-gray-300 leading-[0.9] tracking-tighter">
                            {subtitle}
                        </h3>
                    </motion.div>

                    {/* Timeline Slider / Info Blocks */}
                    <div className="mt-24 md:mt-32 relative">
                        <div className="flex gap-10 md:gap-16 mb-6">
                            {items.map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className={`group flex flex-col transition-all ${activeIndex === i ? 'scale-110' : 'opacity-40 hover:opacity-100'}`}
                                >
                                    <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${activeIndex === i ? 'text-[#007b8a]' : 'text-gray-400'}`}>
                                        {item.label}
                                    </span>
                                    <span className={`text-sm font-black ${activeIndex === i ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {item.value}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div className="h-[3px] bg-gray-100 w-full max-w-md relative rounded-full overflow-hidden">
                            <motion.div 
                                className="absolute inset-y-0 bg-[#007b8a] rounded-full"
                                initial={{ width: "25%" }}
                                animate={{ 
                                    left: `${(activeIndex / Math.max(1, items.length - 1)) * 75}%`,
                                    width: "25%" 
                                }}
                                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            ></motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Organic Curved Image Section */}
            <div className="absolute inset-0 z-0">
                <motion.div 
                    key={image}
                    initial={{ scale: 1.1, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-y-0 right-0 w-full md:w-[65%] h-full bg-cover bg-center transition-all duration-1000"
                    style={{ 
                        backgroundImage: `url(${image})`,
                        clipPath: 'path("M320,0 C120,0 120,200 120,400 C120,600 120,800 320,800 L1200,800 L1200,0 L320,0 Z")' 
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-transparent"></div>
                </motion.div>
            </div>

            {/* "GO" Action Button on the curve */}
            <motion.button
                onClick={onAction}
                whileHover={{ scale: 1.1, backgroundColor: "#005f6b" }}
                whileTap={{ scale: 0.9 }}
                className="absolute left-[35%] md:left-[35%] top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-24 h-24 md:w-32 md:h-32 bg-[#007b8a] text-white rounded-full flex items-center justify-center font-black italic text-2xl shadow-[0_20px_50px_rgba(0,123,138,0.3)] border-[12px] border-white group/btn"
            >
                <div className="relative overflow-hidden flex items-center justify-center w-full h-full">
                    <motion.span 
                        animate={{ y: [0, -40, 40, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                        className="group-hover/btn:hidden"
                    >
                        GO
                    </motion.span>
                    <ArrowRight className="hidden group-hover/btn:block animate-bounce-x" size={40} />
                </div>
            </motion.button>

            {/* Abstract background shapes */}
            <div className="absolute top-10 right-20 w-32 h-32 bg-white/10 backdrop-blur-3xl rounded-full z-10 border border-white/20"></div>
            <div className="absolute top-1/4 left-10 w-4 h-4 bg-[#007b8a]/20 rounded-full animate-ping"></div>
            <div className="absolute bottom-10 left-10 text-[8px] font-bold text-gray-300 tracking-[1em] uppercase vertical-text hidden md:block">
                EST 2024 MADVENTURE
            </div>
        </div>
    );
};

export default CurvedHero;
