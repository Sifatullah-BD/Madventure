export const wishlistTable = 'wishlists';

export const addToWishlist = async (supabase, { userId, itemType, itemId }) => {
  const { data, error } = await supabase.from(wishlistTable).insert([
    { user_id: userId, item_type: itemType, item_id: itemId }
  ]).single();
  if (error) throw error;
  return data;
};

export const removeFromWishlist = async (supabase, { userId, itemType, itemId }) => {
  const { error } = await supabase.from(wishlistTable)
    .delete()
    .eq('user_id', userId)
    .eq('item_type', itemType)
    .eq('item_id', itemId);
  if (error) throw error;
  return true;
};

export const getUserWishlist = async (supabase, userId) => {
  const { data, error } = await supabase.from(wishlistTable)
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
};
