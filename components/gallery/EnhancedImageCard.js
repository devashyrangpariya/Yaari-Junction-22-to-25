// components/gallery/EnhancedImageCard.js
// Optimized image card with hover effects, mobile optimization, and click handlers
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiCalendar, HiDownload } from 'react-icons/hi';
import { useMobileOptimizedImage } from '../../lib/hooks/useMobileOptimizedImage';
import ScrollAnimation from './ScrollAnimation';
import { getDeviceCapabilities } from '../../lib/mobileOptimizations';

export default function EnhancedImageCard({
  image,
  onImageClick,
  showTags = false,
  className = '',
  animation = 'fadeInUp',
  index = 0,
  uniqueIdentifier = '',
  disableClick = false,
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState(null);
  
  // Calculate stagger delay based on index (with a maximum to avoid too long delays)
  const staggerDelay = Math.min(index * 0.12, 0.6);
  
  // Get device capabilities for optimizations
  useEffect(() => {
    setDeviceCapabilities(getDeviceCapabilities());
  }, []);
  
  // Check if we should reduce motion for performance
  const shouldReduceMotion = deviceCapabilities?.isLowMemoryDevice || deviceCapabilities?.prefersReducedMotion;
  
  // Use mobile-optimized image loading
  const {
    imageRef,
    currentSrc,
    isLoaded,
    isLoading,
    error: hasError,
  } = useMobileOptimizedImage(image, containerRef, {
    lazy: true,
    enableCache: true,
    // Use lower quality for low-memory devices
    quality: deviceCapabilities?.isLowMemoryDevice ? 70 : 90
  });

  // Calculate optimal aspect ratio or use 1:1
  const aspectRatio = image.height && image.width
    ? `${image.width} / ${image.height}`
    : '1 / 1';

  // Handle direct image download
  const handleDownload = (e) => {
    e.stopPropagation();
    setIsDownloading(true);
    
    try {
      // Get original image name
      const pathParts = image.url.split('/');
      const imageName = pathParts[pathParts.length - 1];
      
      // Create an anchor element
      const link = document.createElement('a');
      
      // Set the href to the image URL
      link.href = image.url;
      
      // Use original file name for download
      link.download = imageName;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success state briefly
      setTimeout(() => {
        setIsDownloading(false);
      }, 800);
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
    }
  };

  // Handle image click - directly download if clicks enabled
  const handleCardClick = () => {
    if (onImageClick && !disableClick) {
      onImageClick(image);
    } else if (!disableClick) {
      // If no click handler but clicks are enabled, download the image
      handleDownload({ stopPropagation: () => {} });
    }
  };

  // Use simpler animation for mobile/low-end devices
  const cardAnimations = shouldReduceMotion ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, delay: index * 0.05 }
  } : {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { 
      duration: 0.8, 
      delay: staggerDelay,
      ease: [0.25, 1, 0.5, 1]
    },
    whileHover: { scale: 1.02 },
    whileTap: !disableClick ? { scale: 0.98 } : {}
  };

  // Simpler image animations for low-end devices
  const imageAnimations = shouldReduceMotion ? {
    initial: { opacity: 0 },
    animate: { opacity: isLoaded ? 1 : 0 },
    transition: { duration: 0.3 }
  } : {
    initial: { opacity: 0, scale: 1.1 },
    animate: { 
      opacity: isLoaded ? 1 : 0,
      scale: isHovered ? 1.05 : 1,
      filter: isHovered ? 'brightness(0.85) contrast(1.1)' : 'brightness(1)'
    },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <ScrollAnimation 
      animation={animation} 
      delay={staggerDelay}
      className={`h-full w-full ${className}`}
      threshold={0.1}
    >
      <motion.div
        className={`group relative bg-transparent overflow-hidden rounded-xl ${!disableClick ? 'cursor-pointer' : 'cursor-default'} h-full w-full`}
        onClick={handleCardClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{ aspectRatio }}
        layoutId={shouldReduceMotion ? undefined : `image-${uniqueIdentifier}-${image.id}`}
        {...cardAnimations}
      >
        {/* Image Container */}
        <div ref={containerRef} className="relative h-full w-full overflow-hidden rounded-xl">
          {/* Loading Skeleton */}
          {(isLoading || (!isLoaded && !hasError)) && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl"></div>
          )}

          {/* The Image */}
          {!hasError && (
            <motion.img
              ref={imageRef}
              src={currentSrc}
              alt=""
              className="w-full h-full object-cover rounded-xl"
              loading="lazy"
              draggable="false"
              {...imageAnimations}
            />
          )}

          {/* Year Badge - Always visible */}
          <motion.div 
            className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: staggerDelay + 0.2 }}
          >
            <HiCalendar className="w-3 h-3" />
            <span>{image.year}</span>
          </motion.div>

          {/* Overlay and Interaction Elements - Show on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-xl flex flex-col justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Download button */}
            <motion.button
              className={`absolute top-3 right-3 p-2 rounded-full ${
                isDownloading ? 'bg-gray-500/60' : 'bg-black/60 hover:bg-black/80'
              } text-white backdrop-blur-sm transition-all`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: isHovered ? 1 : 0.8, 
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : -5
              }}
              transition={{ duration: 0.2 }}
              onClick={handleDownload}
              disabled={isDownloading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Download image"
            >
              {isDownloading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <HiDownload className="w-4 h-4" />
              )}
            </motion.button>
            
            {/* Hint text - only for desktop */}
            {!disableClick && !deviceCapabilities?.isMobile && (
              <motion.div
                className="absolute bottom-3 left-0 right-0 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 10
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <span className="text-xs text-white bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {onImageClick ? 'Click to view' : 'Click to download'}
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Interactive highlight on hover - skip for mobile */}
        {!deviceCapabilities?.isMobile && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-xl z-10"
            initial={{ boxShadow: "none" }}
            animate={{ 
              boxShadow: isHovered ? "inset 0 0 0 2px rgba(99, 102, 241, 0.6), 0 10px 25px -5px rgba(0, 0, 0, 0.1)" : "none" 
            }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    </ScrollAnimation>
  );
}