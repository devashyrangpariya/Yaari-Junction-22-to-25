'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getDeviceCapabilities, getOptimalImageSize, generateResponsiveImageUrls } from '../../lib/mobileOptimizations';

export default function ResponsiveImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  aspectRatio = 'square', // 'square', 'landscape', 'portrait', 'auto'
  showLoadingState = true,
  onLoad,
  onError,
  cloudinaryId,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState(null);
  const [optimizedSrc, setOptimizedSrc] = useState(src);

  useEffect(() => {
    // Get device capabilities on mount
    const capabilities = getDeviceCapabilities();
    setDeviceCapabilities(capabilities);

    // Generate optimized image URLs if cloudinaryId is provided
    if (cloudinaryId && src.includes('cloudinary')) {
      const responsiveUrls = generateResponsiveImageUrls(src, cloudinaryId);
      
      // Choose appropriate size based on device capabilities
      let selectedSize = 'medium';
      if (capabilities.isMobile) {
        selectedSize = capabilities.isSlowConnection ? 'small' : 'medium';
      } else {
        selectedSize = capabilities.isSlowConnection ? 'medium' : 'large';
      }
      
      setOptimizedSrc(responsiveUrls[selectedSize] || src);
    }
  }, [src, cloudinaryId]);

  const handleLoad = (event) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(event);
    }
  };

  const handleError = (event) => {
    setHasError(true);
    if (onError) {
      onError(event);
    }
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'landscape':
        return 'aspect-video';
      case 'portrait':
        return 'aspect-[3/4]';
      case 'auto':
        return 'h-auto';
      default:
        return 'aspect-square';
    }
  };

  const getContainerClasses = () => {
    const baseClasses = `relative overflow-hidden mobile-image-container ${getAspectRatioClass()}`;
    return `${baseClasses} ${containerClassName}`;
  };

  const getImageClasses = () => {
    const baseClasses = `object-cover transition-all duration-300 ${
      deviceCapabilities?.isMobile ? 'mobile-optimized' : ''
    }`;
    return `${baseClasses} ${className}`;
  };

  // Fallback component for error state
  const ErrorFallback = () => (
    <div className={`${getContainerClasses()} bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center`}>
      <div className="text-center p-4">
        <div className="w-12 h-12 mx-auto mb-2 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xl font-bold">
            {alt ? alt.charAt(0).toUpperCase() : '?'}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">Image unavailable</p>
      </div>
    </div>
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className={`${getContainerClasses()} mobile-skeleton`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    </div>
  );

  if (hasError) {
    return <ErrorFallback />;
  }

  return (
    <div className={getContainerClasses()}>
      {/* Loading skeleton */}
      {showLoadingState && !isLoaded && <LoadingSkeleton />}
      
      {/* Main image */}
      <motion.div
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={optimizedSrc}
          alt={alt}
          fill
          className={getImageClasses()}
          sizes={sizes}
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
          quality={deviceCapabilities?.isSlowConnection ? 75 : 90}
          {...props}
        />
      </motion.div>

      {/* Mobile-specific overlay for touch interactions */}
      {deviceCapabilities?.isMobile && (
        <div className="absolute inset-0 touch-manipulation" />
      )}
    </div>
  );
}

// Specialized variants for common use cases
export function GalleryImage({ image, onImageClick, className = '', ...props }) {
  return (
    <motion.div
      className={`cursor-pointer group ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onImageClick && onImageClick(image)}
    >
      <ResponsiveImage
        src={image.thumbnail || image.url}
        alt={image.title}
        cloudinaryId={image.cloudinaryId}
        aspectRatio="square"
        containerClassName="group-hover:shadow-lg transition-shadow duration-300"
        className="group-hover:scale-105 transition-transform duration-300"
        {...props}
      />
      
      {/* Image overlay with title */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-white text-sm font-medium truncate">
            {image.title}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function ProfileImage({ src, alt, size = 'md', className = '', ...props }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <ResponsiveImage
        src={src}
        alt={alt}
        aspectRatio="square"
        containerClassName="rounded-full"
        className="rounded-full"
        sizes="(max-width: 768px) 96px, 128px"
        {...props}
      />
    </div>
  );
}

export function HeroImage({ src, alt, className = '', ...props }) {
  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      aspectRatio="landscape"
      priority={true}
      sizes="100vw"
      containerClassName={`w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] ${className}`}
      {...props}
    />
  );
}