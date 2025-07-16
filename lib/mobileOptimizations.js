/**
 * Mobile optimization utilities for the College Memory Gallery
 * Handles responsive image loading, caching, and performance optimizations
 */

// Image size breakpoints for responsive loading
export const IMAGE_BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Cloudinary transformation parameters for different screen sizes
export const getCloudinaryTransforms = (width, quality = 'auto') => {
  return {
    width,
    quality,
    format: 'auto',
    crop: 'fill',
    gravity: 'auto',
    fetch_format: 'auto'
  };
};

// Generate responsive image URLs for different screen sizes
export const generateResponsiveImageUrls = (baseUrl, cloudinaryId) => {
  const sizes = {
    thumbnail: getCloudinaryTransforms(300, 80),
    small: getCloudinaryTransforms(480, 85),
    medium: getCloudinaryTransforms(768, 90),
    large: getCloudinaryTransforms(1024, 95),
    xlarge: getCloudinaryTransforms(1280, 100)
  };

  const urls = {};
  
  Object.entries(sizes).forEach(([size, transforms]) => {
    const params = new URLSearchParams(transforms).toString();
    urls[size] = `${baseUrl}?${params}`;
  });

  return urls;
};

// Detect device capabilities and network conditions
export const getDeviceCapabilities = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Detect network conditions
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
  const isFastConnection = connection && (connection.effectiveType === '4g' || connection.effectiveType === '5g');
  
  // Detect device memory (if available)
  const deviceMemory = navigator.deviceMemory || 4; // Default to 4GB if not available
  const isLowMemoryDevice = deviceMemory < 4;
  
  return {
    isMobile,
    isTablet,
    isTouch,
    isSlowConnection,
    isFastConnection,
    isLowMemoryDevice,
    deviceMemory,
    connectionType: connection?.effectiveType || 'unknown'
  };
};

// Optimize image loading based on device capabilities
export const getOptimalImageSize = (containerWidth, deviceCapabilities) => {
  const { isMobile, isSlowConnection, isLowMemoryDevice } = deviceCapabilities;
  
  // Reduce image quality for slow connections or low memory devices
  let quality = 90;
  if (isSlowConnection || isLowMemoryDevice) {
    quality = 75;
  }
  
  // Determine optimal width based on container and device
  let optimalWidth = containerWidth;
  
  if (isMobile) {
    // For mobile, use device pixel ratio but cap at 2x for performance
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    optimalWidth = Math.min(containerWidth * dpr, 800);
  } else {
    // For desktop, use higher resolution
    optimalWidth = Math.min(containerWidth * 1.5, 1200);
  }
  
  return {
    width: Math.round(optimalWidth),
    quality
  };
};

// Preload critical images for better performance
export const preloadCriticalImages = (imageUrls, priority = 'high') => {
  const preloadPromises = imageUrls.map(url => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      link.fetchPriority = priority;
      
      link.onload = () => resolve(url);
      link.onerror = () => reject(new Error(`Failed to preload ${url}`));
      
      document.head.appendChild(link);
    });
  });
  
  return Promise.allSettled(preloadPromises);
};

// Lazy loading intersection observer with mobile optimizations
export const createLazyLoadObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px', // Smaller margin for mobile to save bandwidth
    threshold: 0.1
  };
  
  const deviceCapabilities = getDeviceCapabilities();
  
  // Adjust root margin based on device capabilities
  if (deviceCapabilities.isMobile || deviceCapabilities.isSlowConnection) {
    defaultOptions.rootMargin = '25px'; // Smaller preload distance for mobile
  }
  
  const observerOptions = { ...defaultOptions, ...options };
  
  return new IntersectionObserver(callback, observerOptions);
};

// Image caching utilities
export const ImageCache = {
  cache: new Map(),
  maxSize: 50, // Maximum number of cached images
  
  set(key, value) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      ...value,
      timestamp: Date.now()
    });
  },
  
  get(key) {
    const item = this.cache.get(key);
    if (item) {
      // Update timestamp for LRU behavior
      item.timestamp = Date.now();
      return item;
    }
    return null;
  },
  
  has(key) {
    return this.cache.has(key);
  },
  
  clear() {
    this.cache.clear();
  },
  
  // Clean up old entries (older than 30 minutes)
  cleanup() {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutes
    
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > maxAge) {
        this.cache.delete(key);
      }
    }
  }
};

