import { supabase } from '../../lib/supabase';

const VENDOR_SELECT = `
  *,
  guide_profiles(*),
  transport_vehicles(*),
  food_menus(*)
`;

export const marketplaceService = {
  async getVendors(type, districtId) {
    let query = supabase
      .from('vendors')
      .select(VENDOR_SELECT)
      .eq('status', 'active')
      .eq('vendor_type', type)
      .order('created_at', { ascending: false });

    if (districtId) {
      query = query.eq('district_id', districtId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  async getVendorBySlug(slug) {
    const { data, error } = await supabase
      .from('vendors')
      .select(VENDOR_SELECT)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  async bookGuide(bookingData) {
    const { data, error } = await supabase
      .from('guide_bookings')
      .insert(bookingData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async bookTransport(bookingData) {
    const { data, error } = await supabase
      .from('transport_bookings')
      .insert(bookingData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async placeFoodOrder(orderData) {
    const { data, error } = await supabase
      .from('food_orders')
      .insert(orderData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getNearbyVendors(lat, lng, radiusKm = 10) {
    const { data, error } = await supabase.rpc('get_nearby_vendors', {
      user_lat: lat,
      user_lng: lng,
      radius_km: radiusKm
    });

    if (error) throw error;
    return data ?? [];
  }
};
