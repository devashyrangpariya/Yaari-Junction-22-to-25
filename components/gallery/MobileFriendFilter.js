'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiUsers, HiChevronDown, HiX } from 'react-icons/hi';
import { ProfileImage } from '../ui/ResponsiveImage';
import TouchGestureWrapper from '../ui/TouchGestureWrapper';
import { getDeviceCapabilities } from '../../lib/mobileOptimizations';
import { FRIENDS_DATA } from '../../lib/constants';

export default function MobileFriendFilter({
  selectedFriends = [],
  onFriendsChange,
  availableImages = [],
  className = ''
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState(null);
  const [friendCounts, setFriendCounts] = useState({});

  useEffect(() => {
    const capabilities = getDeviceCapabilities();
    setDeviceCapabilities(capabilities);

    // Calculate friend counts from available images
    const counts = {};
    FRIENDS_DATA.forEach(friend => {
      counts[friend.id] = availableImages.filter(image => 
        image.friends && image.friends.includes(friend.id)
      ).length;
    });
    setFriendCounts(counts);
  }, [availableImages]);

  const handleFriendToggle = (friendId) => {
    const newSelection = selectedFriends.includes(friendId)
      ? selectedFriends.filter(id => id !== friendId)
      : [...selectedFriends, friendId];
    
    onFriendsChange(newSelection);
  };

  const clearAllFriends = () => {
    onFriendsChange([]);
  };

  const getVisibleFriends = () => {
    // Show friends with images first, sorted by count
    return FRIENDS_DATA
      .filter(friend => friendCounts[friend.id] > 0)
      .sort((a, b) => friendCounts[b.id] - friendCounts[a.id]);
  };

  const getSelectedFriendsPreview = () => {
    return selectedFriends
      .map(id => FRIENDS_DATA.find(f => f.id === id))
      .filter(Boolean)
      .slice(0, 3);
  };

  if (!deviceCapabilities) {
    return null;
  }

  const visibleFriends = getVisibleFriends();
  const selectedPreview = getSelectedFriendsPreview();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header - Always visible */}
      <TouchGestureWrapper
        onTap={() => setIsExpanded(!isExpanded)}
        className="p-4 cursor-pointer touch-manipulation"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <HiUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Filter by Friends
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedFriends.length > 0 
                  ? `${selectedFriends.length} selected`
                  : 'Tap to select friends'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Selected friends preview */}
            {selectedPreview.length > 0 && (
              <div className="flex -space-x-2">
                {selectedPreview.map(friend => (
                  <ProfileImage
                    key={friend.id}
                    src={friend.profileImage}
                    alt={friend.name}
                    size="sm"
                    className="border-2 border-white dark:border-gray-800"
                  />
                ))}
                {selectedFriends.length > 3 && (
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      +{selectedFriends.length - 3}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <HiChevronDown className="w-5 h-5 text-gray-400" />
            </motion.div>
          </div>
        </div>
      </TouchGestureWrapper>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {/* Clear all button */}
              {selectedFriends.length > 0 && (
                <div className="flex justify-end mb-3">
                  <TouchGestureWrapper onTap={clearAllFriends}>
                    <button className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors touch-manipulation min-h-8">
                      <HiX className="w-4 h-4" />
                      <span>Clear all</span>
                    </button>
                  </TouchGestureWrapper>
                </div>
              )}

              {/* Friends grid - optimized for mobile */}
              <div className={`grid gap-3 ${
                deviceCapabilities.isMobile 
                  ? 'grid-cols-2' 
                  : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5'
              }`}>
                {visibleFriends.map(friend => {
                  const isSelected = selectedFriends.includes(friend.id);
                  const imageCount = friendCounts[friend.id] || 0;
                  
                  return (
                    <TouchGestureWrapper
                      key={friend.id}
                      onTap={() => handleFriendToggle(friend.id)}
                    >
                      <motion.div
                        className={`p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer touch-manipulation ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-center">
                          <div className="relative mb-2">
                            <ProfileImage
                              src={friend.profileImage}
                              alt={friend.name}
                              size={deviceCapabilities.isMobile ? 'md' : 'lg'}
                              className="mx-auto"
                            />
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          <h4 className={`font-medium text-sm truncate ${
                            isSelected 
                              ? 'text-blue-700 dark:text-blue-300' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {friend.name}
                          </h4>
                          
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {imageCount} photo{imageCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </motion.div>
                    </TouchGestureWrapper>
                  );
                })}
              </div>

              {/* No friends message */}
              {visibleFriends.length === 0 && (
                <div className="text-center py-8">
                  <HiUsers className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No friends found in current images
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile-specific quick actions */}
      {deviceCapabilities.isMobile && selectedFriends.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Filtering by {selectedFriends.length} friend{selectedFriends.length !== 1 ? 's' : ''}
            </span>
            <TouchGestureWrapper onTap={clearAllFriends}>
              <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors touch-manipulation min-h-8 px-2">
                Clear
              </button>
            </TouchGestureWrapper>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for mobile headers
export function CompactFriendFilter({
  selectedFriends = [],
  onFriendsChange,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedCount = selectedFriends.length;
  const selectedPreview = selectedFriends
    .map(id => FRIENDS_DATA.find(f => f.id === id))
    .filter(Boolean)
    .slice(0, 2);

  return (
    <div className={`relative ${className}`}>
      <TouchGestureWrapper onTap={() => setIsOpen(!isOpen)}>
        <button className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-manipulation min-h-10">
          <HiUsers className="w-4 h-4" />
          {selectedCount > 0 ? (
            <div className="flex items-center space-x-1">
              <div className="flex -space-x-1">
                {selectedPreview.map(friend => (
                  <ProfileImage
                    key={friend.id}
                    src={friend.profileImage}
                    alt={friend.name}
                    size="sm"
                    className="border border-white dark:border-gray-800"
                  />
                ))}
              </div>
              <span>+{selectedCount > 2 ? selectedCount - 2 : 0}</span>
            </div>
          ) : (
            <span>Friends</span>
          )}
          <HiChevronDown className="w-4 h-4" />
        </button>
      </TouchGestureWrapper>

      {/* Dropdown overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 z-50"
            >
              <MobileFriendFilter
                selectedFriends={selectedFriends}
                onFriendsChange={(friends) => {
                  onFriendsChange(friends);
                  setIsOpen(false);
                }}
                className="shadow-xl"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}