// Performance monitoring utilities
export const PerformanceMonitor = {
  metrics: {
    imageLoadTimes: [],
    animationFrameDrops: 0,
    memoryUsage: []
  },
  
  recordImageLoadTime(startTime, endTime, imageSize) {
    const loadTime = endTime - startTime;
    this.metrics.imageLoadTimes.push({
      loadTime,
      imageSize,
      timestamp: Date.now()
    });
    
    // Keep only last 50 measurements
    if (this.metrics.imageLoadTimes.length > 50) {
      this.metrics.imageLoadTimes.shift();
    }
  },
  
  getAverageLoadTime() {
    if (this.metrics.imageLoadTimes.length === 0) return 0;
    
    const total = this.metrics.imageLoadTimes.reduce((sum, metric) => sum + metric.loadTime, 0);
    return total / this.metrics.imageLoadTimes.length;
  },
  
  recordMemoryUsage() {
    if ('memory' in performance) {
      this.metrics.memoryUsage.push({
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        timestamp: Date.now()
      });
      
      // Keep only last 20 measurements
      if (this.metrics.memoryUsage.length > 20) {
        this.metrics.memoryUsage.shift();
      }
    }
  },
  
  isPerformanceDegraded() {
    const avgLoadTime = this.getAverageLoadTime();
    const deviceCapabilities = getDeviceCapabilities();
    
    // Define performance thresholds based on device capabilities
    let threshold = 2000; // 2 seconds for desktop
    
    if (deviceCapabilities.isMobile) {
      threshold = 3000; // 3 seconds for mobile
    }
    
    if (deviceCapabilities.isSlowConnection) {
      threshold = 5000; // 5 seconds for slow connections
    }
    
    return avgLoadTime > threshold;
  }
};

// Touch gesture utilities for mobile interactions
export const TouchGestureHandler = {
  // Detect swipe gestures
  detectSwipe(startTouch, endTouch, minDistance = 50, maxTime = 500) {
    const deltaX = endTouch.clientX - startTouch.clientX;
    const deltaY = endTouch.clientY - startTouch.clientY;
    const deltaTime = endTouch.timeStamp - startTouch.timeStamp;
    
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    const isQuickSwipe = deltaTime < maxTime;
    const isLongEnoughSwipe = Math.abs(deltaX) > minDistance;
    
    if (isHorizontalSwipe && isQuickSwipe && isLongEnoughSwipe) {
      return {
        direction: deltaX > 0 ? 'right' : 'left',
        distance: Math.abs(deltaX),
        velocity: Math.abs(deltaX) / deltaTime
      };
    }
    
    return null;
  },
  
  // Detect pinch gestures for zoom
  detectPinch(touches) {
    if (touches.length !== 2) return null;
    
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    const distance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
    
    const centerX = (touch1.clientX + touch2.clientX) / 2;
    const centerY = (touch1.clientY + touch2.clientY) / 2;
    
    return {
      distance,
      center: { x: centerX, y: centerY }
    };
  }
};

// Animation optimization utilities
export const AnimationOptimizer = {
  // Detect if device can handle complex animations
  canHandleComplexAnimations() {
    if (typeof window === 'undefined') return true;
    
    const deviceCapabilities = getDeviceCapabilities();
    return !(deviceCapabilities.isLowMemoryDevice || deviceCapabilities.isSlowConnection);
  },
  
  // Get optimal animation duration based on device capabilities
  getOptimalAnimationDuration(baseDuration = 300) {
    if (typeof window === 'undefined') return baseDuration;
    
    const deviceCapabilities = getDeviceCapabilities();
    
    if (deviceCapabilities.isLowMemoryDevice || deviceCapabilities.isSlowConnection) {
      return Math.min(baseDuration, 150); // Shorter animations for low-end devices
    }
    
    return baseDuration;
  },
  
  // Create responsive animation variants based on device capabilities
  createResponsiveVariants(baseVariants) {
    if (typeof window === 'undefined') return baseVariants;
    
    const deviceCapabilities = getDeviceCapabilities();
    const isLowPerformance = deviceCapabilities.isLowMemoryDevice || deviceCapabilities.isSlowConnection;
    
    if (isLowPerformance) {
      // Simplified variants for low-performance devices
      return {
        container: {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        },
        item: {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        }
      };
    }
    
    return baseVariants;
  }
};

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  // Clean up image cache periodically
  setInterval(() => {
    ImageCache.cleanup();
  }, 5 * 60 * 1000); // Every 5 minutes
  
  // Record memory usage periodically
  setInterval(() => {
    PerformanceMonitor.recordMemoryUsage();
  }, 10 * 1000); // Every 10 seconds
}