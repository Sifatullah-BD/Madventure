import { supabase } from '../../../lib/db';

/**
 * GET a single post by ID.
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing post ID' }), { status: 400 });
  }
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 404 });
  }
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

/**
 * PATCH update a post (only author can edit).
 */
export async function PATCH(req) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const { id, ...updates } = await req.json();
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing post ID' }), { status: 400 });
  }
  // Verify ownership
  const { data: existing, error: fetchErr } = await supabase.from('posts').select('author_id').eq('id', id).single();
  if (fetchErr || existing.author_id !== user.id) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }
  const { data, error } = await supabase.from('posts').update(updates).eq('id', id).select();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data[0]), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

/**
 * DELETE a post (author or admin).
 */
export async function DELETE(req) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const { id } = await req.json();
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing post ID' }), { status: 400 });
  }
  // Verify ownership (or admin role – not implemented here)
  const { data: existing, error: fetchErr } = await supabase.from('posts').select('author_id').eq('id', id).single();
  if (fetchErr || existing.author_id !== user.id) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(null, { status: 204 });
}
