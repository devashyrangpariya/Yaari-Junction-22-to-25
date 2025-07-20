// lib/mobileOptimizations.js
'use client';

/**
 * Utility functions for optimizing the application for mobile devices
 */

// Cache the device capabilities after first call
let deviceCapabilitiesCache = null;

/**
 * Get device capabilities including screen size, platform, memory, connection info
 * @returns {Object} Device capabilities
 */
export function getDeviceCapabilities() {
  // Return cached result if available and not in dev mode
  if (deviceCapabilitiesCache && process.env.NODE_ENV !== 'development') {
    return deviceCapabilitiesCache;
  }

  // Default capabilities for server-side rendering
  let capabilities = {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLowMemoryDevice: false,
    isSlowConnection: false,
    prefersReducedMotion: false,
    screenWidth: 1920,
    screenHeight: 1080,
    devicePixelRatio: 1,
    platform: 'desktop',
    orientation: 'landscape',
    touchEnabled: false,
    colorScheme: 'light',
  };

  // Only run in browser environment
  if (typeof window !== 'undefined') {
    const userAgent = navigator.userAgent.toLowerCase();
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Detect device type
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent);
    const isTabletDevice = /ipad|tablet/i.test(userAgent) || (width >= 768 && width <= 1024);
    
    // Detect platform
    let platform = 'desktop';
    if (/android/i.test(userAgent)) platform = 'android';
    else if (/iphone|ipad|ipod/i.test(userAgent)) platform = 'ios';
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Detect low memory device (heuristic based on device pixel ratio and screen size)
    const devicePixelRatio = window.devicePixelRatio || 1;
    const isLowMemoryDevice = (
      // Low-end devices typically have lower pixel ratios
      (devicePixelRatio < 2 && isMobileDevice) ||
      // Or older devices with smaller screens
      (width < 375 && isMobileDevice) ||
      // Or explicitly check for memory if available (Chrome only)
      (navigator.deviceMemory !== undefined && navigator.deviceMemory < 4)
    );

    // Check connection speed using Network Information API
    let isSlowConnection = false;
    if ('connection' in navigator) {
      const connection = navigator.connection;
      isSlowConnection = (
        connection.saveData === true || 
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g' || 
        connection.effectiveType === '3g'
      );
    }

    // Detect color scheme preference
    const colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    // Update capabilities
    capabilities = {
      isMobile: isMobileDevice && !isTabletDevice,
      isTablet: isTabletDevice,
      isDesktop: !isMobileDevice && !isTabletDevice,
      isLowMemoryDevice,
      isSlowConnection,
      prefersReducedMotion,
      screenWidth: width,
      screenHeight: height,
      devicePixelRatio,
      platform,
      orientation: height > width ? 'portrait' : 'landscape',
      touchEnabled: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      colorScheme,
    };

    // Cache the result
    deviceCapabilitiesCache = capabilities;
  }

  return capabilities;
}

/**
 * Animation optimizer to adjust animation settings based on device capabilities
 */
export const AnimationOptimizer = {
  /**
   * Get optimal animation duration based on device capabilities
   * @param {number} defaultDuration - Default animation duration in ms
   * @returns {number} - Adjusted duration
   */
  getOptimalAnimationDuration(defaultDuration) {
    if (!deviceCapabilitiesCache) {
      getDeviceCapabilities();
    }
    
    if (!deviceCapabilitiesCache) {
      return defaultDuration;
    }

    const { isLowMemoryDevice, isSlowConnection, prefersReducedMotion } = deviceCapabilitiesCache;
    
    // Reduce duration for performance
    if (prefersReducedMotion) return defaultDuration * 0.5;
    if (isLowMemoryDevice) return defaultDuration * 0.7;
    if (isSlowConnection) return defaultDuration * 0.8;
    
    return defaultDuration;
  },

  /**
   * Create responsive animation variants optimized for device capabilities
   * @param {Object} variants - Original animation variants
   * @returns {Object} - Optimized variants
   */
  createResponsiveVariants(variants) {
    if (!deviceCapabilitiesCache) {
      getDeviceCapabilities();
    }
    
    if (!deviceCapabilitiesCache) {
      return variants;
    }
    
    const { isLowMemoryDevice, prefersReducedMotion } = deviceCapabilitiesCache;

    // For reduced motion or low memory, simplify animations
    if (prefersReducedMotion || isLowMemoryDevice) {
      const simplifiedVariants = {};
      
      // Process each variant
      Object.keys(variants).forEach(key => {
        const variant = variants[key];
        const simplified = { ...variant };
        
        // Simplify transforms
        if (simplified.scale) simplified.scale = 1;
        if (simplified.rotate) simplified.rotate = 0;
        
        // Keep opacity for basic fade effects
        
        // Adjust transition
        if (simplified.transition) {
          simplified.transition = {
            ...simplified.transition,
            duration: this.getOptimalAnimationDuration(simplified.transition.duration || 300) / 1000
          };
        }
        
        simplifiedVariants[key] = simplified;
      });
      
      return simplifiedVariants;
    }
    
    return variants;
  }
};

