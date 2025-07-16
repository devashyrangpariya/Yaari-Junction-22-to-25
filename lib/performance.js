'use client';

// Performance monitoring and optimization utilities
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isSupported = typeof window !== 'undefined' && 'performance' in window;
  }

  // Core Web Vitals monitoring
  measureCoreWebVitals() {
    if (!this.isSupported) return;

    // Largest Contentful Paint (LCP)
    this.observeLCP();
    
    // First Input Delay (FID)
    this.observeFID();
    
    // Cumulative Layout Shift (CLS)
    this.observeCLS();
    
    // First Contentful Paint (FCP)
    this.observeFCP();
  }

  observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.metrics.set('LCP', {
        value: lastEntry.startTime,
        rating: this.rateLCP(lastEntry.startTime),
        timestamp: Date.now()
      });
      
      // Log if performance is poor
      if (lastEntry.startTime > 2500) {
        console.warn(`Poor LCP: ${lastEntry.startTime}ms (target: <2500ms)`);
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.set('LCP', observer);
  }

  observeFID() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.metrics.set('FID', {
          value: entry.processingStart - entry.startTime,
          rating: this.rateFID(entry.processingStart - entry.startTime),
          timestamp: Date.now()
        });
      });
    });

    observer.observe({ entryTypes: ['first-input'] });
    this.observers.set('FID', observer);
  }

  observeCLS() {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries = [];

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (sessionValue && 
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            this.metrics.set('CLS', {
              value: clsValue,
              rating: this.rateCLS(clsValue),
              timestamp: Date.now()
            });
          }
        }
      });
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.set('CLS', observer);
  }

  observeFCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.set('FCP', {
            value: entry.startTime,
            rating: this.rateFCP(entry.startTime),
            timestamp: Date.now()
          });
        }
      });
    });

    observer.observe({ entryTypes: ['paint'] });
    this.observers.set('FCP', observer);
  }

  // Rating functions based on Core Web Vitals thresholds
  rateLCP(value) {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  rateFID(value) {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  rateCLS(value) {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  rateFCP(value) {
    if (value <= 1800) return 'good';
    if (value <= 3000) return 'needs-improvement';
    return 'poor';
  }

  // Get current metrics
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // Performance optimization utilities
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Lazy loading utilities
  static createIntersectionObserver(callback, options = {}) {
    const defaultOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
  }

  // Image optimization
  static optimizeImageLoading() {
    // Add loading="lazy" to images that don't have it
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }

  // Memory management
  static cleanupEventListeners() {
    // Remove unused event listeners
    const elements = document.querySelectorAll('[data-cleanup-listeners]');
    elements.forEach(element => {
      const listeners = element.dataset.cleanupListeners?.split(',') || [];
      listeners.forEach(eventType => {
        element.removeEventListener(eventType, () => {});
      });
    });
  }

  // Animation performance
  static optimizeAnimations() {
    // Reduce animations for users who prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    }

    // Use transform and opacity for animations (GPU accelerated)
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(element => {
      element.style.willChange = 'transform, opacity';
    });
  }

  // Bundle size optimization
  static async loadComponentDynamically(componentPath) {
    try {
      const component = await import(componentPath);
      return component.default || component;
    } catch (error) {
      console.error(`Failed to load component: ${componentPath}`, error);
      return null;
    }
  }

  // Cleanup method
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.metrics.clear();
  }
}

// Image loading optimization
export class ImageLoadingOptimizer {
  constructor() {
    this.loadedImages = new Set();
    this.loadingImages = new Map();
    this.observer = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          rootMargin: '50px',
          threshold: 0.1
        }
      );
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }

  async loadImage(img) {
    if (this.loadedImages.has(img.src)) return;

    const src = img.dataset.src || img.src;
    if (!src) return;

    try {
      this.loadingImages.set(src, true);
      
      const image = new Image();
      image.onload = () => {
        img.src = src;
        img.classList.add('loaded');
        this.loadedImages.add(src);
        this.loadingImages.delete(src);
      };
      
      image.onerror = () => {
        img.classList.add('error');
        this.loadingImages.delete(src);
      };
      
      image.src = src;
    } catch (error) {
      console.error('Image loading failed:', error);
      this.loadingImages.delete(src);
    }
  }

  observeImage(img) {
    if (this.observer) {
      this.observer.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadImage(img);
    }
  }

  preloadCriticalImages(urls) {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.loadedImages.clear();
    this.loadingImages.clear();
  }
}

// Animation performance optimizer
export class AnimationOptimizer {
  constructor() {
    this.activeAnimations = new Set();
    this.rafId = null;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Optimize animation frame rate
  requestOptimizedFrame(callback) {
    if (this.prefersReducedMotion) {
      // Skip animation for users who prefer reduced motion
      callback();
      return;
    }

    this.rafId = requestAnimationFrame(() => {
      callback();
      this.rafId = null;
    });
  }

  // Batch DOM reads and writes
  batchDOMOperations(reads, writes) {
    // Batch all reads first
    const readResults = reads.map(read => read());
    
    // Then batch all writes
    this.requestOptimizedFrame(() => {
      writes.forEach((write, index) => {
        write(readResults[index]);
      });
    });
  }

  // Optimize scroll animations
  optimizeScrollAnimation(element, callback) {
    let ticking = false;

    const updateAnimation = () => {
      callback();
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        this.requestOptimizedFrame(updateAnimation);
        ticking = true;
      }
    };

    return PerformanceMonitor.throttle(requestTick, 16); // ~60fps
  }

  // GPU acceleration helpers
  enableGPUAcceleration(element) {
    element.style.willChange = 'transform, opacity';
    element.style.transform = 'translateZ(0)';
  }

  disableGPUAcceleration(element) {
    element.style.willChange = 'auto';
    element.style.transform = '';
  }

  // Cleanup
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.activeAnimations.clear();
  }
}

// Export singleton instances
export const performanceMonitor = new PerformanceMonitor();
export const imageOptimizer = new ImageLoadingOptimizer();
export const animationOptimizer = new AnimationOptimizer();

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.measureCoreWebVitals();
  
  // Optimize on page load
  window.addEventListener('load', () => {
    PerformanceMonitor.optimizeImageLoading();
    PerformanceMonitor.optimizeAnimations();
  });
}