import { supabase } from '../../../lib/db';
import { broadcast } from '../../../lib/realtime';

/**
 * Fetch all posts for the community feed.
 * Supports optional query parameters: category, search (keyword).
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const keyword = searchParams.get('q');

  let query = supabase.from('posts').select('*').order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }
  if (keyword) {
    query = query.ilike('content', `%${keyword}%`);
  }

  const { data, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Create a new post.
 * Expected JSON body: { type, content, mediaUrls, category, travelDetails }
 */
export async function POST(req) {
  try {
    const { user } = await supabase.auth.api.getUserByCookie(req);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    const payload = await req.json();
    const { data, error } = await supabase.from('posts').insert([
      {
        author_id: user.id,
        type: payload.type,
        content: payload.content,
        media_urls: payload.mediaUrls || [],
        category: payload.category || null,
        travel_details: payload.travelDetails || null,
        reactions: {},
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) throw error;
    
    // Broadcast post_created event in realtime
    if (data && data[0]) {
      broadcast('post_created', data[0]);
    }

    return new Response(JSON.stringify(data[0]), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
