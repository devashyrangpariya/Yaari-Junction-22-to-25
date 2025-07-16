'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiPlus, HiCheck, HiLightBulb } from 'react-icons/hi';
import { FRIENDS_DATA } from '../../lib/constants';
import { suggestFriendsToTag } from '../../lib/friendTagging';
import Button from '../ui/Button';

const FriendTagOverlay = ({
  image,
  isVisible,
  onToggle,
  onTagsUpdate,
  className = ''
}) => {
  const [taggedFriends, setTaggedFriends] = useState(image?.friends || []);
  const [showAddMode, setShowAddMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Update tagged friends when image changes
  useEffect(() => {
    setTaggedFriends(image?.friends || []);
  }, [image?.id]);

  // Filter friends based on search term
  const filteredFriends = FRIENDS_DATA.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get friend data for tagged friends
  const getTaggedFriendsData = () => {
    return FRIENDS_DATA.filter(friend => taggedFriends.includes(friend.id));
  };

  const handleToggleFriend = (friendId) => {
    const newTaggedFriends = taggedFriends.includes(friendId)
      ? taggedFriends.filter(id => id !== friendId)
      : [...taggedFriends, friendId];
    
    setTaggedFriends(newTaggedFriends);
    
    // Notify parent component of changes
    if (onTagsUpdate) {
      onTagsUpdate(image.id, newTaggedFriends);
    }
  };

  const handleSaveChanges = () => {
    setShowAddMode(false);
    setSearchTerm('');
  };

  const taggedFriendsData = getTaggedFriendsData();

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`absolute inset-0 pointer-events-none ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Existing Friend Tags */}
        {taggedFriendsData.map((friend, index) => (
          <motion.div
            key={friend.id}
            className="absolute bg-blue-500/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm pointer-events-auto cursor-pointer hover:bg-blue-600/90 transition-colors duration-200 group"
            style={{
              left: `${15 + index * 12}%`,
              top: `${25 + index * 8}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleToggleFriend(friend.id)}
          >
            <div className="flex items-center space-x-1">
              <span>{friend.name}</span>
              <HiX className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </motion.div>
        ))}

        {/* Add Friend Button */}
        {!showAddMode && (
          <motion.button
            className="absolute bottom-4 right-4 bg-green-500/90 hover:bg-green-600/90 text-white p-3 rounded-full backdrop-blur-sm pointer-events-auto transition-colors duration-200"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddMode(true)}
          >
            <HiPlus className="w-5 h-5" />
          </motion.button>
        )}

        {/* Add Friend Panel */}
        <AnimatePresence>
          {showAddMode && (
            <motion.div
              className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 pointer-events-auto min-w-[280px] max-w-[320px]"
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Tag Friends</h3>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setShowAddMode(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <HiX className="w-4 h-4" />
                </Button>
              </div>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Search friends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 mb-3"
                autoFocus
              />

              {/* Friends List */}
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredFriends.map(friend => (
                  <motion.button
                    key={friend.id}
                    className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors duration-200 ${
                      taggedFriends.includes(friend.id)
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => handleToggleFriend(friend.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {friend.name.charAt(0)}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{friend.name}</p>
                      <p className="text-xs opacity-70">{friend.nickname}</p>
                    </div>
                    {taggedFriends.includes(friend.id) && (
                      <HiCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {taggedFriends.length} friend{taggedFriends.length !== 1 ? 's' : ''} tagged
                </span>
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleSaveChanges}
                  className="px-4 py-2"
                >
                  Done
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default FriendTagOverlay;