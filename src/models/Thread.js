export const threadTable = 'threads';
export const threadReplyTable = 'thread_replies';
export const threadVoteTable = 'thread_votes';

// List threads with pagination and optional category/search
export const listThreads = async (supabase, { limit = 20, offset = 0, category, search }) => {
  let query = supabase.from(threadTable).select('*');
  if (category) query = query.eq('category', category);
  if (search) {
    query = query.textSearch('title', `'${search}'`, { type: 'plain' })
                 .or(`body:fts(${search})`);
  }
  const { data, error, count } = await query.range(offset, offset + limit - 1).order('created_at', { ascending: false });
  if (error) throw error;
  return { threads: data, total: count };
};

export const getThread = async (supabase, threadId) => {
  const { data, error } = await supabase.from(threadTable).select('*').eq('id', threadId).single();
  if (error) throw error;
  return data;
};

export const createThread = async (supabase, threadData) => {
  const { data, error } = await supabase.from(threadTable).insert([threadData]).single();
  if (error) throw error;
  return data;
};

export const updateThread = async (supabase, threadId, updates) => {
  const { data, error } = await supabase.from(threadTable).update(updates).eq('id', threadId).single();
  if (error) throw error;
  return data;
};

export const deleteThread = async (supabase, threadId) => {
  const { error } = await supabase.from(threadTable).delete().eq('id', threadId);
  if (error) throw error;
  return true;
};

// Replies
export const addReply = async (supabase, replyData) => {
  const { data, error } = await supabase.from(threadReplyTable).insert([replyData]).single();
  if (error) throw error;
  return data;
};

export const getReplies = async (supabase, threadId) => {
  const { data, error } = await supabase.from(threadReplyTable).select('*').eq('thread_id', threadId).order('created_at', { ascending: true });
  if (error) throw error;
  return data;
};

// Voting
export const voteThread = async (supabase, { threadId, userId, voteType }) => {
  // Upsert vote (1 for upvote, -1 for downvote)
  const { data, error } = await supabase
    .from(threadVoteTable)
    .upsert({ thread_id: threadId, user_id: userId, vote_type: voteType }, { onConflict: ['thread_id', 'user_id'] })
    .select()
    .single();
  if (error) throw error;

  // Recalculate upvotes/downvotes
  const { data: agg, error: aggErr } = await supabase
    .rpc('calc_thread_votes', { p_thread_id: threadId }); // Assuming a PG function; fallback skip
  if (!aggErr && agg) {
    await supabase.from(threadTable).update({ upvotes: agg.upvotes, downvotes: agg.downvotes }).eq('id', threadId);
  }
  return data;
};

// ── Moderation ──────────────────────────────────────────────
export const hideThread = async (supabase, threadId, hidden = true) => {
  const { data, error } = await supabase
    .from(threadTable)
    .update({ is_hidden: hidden })
    .eq('id', threadId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const hideReply = async (supabase, replyId, hidden = true) => {
  const { data, error } = await supabase
    .from(threadReplyTable)
    .update({ is_hidden: hidden })
    .eq('id', replyId)
    .select()
    .single();
  if (error) throw error;
  return data;
};
