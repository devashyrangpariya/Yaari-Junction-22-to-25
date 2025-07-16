'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiUsers, HiX, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { FRIENDS_DATA } from '../../lib/constants';
import Button from '../ui/Button';

const FriendFilter = ({
  selectedFriends = [],
  onFriendsChange,
  availableImages = [],
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate friend statistics from available images
  const friendStats = useMemo(() => {
    const stats = {};
    
    // Initialize stats for all friends
    FRIENDS_DATA.forEach(friend => {
      stats[friend.id] = {
        ...friend,
        imageCount: 0
      };
    });

    // Count images for each friend
    availableImages.forEach(image => {
      if (image.friends && Array.isArray(image.friends)) {
        image.friends.forEach(friendId => {
          if (stats[friendId]) {
            stats[friendId].imageCount++;
          }
        });
      }
    });

    return Object.values(stats).filter(friend => friend.imageCount > 0);
  }, [availableImages]);

  // Filter friends based on search term
  const filteredFriends = useMemo(() => {
    return friendStats.filter(friend =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.funnyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [friendStats, searchTerm]);

  const handleFriendToggle = (friendId) => {
    const newSelectedFriends = selectedFriends.includes(friendId)
      ? selectedFriends.filter(id => id !== friendId)
      : [...selectedFriends, friendId];
    
    onFriendsChange(newSelectedFriends);
  };

  const handleClearAll = () => {
    onFriendsChange([]);
    setSearchTerm('');
  };

  const handleSelectAll = () => {
    const allFriendIds = filteredFriends.map(friend => friend.id);
    onFriendsChange(allFriendIds);
  };

  const selectedFriendsData = FRIENDS_DATA.filter(friend => 
    selectedFriends.includes(friend.id)
  );

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HiUsers className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Filter by Friends</h3>
            {selectedFriends.length > 0 && (
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                {selectedFriends.length}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {isExpanded ? (
              <HiChevronUp className="w-4 h-4" />
            ) : (
              <HiChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Selected Friends Preview */}
        {selectedFriends.length > 0 && !isExpanded && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedFriendsData.slice(0, 3).map(friend => (
              <motion.div
                key={friend.id}
                className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <span>{friend.name}</span>
                <button
                  onClick={() => handleFriendToggle(friend.id)}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5 transition-colors duration-200"
                >
                  <HiX className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
            {selectedFriends.length > 3 && (
              <span className="text-sm text-gray-600 dark:text-gray-400 px-2 py-1">
                +{selectedFriends.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="p-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search and Actions */}
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Search friends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
              
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={handleSelectAll}
                  disabled={filteredFriends.length === 0}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Select All ({filteredFriends.length})
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={handleClearAll}
                  disabled={selectedFriends.length === 0}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  Clear All
                </Button>
              </div>
            </div>

            {/* Friends List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredFriends.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <HiUsers className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No friends found</p>
                  {searchTerm && (
                    <p className="text-sm">Try adjusting your search</p>
                  )}
                </div>
              ) : (
                filteredFriends.map(friend => (
                  <motion.button
                    key={friend.id}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                      selectedFriends.includes(friend.id)
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-transparent'
                    }`}
                    onClick={() => handleFriendToggle(friend.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Friend Avatar */}
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {friend.name.charAt(0)}
                    </div>

                    {/* Friend Info */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{friend.name}</p>
                        {friend.nickname !== friend.name && (
                          <span className="text-xs opacity-70">"{friend.nickname}"</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs opacity-70">{friend.funnyName}</p>
                        <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                          {friend.imageCount} photo{friend.imageCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                      selectedFriends.includes(friend.id)
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedFriends.includes(friend.id) && (
                        <motion.div
                          className="w-2 h-2 bg-white rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.1 }}
                        />
                      )}
                    </div>
                  </motion.button>
                ))
              )}
            </div>

            {/* Summary */}
            {selectedFriends.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Filtering by {selectedFriends.length} friend{selectedFriends.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FriendFilter;