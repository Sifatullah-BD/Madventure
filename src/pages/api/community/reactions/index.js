import { supabase } from '@/lib/db';
import { broadcast } from '@/lib/realtime';
import { createNotification } from '@/models/Notification';

/**
 * GET reactions for a specific post.
 * Query param: postId
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');
  if (!postId) {
    return new Response(JSON.stringify({ error: 'Missing postId' }), { status: 400 });
  }
  const { data, error } = await supabase
    .from('posts')
    .select('reactions')
    .eq('id', postId)
    .single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ reactions: data.reactions || {} }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * POST toggle a reaction for a post.
 * Expected JSON body: { postId, emoji }
 * User must be authenticated.
 */
export async function POST(req) {
  try {
    const { user } = await supabase.auth.api.getUserByCookie(req);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    const { postId, emoji } = await req.json();
    if (!postId || !emoji) {
      return new Response(JSON.stringify({ error: 'postId and emoji required' }), { status: 400 });
    }
    // Fetch current reactions
    const { data: post, error: fetchErr } = await supabase
      .from('posts')
      .select('author_id, reactions')
      .eq('id', postId)
      .single();
    if (fetchErr) throw fetchErr;
    const current = post.reactions || {};
    // Initialize user reactions map if needed
    if (!current[user.id]) {
      current[user.id] = {};
    }
    // Toggle reaction for this emoji
    const userReactions = current[user.id];
    let action = '';
    if (userReactions[emoji]) {
      // Remove reaction
      delete userReactions[emoji];
      action = 'removed';
    } else {
      // Add reaction
      userReactions[emoji] = true;
      action = 'added';
    }
    // Update the post record
    const { error: updateErr } = await supabase
      .from('posts')
      .update({ reactions: current })
      .eq('id', postId);
    if (updateErr) throw updateErr;

    // Create notification for the post author (if not self and action was added)
    if (action === 'added' && post.author_id && post.author_id !== user.id) {
      await createNotification(supabase, {
        user_id: post.author_id,
        type: 'reaction',
        payload: {
          postId,
          emoji,
          fromUserId: user.id,
          message: `${user.id} reacted with ${emoji}`,
        },
      });
    }
    // Broadcast reaction update
    await broadcast('reaction_added', { post_id: postId, user_id: user.id, emoji, reactions: current });
    return new Response(JSON.stringify({ success: true, reactions: current }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
