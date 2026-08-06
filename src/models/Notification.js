// Notification model field definitions for Supabase
export const NotificationFields = {
  id: 'id', // UUID
  user_id: 'user_id', // recipient
  type: 'type', // like, comment, reply, follow
  payload: 'payload', // JSON with details (e.g., postId, commentId)
  read: 'read', // boolean
  created_at: 'created_at',
};
