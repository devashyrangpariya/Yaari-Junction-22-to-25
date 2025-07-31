// app/gallery/page.js
// Image gallery with year filtering, mobile optimization, and lightbox functionality
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiCalendar, 
  HiFilter,
  HiX,
} from 'react-icons/hi';
import ScrollableGallery from '../../components/gallery/ScrollableGallery';
import YearSelector from '../../components/gallery/YearSelector';
import { ScrollProgressIndicator } from '../../components/gallery/ScrollAnimation';
import { GALLERY_YEARS } from '../../lib/constants';
import { getDeviceCapabilities } from '../../lib/mobileOptimizations';

// Import gallery data from JSON file
import galleryData from '../../components/gallery/data/gallery-images.json';

export default function GalleryPage() {
  const [selectedYear, setSelectedYear] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [galleryKey, setGalleryKey] = useState(Date.now());
  const [deviceCapabilities, setDeviceCapabilities] = useState(null);
  
  useEffect(() => {
    setIsMounted(true);
    setDeviceCapabilities(getDeviceCapabilities());
    
    // Show filters by default on desktop, hide on mobile
    if (typeof window !== 'undefined') {
      setShowFilters(window.innerWidth >= 768);
    }
    
    // Reset gallery key when changing years to force re-render
    // This helps with performance on mobile
    if (selectedYear) {
      setGalleryKey(Date.now());
    }
  }, [selectedYear]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    
    // Auto-hide filters on mobile after selection
    if (deviceCapabilities?.isMobile && showFilters) {
      setShowFilters(false);
    }
  };

  // Calculate year statistics
  const yearStats = {};
  GALLERY_YEARS.forEach(year => {
    yearStats[year] = {
      totalImages: galleryData[year]?.length || 0
    };
  });
  
  // Determine if we should use reduced motion for better performance
  const shouldReduceMotion = deviceCapabilities?.isLowMemoryDevice || deviceCapabilities?.prefersReducedMotion;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Global scroll progress indicator */}
      <ScrollProgressIndicator />
      
      {/* Gallery Controls - Fixed on mobile, sticky on desktop */}
      <section 
        className={`py-2 sm:py-3 border-b border-gray-200 dark:border-gray-800 ${
          deviceCapabilities?.isMobile 
            ? "fixed top-16 sm:top-20 left-0 right-0" 
            : "sticky top-20"
        } bg-white dark:bg-gray-900 z-20 shadow-sm`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
            {/* Left Controls */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.div 
                className="flex items-center space-x-2"
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: shouldReduceMotion ? 0.2 : 0.5 }}
              >
                <HiCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 dark:text-indigo-400" />
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">
                  {selectedYear === 'all' ? 'All Years' : selectedYear}
                </span>
              </motion.div>
              
              <motion.button
                className="p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 touch-manipulation"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                aria-label={showFilters ? "Hide filters" : "Show filters"}
                aria-expanded={showFilters}
              >
                {showFilters ? <HiX className="w-4 h-4 sm:w-5 sm:h-5" /> : <HiFilter className="w-4 h-4 sm:w-5 sm:h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section - Collapsible */}
      <AnimatePresence>
        {showFilters && (
          <motion.section 
            className={`bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${
              deviceCapabilities?.isMobile ? 'mt-10 sm:mt-12' : ''
            }`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.3 }}
          >
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
              <YearSelector 
                selectedYear={selectedYear}
                onYearChange={handleYearChange}
                yearStats={yearStats}
                useReducedMotion={shouldReduceMotion}
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Main Gallery Section - Add proper mobile spacing */}
      <section className={`py-3 sm:py-6 ${deviceCapabilities?.isMobile ? 'mt-10 sm:mt-12' : ''}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {isMounted && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedYear}-${galleryKey}`}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0.2 : 0.5 }}
              >
                <ScrollableGallery 
                  galleryData={galleryData}
                  selectedYear={selectedYear}
                  onYearChange={handleYearChange}
                  className="min-h-[300px] sm:min-h-[500px]"
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  );
} 

