'use client';

import React from 'react';
import useOptimizedImage from '@/lib/hooks/useOptimizedImage';
import { ARIA_LABELS } from '@/lib/accessibility';
import { prefersReducedMotion } from '@/lib/accessibility';

/**
 * Optimized image component with accessibility and performance features
 * - Progressive loading with blur placeholder
 * - Lazy loading with intersection observer
 * - Accessible alt text and ARIA attributes
 * - Reduced motion support
 * - Error handling with fallback
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  objectFit = 'cover',
  onClick,
  onLoad: onLoadProp,
  onError: onErrorProp,
  blurPlaceholder = true,
  fallbackSrc = '/images/placeholder.jpg',
  ariaLabel
}) => {
  // Use our custom hook for optimized image loading
  const {
    isLoaded,
    isError,
    imageProps,
    optimizedSrc
  } = useOptimizedImage({
    src,
    alt,
    width,
    height,
    quality: 80,
    lazyLoad: !priority,
    blurPlaceholder
  });

  // Handle image load event
  const handleLoad = (e) => {
    if (onLoadProp) onLoadProp(e);
  };

  // Handle image error event
  const handleError = (e) => {
    if (onErrorProp) onErrorProp(e);
    
    // Set fallback image on error
    if (e.target) {
      e.target.src = fallbackSrc;
      e.target.onerror = null; // Prevent infinite error loop
    }
  };

  // Determine if animations should be disabled
  const disableAnimations = typeof window !== 'undefined' ? prefersReducedMotion() : false;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
      role="img"
      aria-label={ariaLabel || alt}
    >
      <img
        {...imageProps}
        alt={alt}
        onClick={onClick}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          ...imageProps.style,
          objectFit,
          width: '100%',
          height: '100%',
          transition: disableAnimations ? 'none' : imageProps.style.transition
        }}
        aria-hidden={!!ariaLabel} // Hide from screen readers if ariaLabel is provided on container
      />
      
      {/* Loading indicator */}
      {!isLoaded && !isError && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50"
          aria-hidden="true"
        >
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
      
      {/* Error state */}
      {isError && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100"
          aria-live="polite"
        >
          <span className="text-red-500 mb-2">Failed to load image</span>
          <button
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              const img = document.createElement('img');
              img.src = optimizedSrc;
              img.onload = () => window.location.reload();
            }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage; 