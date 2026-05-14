import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Mock review data for fallback
const MOCK_REVIEWS = [
    {
        id: 'rev_1',
        user_id: 'usr_1',
        entity_id: 'cox-bazar-3-days',
        entity_type: 'tour',
        rating: 5,
        comment: 'Amazing experience! The guide was very helpful.',
        photos: [],
        created_at: new Date(Date.now() - 86400000).toISOString()
    }
];

export const getReviews = async (entityType, entityId) => {
    if (!isSupabaseConfigured) {
        const filtered = MOCK_REVIEWS.filter(r => r.entity_type === entityType && r.entity_id === entityId);
        return { data: filtered, error: null };
    }
    
    let query = supabase.from('reviews').select('*');
    if (entityType) query = query.eq('entity_type', entityType);
    if (entityId) query = query.eq('entity_id', entityId);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
};

export const addReview = async (reviewData) => {
    if (!isSupabaseConfigured) {
        return new Promise(resolve => {
            setTimeout(() => {
                const newRev = {
                    ...reviewData,
                    id: `rev_${Date.now()}`,
                    created_at: new Date().toISOString()
                };
                MOCK_REVIEWS.push(newRev);
                resolve({ data: newRev, error: null });
            }, 500);
        });
    }

    const { data, error } = await supabase.from('reviews').insert([reviewData]).select().single();
    return { data, error };
};
