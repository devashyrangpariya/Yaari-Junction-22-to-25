'use client';

// ARIA label generators for different components
export const ARIA_LABELS = {
  // Navigation
  MAIN_NAVIGATION: 'Main navigation',
  MOBILE_MENU_TOGGLE: 'Toggle mobile menu',
  CLOSE_MENU: 'Close menu',
  BREADCRUMB: 'Breadcrumb navigation',
  
  // Gallery
  IMAGE_GALLERY: 'Photo gallery',
  IMAGE_GRID: 'Grid of photos',
  IMAGE_ITEM: (title, index, total) => `Photo ${index + 1} of ${total}: ${title}`,
  NEXT_IMAGE: 'Next photo',
  PREVIOUS_IMAGE: 'Previous photo',
  CLOSE_IMAGE: 'Close photo viewer',
  DOWNLOAD_IMAGE: 'Download photo',
  ZOOM_IN: 'Zoom in',
  ZOOM_OUT: 'Zoom out',
  
  // Friends
  FRIENDS_GRID: 'Friends list',
  FRIEND_CARD: (name) => `Friend profile: ${name}`,
  SOCIAL_LINK: (platform, name) => `${name}'s ${platform} profile`,
  
  // Sports
  SPORTS_SECTION: 'Sports achievements',
  TEAM_SECTION: (teamName) => `${teamName} team section`,
  ACHIEVEMENT_CARD: (title) => `Achievement: ${title}`,
  
  // Forms and Controls
  SEARCH_INPUT: 'Search photos and memories',
  FILTER_BUTTON: 'Filter options',
  SORT_BUTTON: 'Sort options',
  UPLOAD_BUTTON: 'Upload photos',
  
  // Status and Feedback
  LOADING: 'Loading content',
  ERROR_MESSAGE: 'Error message',
  SUCCESS_MESSAGE: 'Success message',
  RETRY_BUTTON: 'Retry action',
  
  // Modal and Overlay
  MODAL_DIALOG: 'Dialog',
  MODAL_CLOSE: 'Close dialog',
  OVERLAY: 'Overlay'
};

// Screen reader announcements
export function announceToScreenReader(message, priority = 'polite') {
  if (typeof document === 'undefined') return;
  
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Generate accessible descriptions
export function generateImageDescription(image) {
  const parts = [];
  
  if (image.title) {
    parts.push(image.title);
  }
  
  if (image.friends && image.friends.length > 0) {
    const friendsList = image.friends.join(', ');
    parts.push(`featuring ${friendsList}`);
  }
  
  if (image.year) {
    parts.push(`from ${image.year}`);
  }
  
  if (image.tags && image.tags.length > 0) {
    parts.push(`tagged as ${image.tags.join(', ')}`);
  }
  
  return parts.join(', ');
}

// Keyboard navigation helpers
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End'
};

// Focus management utilities
export function createFocusableElementsQuery() {
  return [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');
}

export function getNextFocusableElement(currentElement, direction = 'forward') {
  if (typeof document === 'undefined') return null;
  
  const focusableElements = Array.from(
    document.querySelectorAll(createFocusableElementsQuery())
  );
  
  const currentIndex = focusableElements.indexOf(currentElement);
  
  if (currentIndex === -1) return null;
  
  if (direction === 'forward') {
    return focusableElements[currentIndex + 1] || focusableElements[0];
  } else {
    return focusableElements[currentIndex - 1] || focusableElements[focusableElements.length - 1];
  }
}

// Color contrast utilities
export function getContrastRatio(color1, color2) {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd want a more robust color parsing library
  const getLuminance = (color) => {
    // This is a simplified version - you'd want proper color parsing
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    
    const [r, g, b] = rgb.map(c => {
      c = parseInt(c) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// Reduced motion detection
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// High contrast detection
export function prefersHighContrast() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
}

// Screen reader detection
export function isScreenReaderActive() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  // This is a heuristic - not 100% reliable
  return window.navigator.userAgent.includes('NVDA') ||
         window.navigator.userAgent.includes('JAWS') ||
         window.speechSynthesis?.speaking ||
         document.activeElement?.getAttribute('aria-live');
}

// Generate skip links
export function generateSkipLinks() {
  return [
    { href: '#main-content', text: 'Skip to main content' },
    { href: '#navigation', text: 'Skip to navigation' },
    { href: '#search', text: 'Skip to search' },
    { href: '#footer', text: 'Skip to footer' }
  ];
}

// Accessible form validation
export function createAccessibleValidation(fieldId, message, type = 'error') {
  if (typeof document === 'undefined') return;
  
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  // Create or update error message
  let errorElement = document.getElementById(`${fieldId}-error`);
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.id = `${fieldId}-error`;
    errorElement.className = 'sr-only';
    field.parentNode.insertBefore(errorElement, field.nextSibling);
  }
  
  errorElement.textContent = message;
  errorElement.setAttribute('role', type === 'error' ? 'alert' : 'status');
  
  // Update field attributes
  field.setAttribute('aria-describedby', `${fieldId}-error`);
  field.setAttribute('aria-invalid', type === 'error' ? 'true' : 'false');
  
  // Announce to screen readers
  announceToScreenReader(message, type === 'error' ? 'assertive' : 'polite');
}

// Live region manager
export class LiveRegionManager {
  constructor() {
    this.regions = new Map();
    // Only create regions in browser environment
    if (typeof document !== 'undefined') {
      this.createLiveRegions();
    }
  }
  
  createLiveRegions() {
    const priorities = ['polite', 'assertive'];
    
    priorities.forEach(priority => {
      const region = document.createElement('div');
      region.setAttribute('aria-live', priority);
      region.setAttribute('aria-atomic', 'true');
      region.className = 'sr-only';
      region.id = `live-region-${priority}`;
      
      document.body.appendChild(region);
      this.regions.set(priority, region);
    });
  }
  
  announce(message, priority = 'polite') {
    // Skip if not in browser environment
    if (typeof document === 'undefined') return;
    
    const region = this.regions.get(priority);
    if (region) {
      region.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        region.textContent = '';
      }, 1000);
    }
  }
  
  destroy() {
    if (typeof document === 'undefined') return;
    
    this.regions.forEach(region => {
      if (region.parentNode) {
        region.parentNode.removeChild(region);
      }
    });
    
    this.regions.clear();
  }
}

// Export singleton instance
export const liveRegionManager = new LiveRegionManager();