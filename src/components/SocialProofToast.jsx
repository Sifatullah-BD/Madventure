import React, { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';

const SocialProofToast = () => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');

    const messages = [
        "Join Sarah—she just booked her flight to Cox's Bazar!",
        "Join Rahim—he just started planning his Sajek trip!",
        "Join Tanvir—he just found a hidden gem in Bandarban!",
        "Join Naila—she just asked for help in the Community!",
        "Join Karim—he just used the Budget Tracker for his tour!"
    ];

    useEffect(() => {
        const showToast = () => {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            setMessage(randomMessage);
            setVisible(true);

            setTimeout(() => {
                setVisible(false);
            }, 6000); // Hide after 6 seconds
        };

        // Show toast ONLY ONCE after 8 seconds delay
        const timer = setTimeout(showToast, 8000);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-50 animate-fade-in-up">
            <div className="bg-white/95 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl p-4 flex items-center gap-4 max-w-sm transform hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary to-green-400 rounded-full flex items-center justify-center text-white shadow-lg">
                        <UserPlus size={22} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                </div>

                <div className="flex-1">
                    <p className="text-sm font-bold">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-green-600 font-extrabold text-base">
                            {message.split('—')[0]}
                        </span>
                    </p>
                    <p className="text-xs text-gray-600 font-medium leading-snug mt-0.5">
                        {message.split('—')[1]}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1.5 font-semibold tracking-wide uppercase">
                        Verified Traveler
                    </p>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setVisible(false);
                    }}
                    className="absolute top-2 right-2 text-gray-300 hover:text-gray-500 transition-colors p-1"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default SocialProofToast;
