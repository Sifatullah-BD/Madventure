import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const LiveSupportWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: 'Hi there! How can we help you plan your Madventure today?' }
    ]);

    const handleSend = () => {
        if (!message.trim()) return;
        
        // Add user message
        const newMessages = [...messages, { id: Date.now(), sender: 'user', text: message }];
        setMessages(newMessages);
        setMessage('');

        // Simulate bot reply
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                sender: 'bot', 
                text: "Thanks for reaching out! One of our travel experts will be with you shortly. For immediate emergencies, please use the SOS button." 
            }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 h-96 flex flex-col overflow-hidden mb-4 animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-[#5D59F9] p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <h3 className="font-bold text-sm">Madventure Support</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                    msg.sender === 'user' 
                                    ? 'bg-primary text-white rounded-br-none' 
                                    : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none shadow-sm'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input 
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <button 
                            onClick={handleSend}
                            className="bg-primary text-white p-2 rounded-full hover:bg-secondary transition-colors shadow-md"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-r from-primary to-[#5D59F9] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center glow-effect group"
                >
                    <MessageSquare size={24} className="group-hover:animate-bounce" />
                </button>
            )}
        </div>
    );
};

export default LiveSupportWidget;
