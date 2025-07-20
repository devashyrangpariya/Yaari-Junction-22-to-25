'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiTag, HiX } from 'react-icons/hi';
import { FRIENDS_DATA } from '@/lib/constants';

export default function FriendTagOverlay({ 
  image, 
  onTagsChange,
  className = '',
  readOnly = false
}) {
  const [taggedFriends, setTaggedFriends] = useState([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  
  // Initialize tagged friends from image data
  useEffect(() => {
    if (image && image.friends) {
      setTaggedFriends(image.friends);
    } else {
      setTaggedFriends([]);
    }
  }, [image]);
  
  // Notify parent component when tags change
  useEffect(() => {
    if (onTagsChange) {
      onTagsChange(taggedFriends);
    }
  }, [taggedFriends, onTagsChange]);
  
  const toggleFriendTag = (friendId) => {
    setTaggedFriends(prev => {
      if (prev.includes(friendId)) {
        return prev.filter(id => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Tagged friends display */}
      {taggedFriends.length > 0 && (
        <div className="absolute bottom-2 left-2 right-2 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
          <div className="flex flex-wrap gap-1">
            {taggedFriends.map(friendId => {
              const friend = FRIENDS_DATA.find(f => f.id === friendId);
              return friend ? (
                <div 
                  key={friendId}
                  className="bg-blue-500/70 rounded-full px-2 py-0.5 flex items-center"
                >
                  <span className="mr-1">{friend.name}</span>
                  {!readOnly && (
                    <button 
                      onClick={() => toggleFriendTag(friendId)}
                      className="text-white/80 hover:text-white"
                    >
                      <HiX className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
      
      {/* Tag button */}
      {!readOnly && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowTagSelector(!showTagSelector)}
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        >
          <HiTag className="w-5 h-5" />
        </motion.button>
      )}
      
      {/* Friend selector */}
      {showTagSelector && (
        <div className="absolute top-12 right-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 w-48 max-h-60 overflow-y-auto z-10">
          <h4 className="font-medium text-sm mb-2 px-2">Tag Friends</h4>
          {FRIENDS_DATA.map(friend => (
            <div 
              key={friend.id}
              onClick={() => toggleFriendTag(friend.id)}
              className={`flex items-center px-2 py-1.5 rounded-md cursor-pointer ${
                taggedFriends.includes(friend.id) 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex-shrink-0 mr-2">
                {friend.profileImage && (
                  <img 
                    src={friend.profileImage} 
                    alt={friend.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
              <span className="text-sm">{friend.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}