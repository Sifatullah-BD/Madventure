// src/components/community/ReactionPicker.jsx
import React from 'react';
// import removed; supabase not needed in this component

// Default emoji set as confirmed
const EMOJIS = ['👍', '❤️', '😂', '🎉', '😮', '😢', '🙏'];

const ReactionPicker = ({ postId, userId, currentReactions, setReactions }) => {
  const handleClick = async (emoji) => {
    const res = await fetch('/api/community/reactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: postId, user_id: userId, emoji }),
    });
    const data = await res.json();
    if (data.emojis) {
      setReactions(data.emojis);
    } else if (data.reactions) {
      setReactions(data.reactions);
    }
  };

  return (
    <div className="flex space-x-2 mt-2">
      {EMOJIS.map((e) => (
        <button
          key={e}
          onClick={() => handleClick(e)}
          className="text-xl hover:scale-125 transition-transform"
        >
          {e}
        </button>
      ))}
    </div>
  );
};

export default ReactionPicker;
