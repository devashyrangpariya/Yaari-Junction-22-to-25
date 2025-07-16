'use client';

/**
 * Browser compatibility detection and feature testing
 * Used for progressive enhancement and graceful degradation
 */

// Detect browser and version
export function detectBrowser() {
  if (typeof window === 'undefined') return null;
  
  const userAgent = window.navigator.userAgent;
  let browser = 'Unknown';
  let version = 'Unknown';
  
  // Detect Chrome
  if (/Chrome/.test(userAgent) && !/Chromium|Edge|Edg|OPR|Opera/.test(userAgent)) {
    browser = 'Chrome';
    version = userAgent.match(/Chrome\/(\d+\.\d+)/)?.[1] || 'Unknown';
  }
  // Detect Firefox
  else if (/Firefox/.test(userAgent)) {
    browser = 'Firefox';
    version = userAgent.match(/Firefox\/(\d+\.\d+)/)?.[1] || 'Unknown';
  }
  // Detect Safari (non-Chrome browsers on iOS are Safari)
  else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
    browser = 'Safari';
    version = userAgent.match(/Version\/(\d+\.\d+)/)?.[1] || 'Unknown';
  }
  // Detect Edge
  else if (/Edg|Edge/.test(userAgent)) {
    browser = 'Edge';
    version = userAgent.match(/Edg\/(\d+\.\d+)/)?.[1] || 
              userAgent.match(/Edge\/(\d+\.\d+)/)?.[1] || 'Unknown';
  }
  // Detect Opera
  else if (/OPR|Opera/.test(userAgent)) {
    browser = 'Opera';
    version = userAgent.match(/OPR\/(\d+\.\d+)/)?.[1] || 
              userAgent.match(/Opera\/(\d+\.\d+)/)?.[1] || 'Unknown';
  }
  // Detect IE
  else if (/Trident/.test(userAgent)) {
    browser = 'Internet Explorer';
    version = userAgent.match(/rv:(\d+\.\d+)/)?.[1] || 'Unknown';
  }
  
  return { browser, version };
}

// Feature detection functions
export const features = {
  // CSS features
  cssGrid: () => typeof window !== 'undefined' && 
    window.CSS && CSS.supports && CSS.supports('display', 'grid'),
  
  cssFlexbox: () => typeof window !== 'undefined' && 
    window.CSS && CSS.supports && CSS.supports('display', 'flex'),
  
  cssVariables: () => typeof window !== 'undefined' && 
    window.CSS && CSS.supports && CSS.supports('--test: 0'),
  
  // JavaScript APIs
  intersectionObserver: () => typeof window !== 'undefined' && 
    'IntersectionObserver' in window,
  
  resizeObserver: () => typeof window !== 'undefined' && 
    'ResizeObserver' in window,
  
  mutationObserver: () => typeof window !== 'undefined' && 
    'MutationObserver' in window,
  
  webAnimations: () => typeof window !== 'undefined' && 
    'animate' in document.createElement('div'),
  
  webShare: () => typeof window !== 'undefined' && 
    'share' in navigator,
  
  webP: () => new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  }),
  
  avif: () => new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK';
  })
};

// Check all features and return compatibility report
export async function checkCompatibility() {
  const browser = detectBrowser();
  
  // Get all feature results
  const featureResults = {
    cssGrid: features.cssGrid(),
    cssFlexbox: features.cssFlexbox(),
    cssVariables: features.cssVariables(),
    intersectionObserver: features.intersectionObserver(),
    resizeObserver: features.resizeObserver(),
    mutationObserver: features.mutationObserver(),
    webAnimations: features.webAnimations(),
    webShare: features.webShare()
  };
  
  // Add async feature checks
  featureResults.webP = await features.webP();
  featureResults.avif = await features.avif();
  
  // Calculate overall compatibility score (0-100)
  const totalFeatures = Object.keys(featureResults).length;
  const supportedFeatures = Object.values(featureResults).filter(Boolean).length;
  const score = Math.round((supportedFeatures / totalFeatures) * 100);
  
  return {
    browser,
    features: featureResults,
    score,
    timestamp: new Date().toISOString()
  };
}

// Apply polyfills based on feature detection
export function applyPolyfills() {
  // IntersectionObserver polyfill
  if (!features.intersectionObserver()) {
    import('intersection-observer').then(() => {
      console.log('IntersectionObserver polyfill loaded');
    });
  }
  
  // ResizeObserver polyfill
  if (!features.resizeObserver()) {
    import('resize-observer-polyfill').then(() => {
      console.log('ResizeObserver polyfill loaded');
    });
  }
  
  // Web Animations API polyfill
  if (!features.webAnimations()) {
    import('web-animations-js').then(() => {
      console.log('Web Animations API polyfill loaded');
    });
  }
}

// Apply CSS fallbacks for unsupported features
export function applyCssFallbacks() {
  if (typeof document === 'undefined') return;
  
  const html = document.documentElement;
  
  // Add classes to HTML element for CSS feature detection
  if (!features.cssGrid()) {
    html.classList.add('no-css-grid');
  }
  
  if (!features.cssFlexbox()) {
    html.classList.add('no-css-flexbox');
  }
  
  if (!features.cssVariables()) {
    html.classList.add('no-css-variables');
  }
  
  // Add browser classes
  const { browser } = detectBrowser() || {};
  if (browser) {
    html.classList.add(`browser-${browser.toLowerCase().replace(/\s+/g, '-')}`);
  }
} 