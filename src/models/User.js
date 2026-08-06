// src/models/User.js
// Supabase table: profiles (or users)
// Extended profile fields for community features
export const userTable = "profiles";

export const getUserById = async (supabase, userId) => {
  const { data, error } = await supabase
    .from(userTable)
    .select(
      "id, avatar_url, cover_url, bio, location, favorite_destinations, badges, followers, following, points, joined_at"
    )
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (supabase, userId, updates) => {
  const { data, error } = await supabase
    .from(userTable)
    .update(updates)
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
};
