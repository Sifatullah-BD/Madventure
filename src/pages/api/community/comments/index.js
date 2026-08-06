import { supabase } from '../../../lib/db';

/**
 * GET comments for a specific post.
 * Query param: postId
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');
  if (!postId) {
    return new Response(JSON.stringify({ error: 'Missing postId' }), { status: 400 });
  }
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * POST a new comment.
 * Expected JSON body: { postId, content, parentCommentId (optional) }
 */
export async function POST(req) {
  try {
    const { user } = await supabase.auth.api.getUserByCookie(req);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    const payload = await req.json();
    const { postId, content, parentCommentId } = payload;
    if (!postId || !content) {
      return new Response(JSON.stringify({ error: 'postId and content required' }), { status: 400 });
    }
    const { data, error } = await supabase.from('comments').insert([
      {
        post_id: postId,
        author_id: user.id,
        content,
        parent_comment_id: parentCommentId || null,
        reactions: {},
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) throw error;
    // Optionally broadcast via realtime in future
    return new Response(JSON.stringify(data[0]), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
