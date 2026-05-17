import React, { useState } from 'react';
import { MessageSquare, X, Phone, Mail, HelpCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LiveSupportWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { language } = useLanguage();

    const supportOptions = [
        {
            icon: <Phone className="w-5 h-5 text-green-500" />,
            title: language === 'bn' ? 'হটলাইন কল করুন' : 'Call Support Hotline',
            subtitle: '+880 9612 123456',
            action: 'tel:+8809612123456'
        },
        {
            icon: <MessageSquare className="w-5 h-5 text-emerald-500" />,
            title: language === 'bn' ? 'হোয়াটসঅ্যাপ চ্যাট' : 'Chat on WhatsApp',
            subtitle: language === 'bn' ? 'ইনস্ট্যান্ট চ্যাট করুন' : 'Chat with an expert',
            action: 'https://wa.me/8801700000000?text=' + encodeURIComponent(language === 'bn' ? 'হ্যালো ম্যাডভেঞ্চার, আমার একটু তথ্য প্রয়োজন।' : 'Hello Madventure, I need help with a trip.')
        },
        {
            icon: <Mail className="w-5 h-5 text-blue-500" />,
            title: language === 'bn' ? 'ইমেইল করুন' : 'Email Support',
            subtitle: 'support@madventure.com',
            action: 'mailto:support@madventure.com'
        },
        {
            icon: <AlertCircle className="w-5 h-5 text-red-500" />,
            title: language === 'bn' ? 'জরুরি সেফটি সেন্টার' : 'Emergency Safety Hub',
            subtitle: language === 'bn' ? 'SOS ও লাইভ ট্র্যাকিং' : 'SOS & Live Map Tracking',
            action: '/safety',
            isRoute: true
        }
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
            {/* Contact Panel */}
            {isOpen && (
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 w-80 overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-[#2E7D32] p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></div>
                            <h3 className="font-bold text-sm tracking-wide">{language === 'bn' ? 'ম্যাডভেঞ্চার হেল্পলাইন' : 'Madventure Helpline'}</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Options list */}
                    <div className="p-3 bg-gray-50 dark:bg-slate-950 flex flex-col gap-2">
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold px-1 mb-1">
                            {language === 'bn' ? 'সহায়তার জন্য যেকোনো একটি মাধ্যম বেছে নিন:' : 'Choose a support channel:'}
                        </p>
                        
                        {supportOptions.map((opt, i) => (
                            opt.isRoute ? (
                                <a 
                                    key={i} 
                                    href={opt.action}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsOpen(false);
                                        window.location.href = opt.action;
                                    }}
                                    className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-gray-100 dark:border-slate-850 hover:border-primary/30 dark:hover:border-green-500/30 hover:shadow-sm transition-all group"
                                >
                                    <div className="p-2 bg-gray-50 dark:bg-slate-800 rounded-lg group-hover:scale-105 transition-transform">
                                        {opt.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-green-400 transition-colors">{opt.title}</h4>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{opt.subtitle}</p>
                                    </div>
                                </a>
                            ) : (
                                <a 
                                    key={i} 
                                    href={opt.action} 
                                    target={opt.action.startsWith('http') ? '_blank' : '_self'}
                                    rel="noopener noreferrer"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-gray-100 dark:border-slate-850 hover:border-primary/30 dark:hover:border-green-500/30 hover:shadow-sm transition-all group"
                                >
                                    <div className="p-2 bg-gray-50 dark:bg-slate-800 rounded-lg group-hover:scale-105 transition-transform">
                                        {opt.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary dark:group-hover:text-green-400 transition-colors">{opt.title}</h4>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{opt.subtitle}</p>
                                    </div>
                                </a>
                            )
                        ))}
                    </div>
                </div>
            )}

            {/* Floating Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-r from-primary to-[#2E7D32] text-white p-3.5 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center justify-center glow-effect group cursor-pointer"
                >
                    <MessageSquare size={20} className="group-hover:animate-pulse" />
                </button>
            )}
        </div>
    );
};

export default LiveSupportWidget;
