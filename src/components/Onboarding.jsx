import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Globe, Compass, Users, Map, Check } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "Explore the Hidden Gems",
            subtitle: "Discover unique travel destinations and secret spots recommended by local experts.",
            icon: <Globe size={40} className="text-emerald-400" />,
            image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
            accent: "from-emerald-600/20 to-transparent"
        },
        {
            title: "Book with Confidence",
            subtitle: "Hassle-free ticket booking for Bus, Air, Train and premium organized tours.",
            icon: <Compass size={40} className="text-blue-400" />,
            image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
            accent: "from-blue-600/20 to-transparent"
        },
        {
            title: "Join the Community",
            subtitle: "Find your perfect travel partner and share memories with fellow adventurers.",
            icon: <Users size={40} className="text-orange-400" />,
            image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800",
            accent: "from-orange-600/20 to-transparent"
        }
    ];

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            localStorage.setItem('madventure_onboarded', 'true');
            onComplete();
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-[#0a0a0a] flex items-center justify-center p-4 md:p-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.9, x: 100 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 1.1, x: -100 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="max-w-4xl w-full h-[600px] bg-white rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
                >
                    {/* Image Section */}
                    <div className="md:w-1/2 relative h-1/2 md:h-full overflow-hidden">
                        <img 
                            src={steps[currentStep].image} 
                            className="w-full h-full object-cover"
                            alt="Onboarding"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${steps[currentStep].accent} transition-colors duration-1000`}></div>
                        <div className="absolute bottom-10 left-10">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 text-white">
                                {steps[currentStep].icon}
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-white relative">
                        <div className="flex gap-2 mb-10">
                            {steps.map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`h-1.5 rounded-full transition-all duration-500 ${
                                        i === currentStep ? 'w-10 bg-[#1B5E20]' : 'w-2 bg-gray-200'
                                    }`}
                                />
                            ))}
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                            {steps[currentStep].title}
                        </h2>
                        <p className="text-gray-500 text-lg font-medium leading-relaxed mb-12">
                            {steps[currentStep].subtitle}
                        </p>

                        <div className="mt-auto flex items-center justify-between">
                            <button 
                                onClick={() => {
                                    localStorage.setItem('madventure_onboarded', 'true');
                                    onComplete();
                                }}
                                className="text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-600 transition-colors"
                            >
                                Skip Tour
                            </button>
                            
                            <button
                                onClick={nextStep}
                                className="group relative flex items-center gap-4 bg-[#1B5E20] text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-800 transition-all shadow-[0_15px_40px_rgba(27,94,32,0.3)] active:scale-95"
                            >
                                {currentStep === steps.length - 1 ? "Let's Adventure" : "Next Step"}
                                <div className="p-1 bg-white/20 rounded-lg group-hover:translate-x-1 transition-transform">
                                    <ArrowRight size={16} />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-10 right-10 text-[80px] font-black text-gray-50 select-none -z-10 tracking-tighter">
                        0{currentStep + 1}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Onboarding;
