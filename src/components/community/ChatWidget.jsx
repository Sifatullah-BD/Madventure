import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2, User, Building2, ShieldCheck } from 'lucide-react';
import { unicornService } from '../../api/unicorn';
import { useAuth } from '../../hooks/useAuth';

const ChatWidget = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (user && isOpen) {
            loadRooms();
        }
    }, [user, isOpen]);

    useEffect(() => {
        if (activeRoom) {
            loadMessages();
            // In a real production app, we would use Supabase Realtime here
            // const subscription = supabase.from('chat_messages').on(...).subscribe()
        }
    }, [activeRoom]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const loadRooms = async () => {
        setLoading(true);
        try {
            const data = await unicornService.getChatRooms(user.id);
            setRooms(data);
            if (data.length > 0 && !activeRoom) {
                setActiveRoom(data[0]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async () => {
        try {
            const { data } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('room_id', activeRoom.id)
                .order('created_at', { ascending: true });
            if (data) setMessages(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeRoom) return;

        setSending(true);
        try {
            await unicornService.sendMessage(activeRoom.id, user.id, newMessage);
            setNewMessage('');
            loadMessages();
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-24 right-6 z-50">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
                    isOpen ? 'bg-red-500 rotate-90' : 'bg-primary hover:scale-110 shadow-primary/30'
                } text-white`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                    
                    {/* Header */}
                    <div className="bg-primary p-4 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Building2 size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Madventure Support</h3>
                                <p className="text-[10px] text-green-100 flex items-center gap-1">
                                    <ShieldCheck size={10} /> Online & Verified
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full"><X size={20} /></button>
                    </div>

                    {/* Rooms List (If multiple) */}
                    {rooms.length > 1 && !activeRoom && (
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Your Conversations</p>
                            {rooms.map(room => (
                                <button
                                    key={room.id}
                                    onClick={() => setActiveRoom(room)}
                                    className="w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 transition-colors flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                                        {room.title?.[0] || 'T'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{room.title || 'Trip Discussion'}</p>
                                        <p className="text-xs text-gray-500">Tap to chat</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Messages Area */}
                    {activeRoom && (
                        <>
                            <div 
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950/50"
                            >
                                {loading ? (
                                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
                                ) : (
                                    <>
                                        <div className="text-center py-4">
                                            <p className="text-[10px] bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full inline-block">
                                                This is a secure conversation with Madventure Support
                                            </p>
                                        </div>
                                        {messages.map((msg, idx) => {
                                            const isMe = msg.sender_id === user.id;
                                            return (
                                                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                                        isMe 
                                                        ? 'bg-primary text-white rounded-tr-none' 
                                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-100 dark:border-gray-700 rounded-tl-none shadow-sm'
                                                    }`}>
                                                        {msg.message}
                                                        <p className={`text-[9px] mt-1 ${isMe ? 'text-green-100' : 'text-gray-400'}`}>
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                )}
                            </div>

                            {/* Input Area */}
                            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={sending || !newMessage.trim()}
                                    className="bg-primary text-white p-2 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
