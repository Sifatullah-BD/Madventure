import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';

const ChatWidget = () => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    
    const greetings = {
        en: "Assalamu Alaikum! I am your Madventure AI Guide. How can I help you today? ✨",
        bn: "আসসালামু আলাইকুম! আমি আপনার ম্যাডভেঞ্চার এআই গাইড। আজ আপনাকে কীভাবে সাহায্য করতে পারি? ✨"
    };

    const [messages, setMessages] = useState([
        { id: 1, text: greetings[language] || greetings.en, time: "Just now", isMe: false },
    ]);

    // Update greeting if language changes and no messages have been sent yet
    useEffect(() => {
        if (messages.length === 1 && !messages[0].isMe) {
            setMessages([{ id: 1, text: greetings[language] || greetings.en, time: "Just now", isMe: false }]);
        }
    }, [language]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const quickActions = [
        "Best time for Sajek? ☁️",
        "Sundarban safety? 🐅",
        "Budget for 3 days? ৳",
        "Find a travel partner 🤝"
    ];

    const handleQuickAction = (action) => {
        setNewMessage(action);
    };

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        const msgText = newMessage.trim();
        if (!msgText) return;
        
        const userMsg = { 
            id: Date.now(), 
            text: msgText, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
            isMe: true
        };
        setMessages(prev => [...prev, userMsg]);
        setNewMessage('');
        setIsTyping(true);

        try {
            const { getAIResponse } = await import('../../services/aiAssistant');
            const aiText = await getAIResponse(msgText);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: aiText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: false
            }]);
        } catch (err) {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "I'm experiencing a temporary connection issue. How can I help with your Madventure plans?",
                time: "Just now",
                isMe: false
            }]);
        }
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-12 right-6 z-[10000]">
            <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-[2rem] shadow-[0_20px_50px_rgba(27,94,32,0.3)] flex items-center justify-center transition-all duration-500 z-50 relative ${
                    isOpen ? 'bg-white text-gray-900 rotate-90' : 'bg-[#1B5E20] text-white'
                }`}
            >
                {isOpen ? <X size={28} /> : (
                    <div className="relative">
                        <MessageSquare size={28} />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#1B5E20] animate-pulse"></div>
                    </div>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.9, y: 50, filter: 'blur(10px)' }}
                        className="absolute bottom-20 right-0 w-[400px] h-[680px] bg-white/80 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.15)] border border-white/50 flex flex-col overflow-hidden"
                    >
                        <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
                            <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-green-200 blur-[100px] animate-pulse"></div>
                            <div className="absolute bottom-[-10%] right-[-10%] w-full h-full bg-orange-100 blur-[100px] animate-pulse delay-700"></div>
                        </div>

                        <div className="p-8 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-700 p-0.5 shadow-lg">
                                        <img src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" className="w-full h-full rounded-[1.4rem] bg-white object-cover" alt="AI" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-sm"></div>
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 text-lg">AI Assistant</h3>
                                    <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Always Online</p>
                                </div>
                            </div>
                        </div>

                        <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-4 space-y-6 no-scrollbar">
                            {messages.map((msg, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, x: msg.isMe ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm shadow-sm leading-relaxed ${
                                        msg.isMe 
                                        ? 'bg-[#1B5E20] text-white rounded-tr-none' 
                                        : 'bg-white/60 backdrop-blur-md text-gray-700 rounded-tl-none border border-white/50'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/40 backdrop-blur-md p-4 rounded-3xl rounded-tl-none flex gap-1.5">
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-green-500 rounded-full"></motion.div>
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-green-500 rounded-full"></motion.div>
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-green-500 rounded-full"></motion.div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-8 pt-2 space-y-4">
                            <div className="flex overflow-x-auto gap-2 no-scrollbar pb-2">
                                {quickActions.map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleQuickAction(action)}
                                        className="whitespace-nowrap px-4 py-2 bg-white/40 hover:bg-white text-xs font-bold text-gray-600 rounded-full border border-white/50 transition-all"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleSendMessage} className="relative group">
                                <div className="relative flex items-center bg-white/60 backdrop-blur-2xl rounded-[2rem] p-2 pr-4 border border-white/50 shadow-xl">
                                    <input 
                                        type="text" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Ask Madventure AI..."
                                        className="flex-1 bg-transparent border-none outline-none px-6 py-3 text-sm text-gray-800 placeholder-gray-400"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!newMessage.trim()}
                                        className="bg-[#1B5E20] text-white p-3 rounded-[1.4rem] hover:scale-105 transition-all disabled:opacity-50"
                                    >
                                        <Send size={18} fill="white" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatWidget;
