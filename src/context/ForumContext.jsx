import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const ForumContext = createContext();

export const ForumProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const channel = supabase.channel('forum');

        channel.on('postgres_changes', { event: '*', schema: 'public', table: 'forum' }, payload => {
            if (payload.eventType === 'INSERT') {
                setPosts(prev => [payload.new, ...prev]);
            }
        });

        channel.subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, []);

    return (
        <ForumContext.Provider value={{ posts, setPosts }}>
            {children}
        </ForumContext.Provider>
    );
};

export const useForum = () => useContext(ForumContext);