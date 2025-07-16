'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import { getDeviceCapabilities, AnimationOptimizer } from '../../lib/mobileOptimizations';

export default function MobileLayout({ children }) {
  const [deviceCapabilities, setDeviceCapabilities] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orientation, setOrientation] = useState('portrait');
  const pathname = usePathname();

  useEffect(() => {
    // Initialize device capabilities
    const capabilities = getDeviceCapabilities();
    setDeviceCapabilities(capabilities);
    setIsLoading(false);

    // Handle orientation changes
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    // Initial orientation
    handleOrientationChange();

    // Listen for orientation changes
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Get optimized animation variants based on device capabilities
  const pageVariants = AnimationOptimizer.createResponsiveVariants({
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.98
    },
    in: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: AnimationOptimizer.getOptimalAnimationDuration(400),
        ease: "easeOut"
      }
    },
    out: { 
      opacity: 0, 
      y: -20,
      scale: 1.02,
      transition: {
        duration: AnimationOptimizer.getOptimalAnimationDuration(300),
        ease: "easeIn"
      }
    }
  });

  // Loading screen for initial device detection
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getLayoutClasses = () => {
    const baseClasses = "min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col";
    const mobileClasses = deviceCapabilities?.isMobile ? "mobile-optimized" : "";
    const orientationClasses = orientation === 'landscape' && deviceCapabilities?.isMobile 
      ? "landscape-mobile" 
      : "";
    
    return `${baseClasses} ${mobileClasses} ${orientationClasses}`;
  };

  const getMainClasses = () => {
    const baseClasses = "flex-1 pt-16 sm:pt-20 lg:pt-24";
    const mobileClasses = deviceCapabilities?.isMobile 
      ? "px-3 sm:px-4" 
      : "px-4 sm:px-6 lg:px-8";
    
    return `${baseClasses} ${mobileClasses}`;
  };

  return (
    <div className={getLayoutClasses()}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className={getMainClasses()}>
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              className="w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile-specific overlays and indicators */}
      {deviceCapabilities?.isMobile && (
        <>
          {/* Network status indicator */}
          {deviceCapabilities.isSlowConnection && (
            <div className="fixed bottom-4 left-4 right-4 z-40 pointer-events-none">
              <div className="bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-600 rounded-lg p-3 text-center">
                <p className="text-orange-700 dark:text-orange-300 text-sm">
                  Slow connection detected. Images may load slower.
                </p>
              </div>
            </div>
          )}

          {/* Low memory warning */}
          {deviceCapabilities.isLowMemoryDevice && (
            <div className="fixed top-20 left-4 right-4 z-40 pointer-events-none">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600 rounded-lg p-3 text-center">
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  Performance mode enabled for optimal experience.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Orientation change helper for mobile */}
      {deviceCapabilities?.isMobile && orientation === 'landscape' && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center lg:hidden">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 m-4 text-center max-w-sm">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Better in Portrait
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                For the best experience, please rotate your device to portrait mode.
              </p>
            </div>
            <button
              onClick={() => {
                // This is just a visual helper, actual rotation is handled by the user
                document.querySelector('[data-orientation-helper]').style.display = 'none';
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized layout for gallery pages
export function GalleryLayout({ children, title, description }) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'masonry'
  const [deviceCapabilities, setDeviceCapabilities] = useState(null);

  useEffect(() => {
    const capabilities = getDeviceCapabilities();
    setDeviceCapabilities(capabilities);
    
    // Auto-select optimal view mode for mobile
    if (capabilities.isMobile) {
      setViewMode('grid');
    }
  }, []);

  return (
    <MobileLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        {(title || description) && (
          <div className="text-center sm:text-left">
            {title && (
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                {description}
              </p>
            )}
          </div>
        )}

        {/* View mode selector for non-mobile */}
        {!deviceCapabilities?.isMobile && (
          <div className="flex items-center justify-end space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {['grid', 'list', 'masonry'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === mode
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`gallery-container view-${viewMode}`}>
          {children}
        </div>
      </div>
    </MobileLayout>
  );
}

// Layout for modal/overlay content
export function ModalLayout({ children, onClose, title, className = '' }) {
  const [deviceCapabilities, setDeviceCapabilities] = useState(null);

  useEffect(() => {
    const capabilities = getDeviceCapabilities();
    setDeviceCapabilities(capabilities);
  }, []);

  const getModalClasses = () => {
    const baseClasses = "fixed inset-0 z-50 flex items-center justify-center p-4";
    const mobileClasses = deviceCapabilities?.isMobile ? "mobile-modal p-0" : "";
    
    return `${baseClasses} ${mobileClasses} ${className}`;
  };

  return (
    <div className={getModalClasses()}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className={`relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden ${
        deviceCapabilities?.isMobile ? 'mobile-modal-content' : ''
      }`}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}