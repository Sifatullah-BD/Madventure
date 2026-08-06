// src/models/Comment.js
// Supabase table: comments
// Simple single-level comment model for MVP
export const commentTable = "comments";

export const addComment = async (supabase, { post_id, author_id, content }) => {
  const { data, error } = await supabase.from(commentTable).insert([
    { post_id, author_id, content },
  ]).single();
  if (error) throw error;
  return data;
};

export const getCommentsByPost = async (supabase, postId) => {
  const { data, error } = await supabase
    .from(commentTable)
    .select("*, author:author_id (id, avatar_url, username)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
};

export const deleteComment = async (supabase, commentId) => {
  const { data, error } = await supabase.from(commentTable).delete().eq("id", commentId).single();
  if (error) throw error;
  return data;
};

// ── Moderation ──────────────────────────────────────────────
export const hideComment = async (supabase, commentId, hidden = true) => {
  const { data, error } = await supabase
    .from(commentTable)
    .update({ is_hidden: hidden })
    .eq("id", commentId)
    .select()
    .single();
  if (error) throw error;
  return data;
};
