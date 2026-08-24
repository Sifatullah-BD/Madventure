import { supabase } from '../lib/supabase';

/**
 * Madventure Unicorn OS API Layer
 * Comprehensive services for CMS, Chat, Inventory Locking, and BI.
 */

export const unicornService = {
    // 1. CMS & Marketing
    async getBanners(placement = 'home_hero') {
        const { data, error } = await supabase
            .from('cms_banners')
            .select('*')
            .eq('placement', placement)
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        if (error) throw error;
        return data;
    },

    async getPageBySlug(slug) {
        const { data, error } = await supabase
            .from('cms_pages')
            .select('*')
            .eq('slug', slug)
            .eq('is_published', true)
            .single();
        if (error) throw error;
        return data;
    },

    // 2. Inventory Locking (Race Condition Prevention)
    async createBookingLock(userId, scheduleId, seats = 1) {
        // Set expiry to 10 minutes from now
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        const { data, error } = await supabase
            .from('booking_locks')
            .insert({
                user_id: userId,
                schedule_id: scheduleId,
                locked_seats: seats,
                expires_at: expiresAt
            })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async releaseBookingLock(lockId) {
        const { error } = await supabase
            .from('booking_locks')
            .delete()
            .eq('id', lockId);
        if (error) throw error;
        return true;
    },

    // 3. Coupon & Promo Engine
    async validateCoupon(code, userId, amount) {
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', code)
            .eq('is_active', true)
            .single();
        
        if (error || !data) throw new Error('Invalid coupon code');
        
        // Check expiry
        if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
            throw new Error('Coupon has expired');
        }

        // Check usage limits
        if (data.usage_limit && data.usage_count >= data.usage_limit) {
            throw new Error('Coupon usage limit reached');
        }

        // Check min purchase
        if (amount < data.min_purchase) {
            throw new Error(`Minimum purchase of ${data.min_purchase} BDT required`);
        }

        return data;
    },

    // 4. Real-time Chat System
    async getChatRooms(userId) {
        const { data, error } = await supabase
            .from('chat_rooms')
            .select(`
                *,
                chat_participants!inner(user_id)
            `)
            .eq('chat_participants.user_id', userId);
        if (error) throw error;
        return data;
    },

    async sendMessage(roomId, senderId, message) {
        const { data, error } = await supabase
            .from('chat_messages')
            .insert({
                room_id: roomId,
                sender_id: senderId,
                message: message
            })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async getOrCreateDirectChat(userId, otherUserId, title = 'Booking contact') {
        if (!userId || !otherUserId || userId === otherUserId) throw new Error('A valid agency contact is required.');
        const { data: existing, error: existingError } = await supabase
            .from('chat_rooms')
            .select('id, title, type, chat_participants!inner(user_id)')
            .eq('type', 'direct')
            .eq('chat_participants.user_id', userId);
        if (existingError) throw existingError;
        const room = (existing || []).find(item => item.chat_participants?.some(participant => participant.user_id === otherUserId));
        if (room) return room;

        const { data: created, error: roomError } = await supabase
            .from('chat_rooms')
            .insert({ type: 'direct', title })
            .select('id, title, type')
            .single();
        if (roomError) throw roomError;
        const { error: participantError } = await supabase.from('chat_participants').insert([
            { room_id: created.id, user_id: userId },
            { room_id: created.id, user_id: otherUserId },
        ]);
        if (participantError) throw participantError;
        return created;
    },

    // 5. Business Intelligence (BI) Analytics
    async getUserSegment(userId) {
        const { data, error } = await supabase
            .from('bi_user_segments')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error) throw error;
        return data;
    },

    // 6. Verified Reviews
    async submitReview(userId, entityType, entityId, rating, review) {
        // Logic to check if user has a confirmed booking for this entity
        const { data: bookings } = await supabase
            .from('bookings')
            .select('id')
            .eq('user_id', userId)
            .eq('entity_id', entityId)
            .eq('booking_status', 'confirmed');
        
        const isVerified = (bookings && bookings.length > 0);

        const { data, error } = await supabase
            .from('reviews')
            .insert({
                user_id: userId,
                entity_type: entityType,
                entity_id: entityId,
                rating: rating,
                review: review,
                verified_booking: isVerified
            })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // 7. Advanced BI Intelligence
    async getBIMetrics() {
        const { data, error } = await supabase.rpc('get_business_growth_metrics');
        if (error) throw error;
        return data;
    },

    async getUserAnalytics(userId) {
        const { data, error } = await supabase
            .from('bi_user_segments')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error) throw error;
        return data;
    },

    async getOverallRetention() {
        // Logic to calculate retention from segments
        const { data, error } = await supabase
            .from('bi_user_segments')
            .select('segment', { count: 'exact' });
        if (error) throw error;
        return data;
    }
};
