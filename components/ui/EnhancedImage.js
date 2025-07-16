'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HiPhotograph, HiRefresh, HiExclamationCircle } from 'react-icons/hi';
import { useImageLoader } from '../../lib/hooks/useImageLoader';
import { Skeleton } from './LoadingSkeleton';

export default function EnhancedImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  className = '',
  containerClassName = '',
  showRetryButton = true,
  showErrorDetails = false,
  onLoad,
  onError,
  ...props
}) {
  const [imageError, setImageError] = useState(false);
  
  const {
    loading,
    error,
    retryCount,
    maxRetries,
    currentSrc,
    retry,
    canRetry
  } = useImageLoader(src, {
    fallbackSrc,
    onLoad: (loadedSrc) => {
      setImageError(false);
      if (onLoad) onLoad(loadedSrc);
    },
    onError: (err) => {
      setImageError(true);
      if (onError) onError(err);
    }
  });

  if (loading) {
    return (
      <div className={`relative overflow-hidden ${containerClassName}`}>
        <Skeleton className={`w-full h-full ${className}`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <HiPhotograph className="w-8 h-8 text-gray-400" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (error && !canRetry) {
    return (
      <div className={`relative bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center p-4 ${containerClassName} ${className}`}>
        <HiExclamationCircle className="w-12 h-12 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500 text-center mb-3">
          Failed to load image
        </p>
        
        {showErrorDetails && (
          <p className="text-xs text-gray-400 text-center mb-3">
            Tried {retryCount}/{maxRetries} times
          </p>
        )}
        
        {showRetryButton && canRetry && (
          <motion.button
            onClick={retry}
            className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HiRefresh className="w-3 h-3" />
            <span>Retry</span>
          </motion.button>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${containerClassName}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={currentSrc}
          alt={alt}
          className={className}
          onError={() => setImageError(true)}
          {...props}
        />
      </motion.div>
      
      {/* Retry overlay for failed images */}
      {imageError && canRetry && showRetryButton && (
        <motion.div
          className="absolute inset-0 bg-black/50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={retry}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/90 hover:bg-white text-gray-900 rounded-lg font-medium transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HiRefresh className="w-4 h-4" />
            <span>Retry</span>
          </motion.button>
        </motion.div>
      )}
      
      {/* Loading indicator for retries */}
      {loading && retryCount > 0 && (
        <motion.div
          className="absolute inset-0 bg-black/30 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <HiRefresh className="w-6 h-6 text-white" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// Gallery-specific image component
export function GalleryImage({
  src,
  alt,
  title,
  className = '',
  onImageClick,
  showOverlay = true,
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative group cursor-pointer overflow-hidden rounded-lg ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onImageClick && onImageClick({ src, alt, title })}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <EnhancedImage
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        showRetryButton={false}
        {...props}
      />
      
      {showOverlay && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {title && (
              <h3 className="text-white font-medium text-sm truncate">
                {title}
              </h3>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}