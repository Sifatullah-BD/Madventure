// src/pages/api/community/notifications/index.js
// API for fetching and marking notifications as read
import { supabase } from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth'; // helper to get user (if exists)

/**
 * GET unread notifications for the authenticated user.
 */
export async function GET(req) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .eq('read', false)
    .order('created_at', { ascending: false });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

/**
 * PATCH to mark one or more notifications as read.
 * Expected body: { ids: [<notification_id>, ...] }
 */
export async function PATCH(req) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const { ids } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return new Response(JSON.stringify({ error: 'ids array required' }), { status: 400 });
  }
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .in('id', ids);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ success: true, updated: data }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
