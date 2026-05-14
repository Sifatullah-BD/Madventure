import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Validate and Apply Coupon
 * @param {string} code 
 * @param {number} currentAmount 
 * @returns {Promise<{data: object, error: string}>}
 */
export const validateCoupon = async (code, currentAmount) => {
    if (!isSupabaseConfigured) {
        // Mock demo logic
        if (code === 'SAVE10') {
            return { data: { code, discount_type: 'percentage', discount_value: 10 }, error: null };
        }
        return { data: null, error: 'Invalid coupon code' };
    }

    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

    if (error || !data) return { data: null, error: 'Coupon not found or inactive' };

    // Check expiry
    if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
        return { data: null, error: 'Coupon has expired' };
    }

    // Check usage limit
    if (data.usage_limit && data.usage_count >= data.usage_limit) {
        return { data: null, error: 'Coupon usage limit reached' };
    }

    // Check min purchase
    if (data.min_purchase && currentAmount < data.min_purchase) {
        return { data: null, error: `Minimum purchase of ৳${data.min_purchase} required` };
    }

    return { data, error: null };
};

/**
 * Log Coupon Usage
 */
export const recordCouponUsage = async (couponId, userId, bookingId) => {
    if (!isSupabaseConfigured) return { data: true, error: null };

    const { error } = await supabase
        .from('coupon_usages')
        .insert({
            coupon_id: couponId,
            user_id: userId,
            booking_id: bookingId
        });

    if (!error) {
        // Increment usage count on the coupon
        await supabase.rpc('increment_coupon_usage', { p_coupon_id: couponId });
    }

    return { error };
};
