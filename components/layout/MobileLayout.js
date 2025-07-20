// components/layout/MobileLayout.js
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
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Initialize device capabilities
    const capabilities = getDeviceCapabilities();
    setDeviceCapabilities(capabilities);
    setIsMobile(capabilities.isMobile);
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
    const performanceClasses = deviceCapabilities?.isLowMemoryDevice ? "mobile-reduced-motion" : "";
    const orientationClasses = orientation === 'landscape' && deviceCapabilities?.isMobile 
      ? "landscape-mobile" 
      : "";
    
    return `${baseClasses} ${mobileClasses} ${performanceClasses} ${orientationClasses}`.trim();
  };

  const getMainClasses = () => {
    const baseClasses = "flex-1 pt-16 sm:pt-20 lg:pt-24";
    const mobileClasses = deviceCapabilities?.isMobile 
      ? "px-3 sm:px-4" 
      : "px-4 sm:px-6 lg:px-8";
    
    return `${baseClasses} ${mobileClasses}`.trim();
  };

  // Calculate if this is a truly small mobile device that needs orientation warning
  // For tablets and larger devices, we don't need to show this warning
  const isSmallMobileDevice = deviceCapabilities?.isMobile && 
                              deviceCapabilities?.screenWidth < 768 &&
                              orientation === 'landscape';

  return (
    <div className={getLayoutClasses()}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className={getMainClasses()}>
        <div className="max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              variants={deviceCapabilities?.isLowMemoryDevice ? {} : pageVariants}
              initial={deviceCapabilities?.isLowMemoryDevice ? { opacity: 0 } : "initial"}
              animate={deviceCapabilities?.isLowMemoryDevice ? { opacity: 1 } : "in"}
              exit={deviceCapabilities?.isLowMemoryDevice ? { opacity: 0 } : "out"}
              transition={deviceCapabilities?.isLowMemoryDevice ? { duration: 0.2 } : {}}
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

          {/* Low memory warning - make less obtrusive */}
          {deviceCapabilities.isLowMemoryDevice && (
            <div className="fixed top-20 right-4 z-40 pointer-events-none">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600 rounded-lg p-2 text-center">
                <p className="text-yellow-700 dark:text-yellow-300 text-xs">
                  Performance mode active
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Orientation change helper for small mobile devices only */}
      {isSmallMobileDevice && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" 
          data-orientation-helper
        >
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
      // Use a simpler view for low memory devices
      if (capabilities.isLowMemoryDevice) {
        setViewMode('list');
      } else {
        setViewMode('grid');
      }
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

        {/* View mode selector - hide on low memory devices to simplify UI */}
        {!deviceCapabilities?.isLowMemoryDevice && (
          <div className="flex items-center justify-end space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">View:</span>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {['grid', 'list', 'masonry'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
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
    setDeviceCapabilities(getDeviceCapabilities());
  }, []);

  const getModalClasses = () => {
    const baseClasses = "bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden max-h-[90vh] w-full max-w-3xl";
    const mobileClasses = deviceCapabilities?.isMobile ? "mobile-modal" : "";
    
    return `${baseClasses} ${mobileClasses} ${className}`.trim();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={getModalClasses()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          </div>
        )}
        
        <div className={`${deviceCapabilities?.isMobile ? 'mobile-modal-content' : 'p-6'} overflow-y-auto`}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}