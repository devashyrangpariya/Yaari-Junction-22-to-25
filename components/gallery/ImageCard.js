// components/gallery/ImageCard.js
'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { HiHeart, HiDownload, HiEye, HiCalendar } from 'react-icons/hi';
import { galleryVariants } from '../../lib/animations';
import { useMobileOptimizedImage } from '../../lib/hooks/useMobileOptimizedImage';

export default function ImageCard({ 
  image, 
  onImageClick, 
  showTags = true, 
  className = '' 
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
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

  // Calculate aspect ratio for the card
  const aspectRatio = image.height && image.width 
    ? `${image.width} / ${image.height}` 
    : '1 / 1';

  return (
    <motion.div
      className={`group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer touch-manipulation ${className}`}
      variants={galleryVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ aspectRatio }}
    >
      {/* Image Container */}
      <div ref={containerRef} className="relative h-full w-full overflow-hidden">
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
          <>
            <img
              ref={imageRef}
              src={currentSrc}
              alt={image.title || 'Gallery image'}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              } ${isHovered ? 'scale-110 blur-[1px]' : 'scale-100'}`}
              loading="lazy"
            />
            
            {/* Year Badge */}
            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
              <HiCalendar className="w-3 h-3" />
              <span>{image.year}</span>
            </div>
          </>
        )}

        {/* Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Action Buttons - Touch-friendly sizing */}
          <motion.div 
            className="absolute top-2 right-2 sm:top-3 sm:right-3 flex space-x-1 sm:space-x-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
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
                const link = document.createElement('a');
                link.href = image.url;
                link.download = `${image.title || 'image'}-${image.year}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              aria-label="Download image"
            >
              <HiDownload className="w-4 h-4 sm:w-4 sm:h-4" />
            </motion.button>
          </motion.div>

          {/* Image Info */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {image.title && (
              <h3 className="text-white font-semibold text-base mb-1 truncate">
                {image.title}
              </h3>
            )}
            
            <div className="flex items-center justify-between text-white/80 text-xs">
              <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                {new Date(image.uploadDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Tags - Mobile optimized */}
      {showTags && image.tags?.length > 0 && (
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-12 pb-2 pointer-events-none">
          <div className="flex flex-wrap gap-1.5">
            {image.tags.slice(0, 3).map((tag, index) => (
              <motion.span
                key={index}
                className="px-2 py-1 bg-blue-100/80 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs rounded-full truncate max-w-24 sm:max-w-none backdrop-blur-sm pointer-events-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                #{tag}
              </motion.span>
            ))}
            {image.tags.length > 3 && (
              <motion.span 
                className="px-2 py-1 bg-gray-100/80 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 text-xs rounded-full backdrop-blur-sm pointer-events-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                +{image.tags.length - 3}
              </motion.span>
            )}
          </div>
        </div>
      )}
      
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: "0 0 40px rgba(59, 130, 246, 0.5) inset",
        }}
      />
    </motion.div>
  );
}