/**
 * Responsive image loader that determines optimal image quality based on device
 * @param {Object} props - Image props
 * @returns {Object} - Modified props with optimal quality settings
 */
export function getResponsiveImageProps(props) {
  const capabilities = getDeviceCapabilities();
  
  // Default props
  const defaultProps = {
    loading: 'lazy',
    decoding: 'async',
  };

  // Determine quality based on device
  let quality = 85; // Default quality
  
  if (capabilities.isLowMemoryDevice || capabilities.isSlowConnection) {
    quality = 65; // Lower quality for low-end devices or slow connections
  } else if (capabilities.devicePixelRatio > 2) {
    quality = 80; // High DPI screens
  }

  // Generate srcset if we have width
  let srcSet = '';
  const sizes = [];
  
  if (props.src && props.width) {
    const widths = [320, 640, 768, 1024, 1280, 1920].filter(w => w <= props.width * 2);
    
    if (capabilities.isLowMemoryDevice || capabilities.isSlowConnection) {
      // Limit sizes for low-end devices
      widths.splice(3);
    }
    
    srcSet = widths.map(w => `${props.src}?w=${w}&q=${quality} ${w}w`).join(', ');
    
    // Generate sizes attribute
    if (capabilities.isDesktop) {
      sizes.push('(min-width: 1536px) 1536px');
      sizes.push('(min-width: 1280px) 1280px');
      sizes.push('(min-width: 1024px) 1024px');
    }
    
    if (capabilities.isTablet || capabilities.isDesktop) {
      sizes.push('(min-width: 768px) 768px');
    }
    
    sizes.push('(min-width: 640px) 640px');
    sizes.push('100vw');
  }
  
  return {
    ...defaultProps,
    ...props,
    quality,
    ...(srcSet ? { srcSet, sizes: sizes.join(', ') } : {})
  };
}

/**
 * Get appropriate media query breakpoints based on the device
 * @returns {Object} Media query breakpoints
 */
export function getResponsiveBreakpoints() {
  const capabilities = getDeviceCapabilities();
  
  // Default breakpoints
  const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  };
  
  // Adjust for device
  if (capabilities.isLowMemoryDevice) {
    // Simplify breakpoints for low-memory devices
    return {
      sm: '640px',
      md: '768px',
      lg: '1024px'
    };
  }
  
  return breakpoints;
}

/**
 * Create a debounced function to improve performance for expensive operations
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = 100) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

/**
 * Throttle function for scroll and resize events
 * @param {Function} func - Function to throttle
 * @param {number} limit - Throttle limit in ms
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Check if the current view is in a specific breakpoint range
 * @param {string} breakpoint - Breakpoint to check ('sm', 'md', 'lg', 'xl', '2xl')
 * @returns {boolean} - Whether the current view is in the breakpoint range
 */
export function useBreakpoint(breakpoint) {
  if (typeof window === 'undefined') return false;
  
  const breakpoints = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  };
  
  const width = window.innerWidth;
  
  switch(breakpoint) {
    case 'xs': return width < 640;
    case 'sm': return width >= 640 && width < 768;
    case 'md': return width >= 768 && width < 1024;
    case 'lg': return width >= 1024 && width < 1280;
    case 'xl': return width >= 1280 && width < 1536;
    case '2xl': return width >= 1536;
    default: return false;
  }
}

/**
 * Get optimal image size based on container width and device capabilities
 * @param {number} containerWidth - Container width in pixels
 * @param {Object} deviceCapabilities - Device capabilities
 * @returns {Object} - Optimal width, height, and quality
 */
export function getOptimalImageSize(containerWidth, deviceCapabilities) {
  const { devicePixelRatio = 1, isLowMemoryDevice, isSlowConnection } = deviceCapabilities || getDeviceCapabilities();
  
  // Calculate optimal width based on device pixel ratio
  let width = Math.round(containerWidth * devicePixelRatio);
  
  // Cap width for performance on low-end devices or slow connections
  if (isLowMemoryDevice || isSlowConnection) {
    width = Math.min(width, 800);
  }
  
  // Round to nearest 100 for better CDN caching
  width = Math.ceil(width / 100) * 100;
  
  // Determine quality based on device
  let quality = 85; // Default quality
  
  if (isLowMemoryDevice || isSlowConnection) {
    quality = 65; // Lower quality for low-end devices or slow connections
  } else if (devicePixelRatio > 2) {
    quality = 80; // High DPI screens
  }
  
  return { width, quality };
}

