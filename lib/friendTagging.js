'use client';

import { getFromStorage, setToStorage } from './utils';
import { useState, useEffect } from 'react';

// Storage key for friend tags
const FRIEND_TAGS_STORAGE_KEY = 'college-gallery-friend-tags';

// Get friend tags for a specific image
export function getImageTags(imageId) {
  const allTags = getFromStorage(FRIEND_TAGS_STORAGE_KEY, {});
  return allTags[imageId] || [];
}

// Update friend tags for a specific image
export function updateImageTags(imageId, friendIds) {
  const allTags = getFromStorage(FRIEND_TAGS_STORAGE_KEY, {});
  
  if (friendIds.length === 0) {
    delete allTags[imageId];
  } else {
    allTags[imageId] = friendIds;
  }
  
  setToStorage(FRIEND_TAGS_STORAGE_KEY, allTags);
  
  // Dispatch custom event for components to listen to
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('friendTagsUpdated', {
      detail: { imageId, friendIds }
    }));
  }
}

// Add a friend tag to an image
export function addFriendTag(imageId, friendId) {
  const currentTags = getImageTags(imageId);
  if (!currentTags.includes(friendId)) {
    updateImageTags(imageId, [...currentTags, friendId]);
  }
}

// Remove a friend tag from an image
export function removeFriendTag(imageId, friendId) {
  const currentTags = getImageTags(imageId);
  updateImageTags(imageId, currentTags.filter(id => id !== friendId));
}

// Toggle a friend tag on an image
export function toggleFriendTag(imageId, friendId) {
  const currentTags = getImageTags(imageId);
  if (currentTags.includes(friendId)) {
    removeFriendTag(imageId, friendId);
  } else {
    addFriendTag(imageId, friendId);
  }
}

// Get all images that contain a specific friend
export function getImagesWithFriend(friendId, allImages = []) {
  const allTags = getFromStorage(FRIEND_TAGS_STORAGE_KEY, {});
  const imageIds = Object.keys(allTags).filter(imageId => 
    allTags[imageId].includes(friendId)
  );
  
  return allImages.filter(image => imageIds.includes(image.id));
}

// Get all images that contain any of the specified friends
export function getImagesByFriends(friendIds = [], allImages = []) {
  if (friendIds.length === 0) return allImages;
  
  const allTags = getFromStorage(FRIEND_TAGS_STORAGE_KEY, {});
  const imageIds = Object.keys(allTags).filter(imageId => 
    allTags[imageId].some(id => friendIds.includes(id))
  );
  
  // Filter images by IDs and also include images that have friends property matching any friendId
  return allImages.filter(image => 
    imageIds.includes(image.id) || 
    (image.friends && image.friends.some(id => friendIds.includes(id)))
  );
}

// Get friend tag statistics
export function getFriendTagStats(allImages = []) {
  const allTags = getFromStorage(FRIEND_TAGS_STORAGE_KEY, {});
  const stats = {};
  
  // Initialize stats for all friends
  Object.values(allTags).flat().forEach(friendId => {
    if (!stats[friendId]) {
      stats[friendId] = 0;
    }
  });
  
  // Count occurrences
  Object.values(allTags).forEach(friendIds => {
    friendIds.forEach(friendId => {
      stats[friendId] = (stats[friendId] || 0) + 1;
    });
  });
  
  return stats;
}

// Export all friend tags data
export function exportFriendTags() {
  return getFromStorage(FRIEND_TAGS_STORAGE_KEY, {});
}

// Import friend tags data
export function importFriendTags(tagsData) {
  setToStorage(FRIEND_TAGS_STORAGE_KEY, tagsData);
  
  // Dispatch update event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('friendTagsImported', {
      detail: { tagsData }
    }));
  }
}

// Clear all friend tags
export function clearAllFriendTags() {
  setToStorage(FRIEND_TAGS_STORAGE_KEY, {});
  
  // Dispatch clear event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('friendTagsCleared'));
  }
}

// Hook for listening to friend tag updates
export function useFriendTags(imageId) {
  const [tags, setTags] = useState(() => getImageTags(imageId));
  
  useEffect(() => {
    const handleTagsUpdate = (event) => {
      if (event.detail.imageId === imageId) {
        setTags(event.detail.friendIds);
      }
    };
    
    const handleTagsImported = () => {
      setTags(getImageTags(imageId));
    };
    
    const handleTagsCleared = () => {
      setTags([]);
    };
    
    window.addEventListener('friendTagsUpdated', handleTagsUpdate);
    window.addEventListener('friendTagsImported', handleTagsImported);
    window.addEventListener('friendTagsCleared', handleTagsCleared);
    
    return () => {
      window.removeEventListener('friendTagsUpdated', handleTagsUpdate);
      window.removeEventListener('friendTagsImported', handleTagsImported);
      window.removeEventListener('friendTagsCleared', handleTagsCleared);
    };
  }, [imageId]);
  
  const updateTags = (friendIds) => {
    updateImageTags(imageId, friendIds);
  };
  
  const addTag = (friendId) => {
    addFriendTag(imageId, friendId);
  };
  
  const removeTag = (friendId) => {
    removeFriendTag(imageId, friendId);
  };
  
  const toggleTag = (friendId) => {
    toggleFriendTag(imageId, friendId);
  };
  
  return {
    tags,
    updateTags,
    addTag,
    removeTag,
    toggleTag
  };
}