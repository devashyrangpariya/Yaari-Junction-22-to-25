'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiHeart, HiDownload, HiUsers } from 'react-icons/hi';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import TouchGestureWrapper from '../ui/TouchGestureWrapper';
import { getDeviceCapabilities, PerformanceMonitor } from '../../lib/mobileOptimizations';
import { FRIENDS_DATA } from '../../lib/constants';

export default function MobileImageCard({
  image,
  onImageClick,
  onFriendTagClick,
  showTags = true,
  showFriends = true,
  className = '',
  priority = false
}) {
  const [deviceCapabilities, setDeviceCapabilities] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loadStartTime] = useState(Date.now());

  useEffect(() => {
    const capabilities = getDeviceCapabilities();
    setDeviceCapabilities(capabilities);
  }, []);

  const handleImageLoad = () => {
    // Record performance metrics
    PerformanceMonitor.recordImageLoadTime(
      loadStartTime,
      Date.now(),
      'thumbnail'
    );
  };

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(image);
    }
  };

  const handleLikeToggle = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    // Implement download functionality
    console.log('Download image:', image.id);
  };

  const handleFriendClick = (friendId, e) => {
    e.stopPropagation();
    if (onFriendTagClick) {
      onFriendTagClick(friendId);
    }
  };

  const getFriendNames = () => {
    return image.friends?.map(friendId => 
      FRIENDS_DATA.find(f => f.id === friendId)?.name || friendId
    ).slice(0, 3); // Show max 3 names on mobile
  };

  const getCardClasses = () => {
    const baseClasses = "group relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden";
    const mobileClasses = deviceCapabilities?.isMobile 
      ? "mobile-optimized touch-manipulation" 
      : "hover:shadow-xl transition-shadow duration-300";
    
    return `${baseClasses} ${mobileClasses} ${className}`;
  };

  return (
    <TouchGestureWrapper
      onTap={handleImageClick}
      onDoubleTap={handleLikeToggle}
      className={getCardClasses()}
    >
      {/* Image Container */}
      <div className="relative aspect-square">
        <ResponsiveImage
          src={image.thumbnail || image.url}
          alt={image.title}
          cloudinaryId={image.cloudinaryId}
          priority={priority}
          onLoad={handleImageLoad}
          className="group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Mobile-optimized overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Action buttons - positioned for mobile touch */}
          <div className="absolute top-2 right-2 flex space-x-1">
            <motion.button
              className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 min-h-10 min-w-10"
              whileTap={{ scale: 0.9 }}
              onClick={handleLikeToggle}
              aria-label="Like image"
            >
              <HiHeart className={`w-4 h-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
            </motion.button>
            
            <motion.button
              className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 min-h-10 min-w-10"
              whileTap={{ scale: 0.9 }}
              onClick={handleDownload}
              aria-label="Download image"
            >
              <HiDownload className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Image title - mobile optimized positioning */}
          <div className="absolute bottom-2 left-2 right-2">
            <h3 className="text-white text-sm font-medium truncate mb-1">
              {image.title}
            </h3>
            
            {/* Tags - mobile optimized */}
            {showTags && image.tags && image.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {image.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white"
                  >
                    {tag}
                  </span>
                ))}
                {image.tags.length > 2 && (
                  <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                    +{image.tags.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Friends - mobile optimized */}
            {showFriends && image.friends && image.friends.length > 0 && (
              <div className="flex items-center space-x-1">
                <HiUsers className="w-3 h-3 text-white/80" />
                <div className="flex space-x-1">
                  {getFriendNames()?.map((name, index) => (
                    <button
                      key={index}
                      onClick={(e) => handleFriendClick(image.friends[index], e)}
                      className="text-xs text-white/90 hover:text-white transition-colors touch-manipulation"
                    >
                      {name}
                    </button>
                  ))}
                  {image.friends.length > 3 && (
                    <span className="text-xs text-white/80">
                      +{image.friends.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading indicator for slow connections */}
        {deviceCapabilities?.isSlowConnection && (
          <div className="absolute top-2 left-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Mobile-specific metadata */}
      {deviceCapabilities?.isMobile && (
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {image.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(image.uploadDate).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 ml-2">
              {image.friends && image.friends.length > 0 && (
                <div className="flex items-center space-x-1">
                  <HiUsers className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {image.friends.length}
                  </span>
                </div>
              )}
              
              <motion.button
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors touch-manipulation min-h-8 min-w-8"
                whileTap={{ scale: 0.9 }}
                onClick={handleLikeToggle}
              >
                <HiHeart className={`w-4 h-4 ${
                  isLiked 
                    ? 'fill-current text-red-500' 
                    : 'text-gray-400 hover:text-red-500'
                }`} />
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Performance indicator for debugging */}
      {process.env.NODE_ENV === 'development' && deviceCapabilities?.isLowMemoryDevice && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-50"></div>
      )}
    </TouchGestureWrapper>
  );
}

// Skeleton loader for mobile
export function MobileImageCardSkeleton({ className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden ${className}`}>
      <div className="aspect-square mobile-skeleton"></div>
      <div className="p-3 space-y-2">
        <div className="h-4 mobile-skeleton rounded"></div>
        <div className="h-3 mobile-skeleton rounded w-2/3"></div>
      </div>
    </div>
  );
}

// Grid container optimized for mobile
export function MobileImageGrid({ 
  images, 
  onImageClick, 
  onFriendTagClick,
  loading = false,
  className = '' 
}) {
  const [deviceCapabilities, setDeviceCapabilities] = useState(null);

  useEffect(() => {
    const capabilities = getDeviceCapabilities();
    setDeviceCapabilities(capabilities);
  }, []);

  const getGridClasses = () => {
    if (deviceCapabilities?.isMobile) {
      return 'grid grid-cols-2 gap-2 sm:gap-3';
    }
    return 'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6';
  };

  if (loading) {
    return (
      <div className={`${getGridClasses()} ${className}`}>
        {Array.from({ length: deviceCapabilities?.isMobile ? 6 : 12 }).map((_, index) => (
          <MobileImageCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {images.map((image, index) => (
        <MobileImageCard
          key={image.id}
          image={image}
          onImageClick={onImageClick}
          onFriendTagClick={onFriendTagClick}
          priority={index < (deviceCapabilities?.isMobile ? 4 : 6)}
        />
      ))}
    </div>
  );
}