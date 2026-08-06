import { supabase } from '@/lib/db';
import { successResponse, errorResponse, createdResponse } from '@/utils/apiResponse';
import { addToWishlist, removeFromWishlist, getUserWishlist } from '@/models/Wishlist';

export async function GET(req) {
  try {
    // Auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('AUTH_001', 'Missing token', 401);
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return errorResponse('AUTH_001', 'Invalid token', 401);

    const wishlist = await getUserWishlist(supabase, user.id);
    return successResponse('Wishlist fetched', wishlist);
  } catch (err) {
    console.error('Wishlist GET error:', err);
    return errorResponse('SERVER_ERR', 'Failed to fetch wishlist', 500);
  }
}

export async function POST(req) {
  try {
    // Auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('AUTH_001', 'Missing token', 401);
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return errorResponse('AUTH_001', 'Invalid token', 401);

    const { item_type, item_id } = await req.json();
    if (!item_type || !item_id) {
      return errorResponse('VALIDATION_ERR', 'item_type and item_id required', 400);
    }
    const result = await addToWishlist(supabase, { userId: user.id, itemType: item_type, itemId: item_id });
    return createdResponse('Added to wishlist', result);
  } catch (err) {
    console.error('Wishlist POST error:', err);
    return errorResponse('SERVER_ERR', 'Failed to add to wishlist', 500);
  }
}

export async function DELETE(req) {
  try {
    // Auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('AUTH_001', 'Missing token', 401);
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return errorResponse('AUTH_001', 'Invalid token', 401);

    const { item_type, item_id } = await req.json();
    if (!item_type || !item_id) {
      return errorResponse('VALIDATION_ERR', 'item_type and item_id required', 400);
    }
    await removeFromWishlist(supabase, { userId: user.id, itemType: item_type, itemId: item_id });
    return successResponse('Removed from wishlist');
  } catch (err) {
    console.error('Wishlist DELETE error:', err);
    return errorResponse('SERVER_ERR', 'Failed to remove from wishlist', 500);
  }
}
