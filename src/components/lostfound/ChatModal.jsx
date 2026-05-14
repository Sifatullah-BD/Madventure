import React, { useState } from 'react';
import { X, Send, Shield, Phone, User } from 'lucide-react';

const ChatModal = ({ isOpen, onClose, item, user }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, sender: 'system', text: 'This is a secure chat. Your phone number is hidden.' },
        { id: 2, sender: 'other', text: 'Hi, I think I found your item.' }
    ]);
    const [isContactRevealed, setIsContactRevealed] = useState(false);

    if (!isOpen || !item) return null;

    const handleSend = () => {
        if (!message.trim()) return;

        setMessages([...messages, { id: Date.now(), sender: 'me', text: message }]);
        setMessage('');

        // Simulate reply
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'other',
                text: 'Can you describe the scratch on the back?'
            }]);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col h-[600px] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Shield className="text-primary" size={18} />
                            Secure Chat
                        </h3>
                        <p className="text-xs text-gray-500">Regarding: {item.item}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'system' ? (
                                <div className="w-full text-center my-2">
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-medium">
                                        {msg.text}
                                    </span>
                                </div>
                            ) : (
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'me'
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="p-4 bg-white border-t border-gray-100">
                    {!isContactRevealed ? (
                        <button
                            onClick={() => setIsContactRevealed(true)}
                            className="w-full mb-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <Phone size={16} /> Reveal My Contact Info
                        </button>
                    ) : (
                        <div className="w-full mb-4 py-2 bg-green-50 border border-green-100 rounded-xl text-sm text-center text-green-700 font-medium">
                            Contact info shared with user.
                        </div>
                    )}

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="flex-grow px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-primary text-white p-2 rounded-full hover:bg-green-700 transition-colors shadow-md"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;
