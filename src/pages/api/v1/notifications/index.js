import { supabase } from '@/lib/db';
import { successResponse, errorResponse } from '@/utils/apiResponse';

export async function GET(req) {
  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('AUTH_001', 'Missing or invalid token', 401);
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return errorResponse('AUTH_001', 'Invalid authentication token', 401);
    }

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit')) || 20;
    const offset = parseInt(url.searchParams.get('offset')) || 0;

    const { data: notifications, error, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return errorResponse('SERVER_ERR', error.message, 500);
    }

    // Count unread
    const { count: unreadCount } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false);

    return successResponse('Notifications fetched successfully', notifications, {
      page: Math.floor(offset / limit) + 1,
      limit,
      total: count,
      unread: unreadCount
    });
  } catch (err) {
    console.error('Notifications GET error:', err);
    return errorResponse('SERVER_ERR', 'Failed to fetch notifications', 500);
  }
}

export async function PATCH(req) {
  try {
    // Auth check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse('AUTH_001', 'Missing or invalid token', 401);
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return errorResponse('AUTH_001', 'Invalid authentication token', 401);
    }

    const body = await req.json();
    const { ids, read_all } = body;

    if (read_all) {
      // Mark all as read
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      if (error) return errorResponse('SERVER_ERR', error.message, 500);
      return successResponse('All notifications marked as read');
    }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return errorResponse('VALIDATION_ERR', 'Provide notification ids or set read_all: true', 400);
    }

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .in('id', ids);

    if (error) return errorResponse('SERVER_ERR', error.message, 500);
    return successResponse('Notifications marked as read');
  } catch (err) {
    console.error('Notifications PATCH error:', err);
    return errorResponse('SERVER_ERR', 'Failed to update notifications', 500);
  }
}
