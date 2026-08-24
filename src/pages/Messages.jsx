import React, { useEffect, useState } from 'react';
import { MessageSquare, Send, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';

export default function Messages() {
    const { user } = useAuth();
    const toast = useToast();
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [draft, setDraft] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (!user?.id) return;
        let cancelled = false;
        const loadRooms = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('chat_rooms')
                .select('id, title, type, created_at, chat_participants!inner(user_id)')
                .eq('chat_participants.user_id', user.id)
                .order('created_at', { ascending: false });
            if (!cancelled) {
                if (error) toast.error(error.message || 'Unable to load messages.');
                setRooms(data || []);
                setLoading(false);
            }
        };
        loadRooms();
        return () => { cancelled = true; };
    }, [user?.id, toast]);

    useEffect(() => {
        if (!selectedRoom?.id || !user?.id) return;
        let cancelled = false;
        const loadMessages = async () => {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('id, room_id, sender_id, message, message_type, is_read, created_at')
                .eq('room_id', selectedRoom.id)
                .order('created_at', { ascending: true });
            if (!cancelled) {
                if (error) toast.error(error.message || 'Unable to load conversation.');
                setMessages(data || []);
            }
        };
        loadMessages();
        const channel = supabase
            .channel(`chat-room-${selectedRoom.id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${selectedRoom.id}` }, payload => {
                setMessages(prev => prev.some(item => item.id === payload.new.id) ? prev : [...prev, payload.new]);
            })
            .subscribe();
        return () => { cancelled = true; supabase.removeChannel(channel); };
    }, [selectedRoom?.id, user?.id, toast]);

    const sendMessage = async event => {
        event.preventDefault();
        const message = draft.trim();
        if (!message || !selectedRoom?.id || !user?.id || sending) return;
        setSending(true);
        const { data, error } = await supabase.from('chat_messages').insert({ room_id: selectedRoom.id, sender_id: user.id, message, message_type: 'text' }).select().single();
        if (error) toast.error(error.message || 'Message could not be sent.');
        else {
            setMessages(prev => prev.some(item => item.id === data.id) ? prev : [...prev, data]);
            setDraft('');
        }
        setSending(false);
    };

    return <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950"><div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:min-h-[620px] md:flex-row"><aside className={`${selectedRoom ? 'hidden md:block' : 'block'} w-full border-b border-gray-200 dark:border-slate-800 md:w-80 md:border-b-0 md:border-r`}><div className="flex items-center gap-3 border-b border-gray-100 p-5 dark:border-slate-800"><MessageSquare className="text-primary" /><div><h1 className="font-black text-gray-900 dark:text-white">Inbox</h1><p className="text-xs text-gray-500">Your conversations</p></div></div><div className="p-3">{loading ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div> : rooms.length ? rooms.map(room => <button type="button" key={room.id} onClick={() => setSelectedRoom(room)} className={`mb-2 w-full rounded-2xl p-4 text-left transition-colors ${selectedRoom?.id === room.id ? 'bg-green-50 text-primary dark:bg-green-900/20' : 'hover:bg-gray-50 dark:hover:bg-slate-800'}`}><p className="font-bold">{room.title || 'Conversation'}</p><p className="mt-1 text-xs text-gray-500">{room.type || 'direct'}</p></button>) : <div className="px-3 py-12 text-center text-sm text-gray-500"><MessageSquare className="mx-auto mb-3 text-gray-300" />No conversations yet.</div>}</div></aside><section className={`${selectedRoom ? 'block' : 'hidden md:flex'} flex-1 flex-col`}><div className="flex items-center gap-3 border-b border-gray-100 p-5 dark:border-slate-800">{selectedRoom && <button type="button" onClick={() => setSelectedRoom(null)} className="rounded-lg p-2 hover:bg-gray-100 md:hidden" aria-label="Back to conversations"><ArrowLeft size={18} /></button>}<div><h2 className="font-black text-gray-900 dark:text-white">{selectedRoom?.title || 'Select a conversation'}</h2><p className="text-xs text-gray-500">{selectedRoom ? 'Messages are private to participants.' : 'Choose a conversation to start messaging.'}</p></div></div>{selectedRoom ? <><div className="flex-1 space-y-3 overflow-y-auto p-5">{messages.length ? messages.map(item => <div key={item.id} className={`flex ${item.sender_id === user.id ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${item.sender_id === user.id ? 'rounded-br-sm bg-primary text-white' : 'rounded-bl-sm bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-gray-200'}`}>{item.message}<p className="mt-1 text-[10px] opacity-60">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p></div></div>) : <div className="flex h-full items-center justify-center text-sm text-gray-500">Start the conversation.</div>}</div><form onSubmit={sendMessage} className="border-t border-gray-100 p-4 dark:border-slate-800"><div className="flex gap-3"><input value={draft} onChange={event => setDraft(event.target.value)} placeholder="Write a message..." className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white" /><button type="submit" disabled={!draft.trim() || sending} className="rounded-xl bg-primary px-4 text-white disabled:opacity-50" aria-label="Send message"><Send size={18} /></button></div></form></> : <div className="flex flex-1 items-center justify-center p-8 text-center text-gray-500"><div><MessageSquare className="mx-auto mb-4 text-gray-300" size={48} /><p>Select a conversation to view messages.</p></div></div>}</section></div></div>;
}
