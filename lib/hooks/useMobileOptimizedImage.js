/**
 * Custom hook for mobile-optimized image loading
 * Handles responsive images, lazy loading, and performance optimization
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  getDeviceCapabilities, 
  getOptimalImageSize, 
  generateResponsiveImageUrls,
  createLazyLoadObserver,
  ImageCache,
  PerformanceMonitor
} from '../mobileOptimizations';

export const useMobileOptimizedImage = (imageData, containerRef, options = {}) => {
  const {
    lazy = true,
    preload = false,
    quality = 'auto',
    enableCache = true,
    onLoadStart,
    onLoadComplete,
    onError
  } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSrc, setCurrentSrc] = useState(null);
  const [deviceCapabilities] = useState(() => getDeviceCapabilities());
  
  const imageRef = useRef(null);
  const observerRef = useRef(null);
  const loadStartTime = useRef(null);

  // Generate responsive image URLs
  const responsiveUrls = generateResponsiveImageUrls(imageData.url, imageData.cloudinaryId);

  // Determine optimal image source based on container size and device capabilities
  const getOptimalImageSrc = useCallback(() => {
    if (!containerRef?.current) return imageData.thumbnail || imageData.url;

    const containerWidth = containerRef.current.offsetWidth;
    const { width, quality: optimalQuality } = getOptimalImageSize(containerWidth, deviceCapabilities);

    // Select appropriate responsive URL
    if (width <= 300) return responsiveUrls.thumbnail;
    if (width <= 480) return responsiveUrls.small;
    if (width <= 768) return responsiveUrls.medium;
    if (width <= 1024) return responsiveUrls.large;
    return responsiveUrls.xlarge;
  }, [imageData, containerRef, deviceCapabilities, responsiveUrls]);

  // Load image with performance monitoring
  const loadImage = useCallback(async (src) => {
    if (!src) return;

    // Check cache first
    if (enableCache && ImageCache.has(src)) {
      const cachedImage = ImageCache.get(src);
      setCurrentSrc(cachedImage.src);
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    loadStartTime.current = performance.now();

    if (onLoadStart) {
      onLoadStart();
    }

    try {
      const img = new Image();
      
      img.onload = () => {
        const loadEndTime = performance.now();
        
        // Record performance metrics
        PerformanceMonitor.recordImageLoadTime(
          loadStartTime.current,
          loadEndTime,
          img.naturalWidth * img.naturalHeight
        );

        // Cache the loaded image
        if (enableCache) {
          ImageCache.set(src, {
            src,
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        }

        setCurrentSrc(src);
        setIsLoaded(true);
        setIsLoading(false);

        if (onLoadComplete) {
          onLoadComplete(img);
        }
      };

      img.onerror = () => {
        const errorObj = new Error(`Failed to load image: ${src}`);
        setError(errorObj);
        setIsLoading(false);

        if (onError) {
          onError(errorObj);
        }
      };

      img.src = src;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      
      if (onError) {
        onError(err);
      }
    }
  }, [enableCache, onLoadStart, onLoadComplete, onError]);

  // Set up lazy loading observer
  useEffect(() => {
    if (!lazy || !imageRef.current) return;

    const observer = createLazyLoadObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const optimalSrc = getOptimalImageSrc();
            loadImage(optimalSrc);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: deviceCapabilities.isMobile ? '25px' : '50px'
      }
    );

    observer.observe(imageRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy, loadImage, getOptimalImageSrc, deviceCapabilities.isMobile]);

  // Load image immediately if not lazy or if preload is enabled
  useEffect(() => {
    if (!lazy || preload) {
      const optimalSrc = getOptimalImageSrc();
      loadImage(optimalSrc);
    }
  }, [lazy, preload, loadImage, getOptimalImageSrc]);

  // Handle container resize
  useEffect(() => {
    if (!containerRef?.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (isLoaded) {
        const newOptimalSrc = getOptimalImageSrc();
        if (newOptimalSrc !== currentSrc) {
          loadImage(newOptimalSrc);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, isLoaded, currentSrc, getOptimalImageSrc, loadImage]);

  // Preload next/previous images for better UX
  const preloadAdjacentImages = useCallback((adjacentImages = []) => {
    if (deviceCapabilities.isSlowConnection || deviceCapabilities.isLowMemoryDevice) {
      return; // Skip preloading on slow connections or low-end devices
    }

    adjacentImages.forEach((img) => {
      if (img && !ImageCache.has(img.url)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.thumbnail || img.url;
        document.head.appendChild(link);
      }
    });
  }, [deviceCapabilities]);

  return {
    imageRef,
    currentSrc: currentSrc || imageData.thumbnail || imageData.url,
    isLoaded,
    isLoading,
    error,
    deviceCapabilities,
    preloadAdjacentImages,
    reload: () => {
      const optimalSrc = getOptimalImageSrc();
      loadImage(optimalSrc);
    }
  };
};

// Hook for managing gallery image preloading
export const useGalleryPreloader = (images, currentIndex, preloadCount = 2) => {
  const [deviceCapabilities] = useState(() => getDeviceCapabilities());

  useEffect(() => {
    if (deviceCapabilities.isSlowConnection || deviceCapabilities.isLowMemoryDevice) {
      return; // Skip preloading on constrained devices
    }

    const preloadImages = [];
    
    // Preload next images
    for (let i = 1; i <= preloadCount; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex < images.length) {
        preloadImages.push(images[nextIndex]);
      }
    }
    
    // Preload previous images
    for (let i = 1; i <= preloadCount; i++) {
      const prevIndex = currentIndex - i;
      if (prevIndex >= 0) {
        preloadImages.push(images[prevIndex]);
      }
    }

    // Create preload links
    preloadImages.forEach((image) => {
      if (!ImageCache.has(image.url)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = image.thumbnail || image.url;
        link.fetchPriority = 'low';
        document.head.appendChild(link);
      }
    });
  }, [images, currentIndex, preloadCount, deviceCapabilities]);
};

// Hook for responsive image sizing
export const useResponsiveImageSize = (containerRef, baseSize = 300) => {
  const [imageSize, setImageSize] = useState(baseSize);
  const [deviceCapabilities] = useState(() => getDeviceCapabilities());

  useEffect(() => {
    if (!containerRef?.current) return;

    const updateSize = () => {
      const containerWidth = containerRef.current.offsetWidth;
      const { width } = getOptimalImageSize(containerWidth, deviceCapabilities);
      setImageSize(width);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, deviceCapabilities]);

  return imageSize;
};