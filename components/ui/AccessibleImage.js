'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { generateImageDescription, announceToScreenReader } from '../../lib/accessibility';
import { cn } from '../../lib/utils';

const AccessibleImage = ({
  src,
  alt,
  title,
  className = '',
  containerClassName = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  aspectRatio = 'square',
  showLoadingState = true,
  onLoad,
  onError,
  onClick,
  tabIndex,
  role,
  ariaLabel,
  ariaDescribedBy,
  friends = [],
  tags = [],
  year,
  loading = 'lazy',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Generate comprehensive alt text if not provided
  const getAccessibleAltText = () => {
    if (alt) return alt;
    
    const imageData = { title, friends, tags, year };
    return generateImageDescription(imageData) || 'Image';
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!containerRef.current || priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = (event) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(event);
    }
  };

  const handleError = (event) => {
    setHasError(true);
    announceToScreenReader('Image failed to load', 'assertive');
    if (onError) {
      onError(event);
    }
  };

  const handleClick = (event) => {
    if (onClick) {
      // Announce image interaction for screen readers
      announceToScreenReader(`Opening image: ${getAccessibleAltText()}`, 'polite');
      onClick(event);
    }
  };

  const handleKeyDown = (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && onClick) {
      event.preventDefault();
      handleClick(event);
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
    const baseClasses = `relative overflow-hidden ${getAspectRatioClass()}`;
    const interactiveClasses = onClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg' : '';
    return cn(baseClasses, interactiveClasses, containerClassName);
  };

  const getImageClasses = () => {
    const baseClasses = 'object-cover transition-all duration-300';
    return cn(baseClasses, className);
  };

  // Error fallback component
  const ErrorFallback = () => (
    <div className={cn(getContainerClasses(), 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center')}>
      <div className="text-center p-4">
        <div className="w-12 h-12 mx-auto mb-2 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xl font-bold" aria-hidden="true">
            {title ? title.charAt(0).toUpperCase() : '?'}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Image unavailable
        </p>
      </div>
    </div>
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className={cn(getContainerClasses(), 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse')}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-400 border-t-blue-600" aria-hidden="true" />
      </div>
      <span className="sr-only">Loading image</span>
    </div>
  );

  if (hasError) {
    return <ErrorFallback />;
  }

  // Don't render image until it's in view (unless priority)
  if (!priority && !isInView) {
    return (
      <div ref={containerRef} className={getContainerClasses()}>
        {showLoadingState && <LoadingSkeleton />}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={getContainerClasses()}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? (tabIndex ?? 0) : undefined}
      role={role || (onClick ? 'button' : undefined)}
      aria-label={ariaLabel || (onClick ? `View image: ${getAccessibleAltText()}` : undefined)}
      aria-describedby={ariaDescribedBy}
    >
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
          ref={imageRef}
          src={src}
          alt={getAccessibleAltText()}
          title={title}
          fill
          className={getImageClasses()}
          sizes={sizes}
          priority={priority}
          loading={priority ? 'eager' : loading}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </motion.div>

      {/* Image metadata for screen readers */}
      {(friends.length > 0 || tags.length > 0 || year) && (
        <div className="sr-only">
          {friends.length > 0 && (
            <span>People in this image: {friends.join(', ')}. </span>
          )}
          {tags.length > 0 && (
            <span>Tags: {tags.join(', ')}. </span>
          )}
          {year && (
            <span>Year: {year}. </span>
          )}
        </div>
      )}

      {/* Visual loading indicator */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};

export default AccessibleImage;

// Specialized variants
export const GalleryAccessibleImage = ({ 
  image, 
  onImageClick, 
  className = '', 
  index,
  total,
  ...props 
}) => {
  const handleClick = () => {
    if (onImageClick) {
      announceToScreenReader(
        `Opening image ${index + 1} of ${total}: ${image.title}`,
        'polite'
      );
      onImageClick(image);
    }
  };

  return (
    <motion.div
      className={cn('group', className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <AccessibleImage
        src={image.thumbnail || image.url}
        alt={image.title}
        title={image.title}
        friends={image.friends}
        tags={image.tags}
        year={image.year}
        onClick={handleClick}
        containerClassName="group-hover:shadow-lg transition-shadow duration-300 rounded-lg"
        className="group-hover:scale-105 transition-transform duration-300"
        ariaLabel={`View image ${index + 1} of ${total}: ${image.title}`}
        {...props}
      />
      
      {/* Image overlay with title */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none">
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-white text-sm font-medium truncate">
            {image.title}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const ProfileAccessibleImage = ({ 
  src, 
  alt, 
  name,
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
  };

  return (
    <div className={cn(sizeClasses[size], className)}>
      <AccessibleImage
        src={src}
        alt={alt || `${name}'s profile picture`}
        aspectRatio="square"
        containerClassName="rounded-full"
        className="rounded-full"
        sizes="(max-width: 768px) 96px, 128px"
        {...props}
      />
    </div>
  );
};