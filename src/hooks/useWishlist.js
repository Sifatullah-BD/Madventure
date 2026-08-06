import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/db';
import { useAuth } from './useAuth';

/**
 * useWishlist – Manage the current user's wishlist with optimistic UI.
 *
 * @param {object}  opts
 * @param {boolean} opts.enabled – skip fetching when false or user not logged in
 */
export const useWishlist = ({ enabled = true } = {}) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = useCallback(async () => {
    if (!enabled || !user) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;
      setItems(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user, enabled]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Check if a specific item is in the wishlist
  const isInWishlist = useCallback((itemType, itemId) => {
    return items.some((w) => w.item_type === itemType && w.item_id === itemId);
  }, [items]);

  // Add item to wishlist (optimistic)
  const addItem = useCallback(async (itemType, itemId) => {
    if (!user) throw new Error('Must be logged in');

    // Optimistic add
    const tempItem = {
      id: `temp-${Date.now()}`,
      user_id: user.id,
      item_type: itemType,
      item_id: itemId,
      created_at: new Date().toISOString(),
    };
    setItems((prev) => [tempItem, ...prev]);

    try {
      const { data, error: insertErr } = await supabase
        .from('wishlists')
        .insert([{ user_id: user.id, item_type: itemType, item_id: itemId }])
        .select()
        .single();

      if (insertErr) throw insertErr;
      // Replace temp with real data
      setItems((prev) => prev.map((i) => (i.id === tempItem.id ? data : i)));
      return data;
    } catch (err) {
      // Rollback optimistic add
      setItems((prev) => prev.filter((i) => i.id !== tempItem.id));
      throw err;
    }
  }, [user]);

  // Remove item from wishlist (optimistic)
  const removeItem = useCallback(async (itemType, itemId) => {
    if (!user) throw new Error('Must be logged in');

    // Save for rollback
    const removed = items.find((w) => w.item_type === itemType && w.item_id === itemId);
    setItems((prev) => prev.filter((w) => !(w.item_type === itemType && w.item_id === itemId)));

    try {
      const { error: delErr } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('item_type', itemType)
        .eq('item_id', itemId);

      if (delErr) throw delErr;
    } catch (err) {
      // Rollback
      if (removed) setItems((prev) => [removed, ...prev]);
      throw err;
    }
  }, [user, items]);

  // Toggle wishlist item
  const toggleItem = useCallback(async (itemType, itemId) => {
    if (isInWishlist(itemType, itemId)) {
      await removeItem(itemType, itemId);
      return false; // removed
    } else {
      await addItem(itemType, itemId);
      return true; // added
    }
  }, [isInWishlist, removeItem, addItem]);

  return {
    items,
    loading,
    error,
    isInWishlist,
    addItem,
    removeItem,
    toggleItem,
    refetch: fetchWishlist,
    count: items.length,
  };
};

export default useWishlist;
