import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sampleBusinesses, sampleListings, sampleReviews, pendingBusinesses } from '../data/businessData';

/**
 * Business Service Layer
 * Hybrid mode: Uses Supabase if configured, otherwise falls back to mock data.
 */
export const businessService = {

    // ─── Businesses ──────────────────────────────────
    async getBusinesses({ category, district, sort, search, priceRange } = {}) {
        if (!isSupabaseConfigured) {
            let results = [...sampleBusinesses].filter(b => b.isApproved);
            if (category && category !== 'ALL') results = results.filter(b => b.category === category);
            if (district) results = results.filter(b => b.district === district);
            if (search) {
                const term = search.toLowerCase();
                results = results.filter(b =>
                    b.name.toLowerCase().includes(term) ||
                    b.description.toLowerCase().includes(term) ||
                    b.district.toLowerCase().includes(term)
                );
            }
            return results;
        }

        let query = supabase.from('businesses').select('*').eq('is_approved', true);

        if (category && category !== 'ALL') query = query.eq('category', category);
        if (district) query = query.eq('district', district);
        if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,district.ilike.%${search}%`);

        // Sort
        switch (sort) {
            case 'rating': query = query.order('rating', { ascending: false }); break;
            case 'newest': query = query.order('created_at', { ascending: false }); break;
            case 'popular': query = query.order('view_count', { ascending: false }); break;
            default: query = query.order('view_count', { ascending: false }); break;
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    },

    async getBusinessBySlug(slug) {
        if (!isSupabaseConfigured) {
            return sampleBusinesses.find(b => b.slug === slug) || null;
        }
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('slug', slug)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async getFeaturedBusinesses() {
        if (!isSupabaseConfigured) {
            return sampleBusinesses.filter(b => b.isFeatured && b.isApproved);
        }
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('is_featured', true)
            .eq('is_approved', true);
        if (error) throw error;
        return data;
    },

    async getSimilarBusinesses(category, excludeId, limit = 3) {
        if (!isSupabaseConfigured) {
            return sampleBusinesses
                .filter(b => b.category === category && b.id !== excludeId && b.isApproved)
                .slice(0, limit);
        }
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('category', category)
            .neq('id', excludeId)
            .eq('is_approved', true)
            .limit(limit);
        if (error) throw error;
        return data;
    },

    // ─── Listings ────────────────────────────────────
    async getListingsByBusiness(businessId) {
        if (!isSupabaseConfigured) {
            return sampleListings.filter(l => l.businessId === businessId);
        }
        const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('business_id', businessId);
        if (error) throw error;
        return data;
    },

    // ─── Reviews ────────────────────────────────────
    async getReviewsByBusiness(businessId) {
        if (!isSupabaseConfigured) {
            return sampleReviews.filter(r => r.businessId === businessId);
        }
        const { data, error } = await supabase
            .from('reviews')
            .select('*, profiles(full_name, avatar_url)')
            .eq('entity_id', businessId);
        if (error) throw error;
        // Transform to match UI expectation if needed
        return data.map(r => ({
            ...r,
            userName: r.profiles?.full_name || 'Anonymous',
            userAvatar: r.profiles?.avatar_url
        }));
    },

    async addReview(businessId, review) {
        if (!isSupabaseConfigured) {
            const newReview = { id: `rev-${Date.now()}`, businessId, ...review, createdAt: new Date().toISOString() };
            sampleReviews.push(newReview);
            return newReview;
        }
        const { data, error } = await supabase
            .from('reviews')
            .insert({
                entity_id: businessId,
                entity_type: 'business',
                rating: review.rating,
                comment: review.comment,
                user_id: review.userId
            })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // ─── Bookings ───────────────────────────────────
    async createBooking(bookingData) {
        if (!isSupabaseConfigured) {
            return { id: `bk-${Date.now()}`, ...bookingData, status: 'PENDING' };
        }
        const { data, error } = await supabase
            .from('bookings')
            .insert({
                user_id: bookingData.userId,
                entity_id: bookingData.businessId,
                entity_type: 'business',
                booking_date: bookingData.date,
                total_price: bookingData.totalPrice,
                extras: bookingData
            })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // ─── Admin ──────────────────────────────────────
    async getPendingBusinesses() {
        if (!isSupabaseConfigured) return pendingBusinesses;
        const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .eq('is_approved', false);
        if (error) throw error;
        return data;
    },

    async approveBusiness(id) {
        if (!isSupabaseConfigured) return { success: true, id };
        const { error } = await supabase
            .from('businesses')
            .update({ is_approved: true })
            .eq('id', id);
        if (error) throw error;
        return { success: true, id };
    },

    async rejectBusiness(id, reason) {
        if (!isSupabaseConfigured) return { success: true, id, reason };
        // Could move to a rejected_businesses table or just delete
        const { error } = await supabase
            .from('businesses')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return { success: true, id, reason };
    },

    // ─── Registration ───────────────────────────────
    async registerBusiness(formData) {
        if (!isSupabaseConfigured) {
            return { id: `biz-${Date.now()}`, ...formData, isApproved: false };
        }
        const slug = formData.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
        const { data, error } = await supabase
            .from('businesses')
            .insert({
                ...formData,
                slug,
                owner_id: formData.ownerId,
                is_approved: false
            })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // ─── Stats (for dashboard) ──────────────────────
    async getBusinessStats(businessId) {
        if (!isSupabaseConfigured) {
            const biz = sampleBusinesses.find(b => b.id === businessId);
            if (!biz) return null;
            return {
                totalBookings: biz.bookingCount,
                revenue: biz.bookingCount * 2500,
                avgRating: biz.rating,
                totalReviews: biz.reviewCount,
                totalViews: biz.viewCount,
                monthlyBookings: [12, 18, 25, 22, 30, 28, 35, 40, 38, 45, 42, 50],
            };
        }
        // Complex aggregation would usually be an RPC or a view
        const { data, error } = await supabase.rpc('get_business_stats', { p_business_id: businessId });
        if (error) throw error;
        return data;
    },
};
