'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiHeart, HiDownload, HiShare, HiDotsVertical } from 'react-icons/hi';
import FriendTagOverlay from './FriendTagOverlay';
import { getOptimizedImageUrl } from '@/lib/imageUtils';

export default function ImageCard({
  image,
  onClick,
  onFavoriteToggle,
  onDownload,
  onShare,
  className = '',
  showActions = true,
  aspectRatio = 'square',
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(image.id);
    }
  };
  
  const handleDownloadClick = (e) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(image);
    }
  };
  
  const handleShareClick = (e) => {
    e.stopPropagation();
    if (onShare) {
      onShare(image);
    }
  };
  
  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };
  
  const aspectRatioClass = {
    'square': 'aspect-square',
    'video': 'aspect-video',
    'portrait': 'aspect-[3/4]',
    'landscape': 'aspect-[4/3]',
  }[aspectRatio] || 'aspect-square';
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick && onClick(image)}
      className={`relative overflow-hidden rounded-lg cursor-pointer bg-gray-200 dark:bg-gray-800 ${aspectRatioClass} ${className}`}
    >
      {/* Image */}
      {!imageError ? (
        <img
          src={getOptimizedImageUrl(image.src, { preset: 'thumbnail' })}
          alt={image.caption || 'Gallery image'}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700">
          <span className="text-gray-500 dark:text-gray-400">Image not available</span>
        </div>
      )}
      
      {/* Loading skeleton */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse" />
      )}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Caption */}
      {image.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-sm font-medium truncate">{image.caption}</p>
        </div>
      )}
      
      {/* Friend tags */}
      {image.friends && image.friends.length > 0 && (
        <FriendTagOverlay image={image} readOnly={true} />
      )}
      
      {/* Action buttons */}
      {showActions && (
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
          {/* Favorite button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full ${
              image.favorite 
                ? 'bg-red-500 text-white' 
                : 'bg-black/30 text-white hover:bg-black/50'
            }`}
          >
            <HiHeart className="w-4 h-4" />
          </motion.button>
          
          {/* Download button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDownloadClick}
            className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50"
          >
            <HiDownload className="w-4 h-4" />
          </motion.button>
          
          {/* Share button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShareClick}
            className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50"
          >
            <HiShare className="w-4 h-4" />
          </motion.button>
          
          {/* More options */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleMenuToggle}
              className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50"
            >
              <HiDotsVertical className="w-4 h-4" />
            </motion.button>
            
            {/* Dropdown menu */}
            {showMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 w-40 z-10">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle edit
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Edit
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle delete
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Date overlay */}
      {image.date && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md opacity-0 hover:opacity-100 transition-opacity duration-300">
          {new Date(image.date).toLocaleDateString()}
        </div>
      )}
    </motion.div>
  );
}