import React from 'react';
import Avatar from '../../ui/Avatar';
import Button from '../../ui/Button';

export default function GroupHeader({ group, onJoinToggle }) {
  const {
    coverImage,
    avatarImage,
    name,
    description,
    privacy,
    memberCount,
    isMember,
  } = group;

  return (
    <div className="relative bg-gray-900 text-white rounded-xl overflow-hidden">
      {/* Cover Image */}
      {coverImage ? (
        <img src={coverImage} alt="Group cover" className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-800" />
      )}
      {/* Avatar and basic info */}
      <div className="absolute left-6 top-32 flex items-center">
        <Avatar src={avatarImage} size={96} className="border-4 border-white" />
        <div className="ml-4">
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-sm opacity-80 line-clamp-2 max-w-md">{description}</p>
          <div className="flex items-center text-xs opacity-70 mt-1">
            <span>{memberCount?.toLocaleString()} members</span>
            <span className="mx-2">·</span>
            <span className="capitalize">{privacy}</span>
          </div>
        </div>
      </div>
      {/* Action buttons */}
      <div className="absolute right-4 top-4 flex space-x-2">
        <Button
          variant={isMember ? 'secondary' : 'primary'}
          onClick={onJoinToggle}
        >
          {isMember ? 'Joined' : 'Join'}
        </Button>
        <Button variant="secondary" onClick={() => {/* share logic */}}>
          Share
        </Button>
      </div>
    </div>
  );
}