/**
 * Generate responsive image URLs for different screen sizes
 * @param {string} baseUrl - Base image URL
 * @param {string} cloudinaryId - Cloudinary ID (optional)
 * @returns {Object} - Object with URLs for different sizes
 */
export function generateResponsiveImageUrls(baseUrl, cloudinaryId = null) {
  // If using Cloudinary
  if (cloudinaryId) {
    return {
      thumbnail: `https://res.cloudinary.com/demo/image/upload/w_300,c_limit,q_auto/${cloudinaryId}`,
      small: `https://res.cloudinary.com/demo/image/upload/w_480,c_limit,q_auto/${cloudinaryId}`,
      medium: `https://res.cloudinary.com/demo/image/upload/w_768,c_limit,q_auto/${cloudinaryId}`,
      large: `https://res.cloudinary.com/demo/image/upload/w_1024,c_limit,q_auto/${cloudinaryId}`,
      xlarge: `https://res.cloudinary.com/demo/image/upload/w_1920,c_limit,q_auto/${cloudinaryId}`,
    };
  }
  
  // For regular URLs, append width parameter
  // This assumes your backend can handle width parameters
  const appendParam = (url, param) => {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${param}`;
  };
  
  return {
    thumbnail: appendParam(baseUrl, 'w=300'),
    small: appendParam(baseUrl, 'w=480'),
    medium: appendParam(baseUrl, 'w=768'),
    large: appendParam(baseUrl, 'w=1024'),
    xlarge: appendParam(baseUrl, 'w=1920'),
  };
}

/**
 * Create a lazy load observer for images
 * @param {Function} callback - Callback function when element is in view
 * @param {Object} options - IntersectionObserver options
 * @returns {IntersectionObserver} - IntersectionObserver instance
 */
export function createLazyLoadObserver(callback, options = {}) {
  if (typeof window === 'undefined') {
    return {
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {},
    };
  }
  
  const defaultOptions = {
    rootMargin: '50px',
    threshold: 0.1,
  };
  
  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
}

/**
 * Simple image cache to prevent reloading the same images
 */
export const ImageCache = {
  _cache: new Map(),
  
  /**
   * Get image from cache
   * @param {string} key - Cache key (usually image URL)
   * @returns {Object|null} - Cached image data or null
   */
  get(key) {
    return this._cache.get(key) || null;
  },
  
  /**
   * Set image in cache
   * @param {string} key - Cache key (usually image URL)
   * @param {Object} value - Image data to cache
   */
  set(key, value) {
    this._cache.set(key, value);
    
    // Limit cache size to prevent memory issues
    if (this._cache.size > 100) {
      const firstKey = this._cache.keys().next().value;
      this._cache.delete(firstKey);
    }
  },
  
  /**
   * Check if image is in cache
   * @param {string} key - Cache key (usually image URL)
   * @returns {boolean} - Whether image is in cache
   */
  has(key) {
    return this._cache.has(key);
  },
  
  /**
   * Clear cache
   */
  clear() {
    this._cache.clear();
  },
  
  /**
   * Get cache size
   * @returns {number} - Cache size
   */
  get size() {
    return this._cache.size;
  }
};

/**
 * Performance monitor for tracking image loading performance
 */
export const PerformanceMonitor = {
  _metrics: {
    imageLoadTimes: [],
    averageLoadTime: 0,
    totalImagesLoaded: 0,
  },
  
  /**
   * Record image load time
   * @param {number} startTime - Load start time
   * @param {number} endTime - Load end time
   * @param {number} imageSize - Image size in pixels (width * height)
   */
  recordImageLoadTime(startTime, endTime, imageSize = 0) {
    const loadTime = endTime - startTime;
    
    this._metrics.imageLoadTimes.push({
      loadTime,
      imageSize,
      timestamp: Date.now(),
    });
    
    this._metrics.totalImagesLoaded++;
    
    // Calculate average load time (weighted by image size)
    const totalLoadTime = this._metrics.imageLoadTimes.reduce((sum, metric) => sum + metric.loadTime, 0);
    this._metrics.averageLoadTime = totalLoadTime / this._metrics.totalImagesLoaded;
    
    // Limit metrics array size
    if (this._metrics.imageLoadTimes.length > 50) {
      this._metrics.imageLoadTimes.shift();
    }
    
    // Log performance issues
    if (loadTime > 1000) {
      console.warn(`Slow image load detected: ${Math.round(loadTime)}ms for ${imageSize} pixels`);
    }
  },
  
  /**
   * Get performance metrics
   * @returns {Object} - Performance metrics
   */
  getMetrics() {
    return { ...this._metrics };
  },
  
  /**
   * Reset performance metrics
   */
  reset() {
    this._metrics = {
      imageLoadTimes: [],
      averageLoadTime: 0,
      totalImagesLoaded: 0,
    };
  }
};