// src/models/Post.js
// Supabase table: posts
// Post model with CRUD helpers for community MVP
export const postTable = "posts";

export const createPost = async (supabase, { author_id, type, content, media_urls = [], category = null, travel_details = null }) => {
  const { data, error } = await supabase.from(postTable).insert([
    { author_id, type, content, media_urls, category, travel_details },
  ]).single();
  if (error) throw error;
  return data;
};

export const getPostById = async (supabase, postId) => {
  const { data, error } = await supabase.from(postTable).select("*, author:author_id (id, avatar_url, username)").eq("id", postId).single();
  if (error) throw error;
  return data;
};

export const listPosts = async (supabase, { limit = 20, offset = 0, category = null, search = null } = {}) => {
  let query = supabase.from(postTable).select("*", { count: "exact" }).order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (category) query = query.eq("category", category);
  if (search) query = query.ilike("content", `%${search}%`);
  const { data, error, count } = await query;
  if (error) throw error;
  return { posts: data, total: count };
};

