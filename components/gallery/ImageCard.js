'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { HiHeart, HiDownload, HiEye, HiUsers } from 'react-icons/hi';
import { galleryVariants } from '../../lib/animations';
import { getImageTags } from '../../lib/friendTagging';
import { FRIENDS_DATA } from '../../lib/constants';
import { useMobileOptimizedImage } from '../../lib/hooks/useMobileOptimizedImage';

export default function ImageCard({ 
  image, 
  onImageClick, 
  onFriendTagClick,
  showTags = true, 
  className = '' 
}) {
  const containerRef = useRef(null);
  
  // Use mobile-optimized image loading
  const {
    imageRef,
    currentSrc,
    isLoaded,
    isLoading,
    error: hasError,
    deviceCapabilities
  } = useMobileOptimizedImage(image, containerRef, {
    lazy: true,
    enableCache: true,
    onLoadStart: () => {
      // Optional: Handle load start
    },
    onLoadComplete: () => {
      // Optional: Handle load complete
    }
  });

  const handleCardClick = () => {
    if (onImageClick) {
      onImageClick(image);
    }
  };

  // Get tagged friends for this image
  const getTaggedFriends = () => {
    if (!image?.id) return [];
    const taggedFriendIds = getImageTags(image.id);
    return FRIENDS_DATA.filter(friend => taggedFriendIds.includes(friend.id));
  };

  const taggedFriends = getTaggedFriends();

  return (
    <motion.div
      className={`group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer touch-manipulation ${className}`}
      variants={galleryVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div ref={containerRef} className="relative aspect-square overflow-hidden">
        {(isLoading || (!isLoaded && !hasError)) && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {hasError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <HiEye className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Image not available</p>
            </div>
          </div>
        ) : (
          <img
            ref={imageRef}
            src={currentSrc}
            alt={image.title || 'Gallery image'}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Action Buttons - Touch-friendly sizing */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex space-x-1 sm:space-x-2">
            <motion.button
              className="w-10 h-10 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200 touch-manipulation"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                // Handle like functionality
              }}
              aria-label="Like image"
            >
              <HiHeart className="w-4 h-4 sm:w-4 sm:h-4" />
            </motion.button>
            
            <motion.button
              className="w-10 h-10 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200 touch-manipulation"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                // Handle download functionality
              }}
              aria-label="Download image"
            >
              <HiDownload className="w-4 h-4 sm:w-4 sm:h-4" />
            </motion.button>
          </div>

          {/* Image Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {image.title && (
              <h3 className="text-white font-semibold text-sm mb-1 truncate">
                {image.title}
              </h3>
            )}
            
            <div className="flex items-center justify-between text-white/80 text-xs">
              <span>{image.year}</span>
              {taggedFriends.length > 0 && (
                <div className="flex items-center space-x-1">
                  <HiUsers className="w-3 h-3" />
                  <span>{taggedFriends.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tags and Friends - Mobile optimized */}
      {showTags && (image.tags?.length > 0 || taggedFriends.length > 0) && (
        <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
          {/* Regular Tags */}
          {image.tags && image.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {image.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full truncate max-w-20 sm:max-w-none"
                >
                  {tag}
                </span>
              ))}
              {image.tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                  +{image.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Friend Tags */}
          {taggedFriends.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {taggedFriends.slice(0, 2).map((friend, index) => (
                <button
                  key={friend.id}
                  className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full flex items-center space-x-1 hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors duration-200 cursor-pointer touch-manipulation min-h-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onFriendTagClick) {
                      onFriendTagClick(friend.id);
                    }
                  }}
                  title={`Filter by ${friend.name}`}
                >
                  <HiUsers className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-16 sm:max-w-none">{friend.name}</span>
                </button>
              ))}
              {taggedFriends.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full flex items-center space-x-1">
                  <HiUsers className="w-3 h-3" />
                  <span>+{taggedFriends.length - 2}</span>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}