'use client';

import { useState, useEffect, useRef } from 'react';
import { getOptimizedImageUrl } from '../imageUtils';

/**
 * Hook for optimized image loading with progressive enhancement
 * @param {Object} options - Configuration options
 * @param {string} options.src - Original image URL
 * @param {string} options.alt - Image alt text
 * @param {number} options.width - Desired image width
 * @param {number} options.height - Desired image height
 * @param {string} options.quality - Image quality (1-100)
 * @param {boolean} options.lazyLoad - Whether to lazy load the image
 * @param {boolean} options.blurPlaceholder - Whether to use blur placeholder
 * @returns {Object} - Image loading state and optimized props
 */
export default function useOptimizedImage({
  src,
  alt = '',
  width,
  height,
  quality = 80,
  lazyLoad = true,
  blurPlaceholder = true
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazyLoad);
  const imgRef = useRef(null);

  // Get optimized image URLs
  const optimizedSrc = getOptimizedImageUrl(src, { width, height, quality });
  const thumbnailSrc = blurPlaceholder
    ? getOptimizedImageUrl(src, { width: 20, height: 20, quality: 20 })
    : null;

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (!lazyLoad || !imgRef.current) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before the image enters viewport
        threshold: 0.01
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.disconnect();
      }
    };
  }, [lazyLoad]);

  // Handle image load/error events
  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsError(true);
  };

  // Generate image props
  const imageProps = {
    ref: imgRef,
    src: isVisible ? optimizedSrc : thumbnailSrc || '',
    alt,
    width,
    height,
    loading: lazyLoad ? 'lazy' : 'eager',
    onLoad: handleLoad,
    onError: handleError,
    style: {
      opacity: isLoaded ? 1 : 0.5,
      transition: 'opacity 0.3s ease-in-out',
      filter: isLoaded || !blurPlaceholder ? 'none' : 'blur(8px)',
      backgroundColor: blurPlaceholder && !isLoaded ? '#f0f0f0' : 'transparent'
    }
  };

  return {
    isLoaded,
    isError,
    isVisible,
    imageProps,
    optimizedSrc,
    thumbnailSrc
  };
} 