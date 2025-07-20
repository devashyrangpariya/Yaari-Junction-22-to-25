'use client';

import { motion } from 'framer-motion';
import { HiCalendar, HiPhotograph, HiChevronRight, HiDownload } from 'react-icons/hi';
import { GALLERY_YEARS } from '../../lib/constants';

export default function YearSelector({ 
  selectedYear, 
  onYearChange, 
  yearStats = {},
  className = '',
  useReducedMotion = false
}) {
  // Calculate total images across all years
  const totalImages = Object.values(yearStats).reduce(
    (total, stats) => total + (stats.totalImages || 0), 
    0
  );

  // Simpler animations for performance
  const containerAnimations = useReducedMotion ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  } : {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] }
  };

  // Header animations
  const headerAnimations = useReducedMotion ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay: 0.1 }
  } : {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay: 0.2 }
  };

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg ${className}`}
      {...containerAnimations}
    >
      <motion.div
        className="flex items-center justify-between mb-6 sm:mb-8"
        {...headerAnimations}
      >
        <div className="flex items-center space-x-2">
          <HiCalendar className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Select Year
          </h2>
        </div>
        
        <motion.button
          className="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center space-x-1 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          onClick={() => onYearChange('all')}
          whileHover={useReducedMotion ? {} : { scale: 1.05, x: 3 }}
          whileTap={useReducedMotion ? {} : { scale: 0.95 }}
        >
          <span>View All</span>
          <HiChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </motion.button>
      </motion.div>

      {/* Year Timeline - Optimized for mobile */}
      <div className="relative mb-6 sm:mb-10 overflow-x-auto pb-2">
        <motion.div 
          className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 rounded-full"
          initial={useReducedMotion ? { opacity: 0 } : { scaleX: 0 }}
          animate={useReducedMotion ? { opacity: 1 } : { scaleX: 1 }}
          transition={{ duration: useReducedMotion ? 0.3 : 0.8, delay: 0.1 }}
        ></motion.div>
        
        <div className="flex justify-between relative py-4 min-w-[500px] px-4">
          {GALLERY_YEARS.map((year, index) => {
            const isSelected = selectedYear === year;
            const stats = yearStats[year] || { totalImages: 0 };
            const hasImages = stats.totalImages > 0;
            
            // Simplified animations for performance
            const dotAnimations = useReducedMotion ? {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: index * 0.05 }
            } : {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { 
                delay: 0.2 + index * 0.1, 
                duration: 0.5,
                ease: [0.25, 1, 0.5, 1],
                type: 'spring', 
                stiffness: 400, 
                damping: 15
              }
            };
            
            return (
              <motion.button
                key={year}
                className={`relative z-10 ${!hasImages && 'opacity-50 cursor-not-allowed'}`}
                onClick={() => hasImages && onYearChange(year)}
                whileHover={hasImages && !useReducedMotion ? { scale: 1.1, y: -2 } : {}}
                whileTap={hasImages && !useReducedMotion ? { scale: 0.9 } : {}}
                {...dotAnimations}
              >
                <motion.div 
                  className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full mx-auto mb-1 sm:mb-2 border-2 ${
                    isSelected 
                      ? 'bg-indigo-600 border-indigo-600 dark:bg-indigo-400 dark:border-indigo-400 ring-2 sm:ring-4 ring-indigo-200 dark:ring-indigo-900' 
                      : hasImages 
                        ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                        : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                  }`}
                  animate={isSelected && !useReducedMotion ? { 
                    scale: [1, 1.3, 1],
                    boxShadow: ['0 0 0 0 rgba(99, 102, 241, 0)', '0 0 0 4px rgba(99, 102, 241, 0.3)', '0 0 0 0 rgba(99, 102, 241, 0)']
                  } : {}}
                  transition={{ 
                    duration: 0.6,
                    repeat: isSelected && !useReducedMotion ? 1 : 0,
                    repeatDelay: 3
                  }}
                />
                
                <motion.div 
                  className={`text-xs font-medium ${
                    isSelected 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {year}
                </motion.div>
                
                {isSelected && hasImages && !useReducedMotion && (
                  <motion.div
                    className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    {stats.totalImages} photos
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-600 rotate-45"></div>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Year Grid - Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {GALLERY_YEARS.map((year, index) => {
          const isSelected = selectedYear === year;
          const stats = yearStats[year] || { totalImages: 0 };
          const hasImages = stats.totalImages > 0;
          
          // Simplified animations for grid items
          const gridItemAnimations = useReducedMotion ? {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: index * 0.05 }
          } : {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { 
              delay: 0.4 + index * 0.08,
              duration: 0.5,
              ease: [0.25, 1, 0.5, 1]
            }
          };
          
          return (
            <motion.button
              key={year}
              className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                  : `border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 
                    text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50
                    ${!hasImages && 'opacity-50 cursor-not-allowed'}`
              }`}
              whileHover={hasImages && !useReducedMotion ? { scale: 1.03, y: -2 } : {}}
              whileTap={hasImages && !useReducedMotion ? { scale: 0.98 } : {}}
              onClick={() => hasImages && onYearChange(year)}
              {...gridItemAnimations}
            >
              {/* Year Display */}
              <div className="text-center">
                <div className={`text-xl sm:text-2xl font-bold mb-1 sm:mb-2 ${
                  isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'
                }`}>
                  {year}
                </div>
                
                {/* Stats */}
                <div className="flex items-center justify-center space-x-1 text-xs sm:text-sm opacity-75">
                  <HiPhotograph className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{stats.totalImages}</span>
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-indigo-500 rounded-full flex items-center justify-center"
                  initial={useReducedMotion ? { opacity: 0 } : { scale: 0, rotate: -90 }}
                  animate={useReducedMotion ? { opacity: 1 } : { scale: 1, rotate: 0 }}
                  transition={useReducedMotion ? { duration: 0.3 } : { 
                    type: 'spring', 
                    stiffness: 500, 
                    damping: 15 
                  }}
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* All Years Option */}
      <motion.button
        className={`w-full mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
          selectedYear === 'all'
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }`}
        initial={useReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: useReducedMotion ? 0.3 : 0.7, duration: useReducedMotion ? 0.3 : 0.5 }}
        whileHover={!useReducedMotion ? { scale: 1.02 } : {}}
        whileTap={!useReducedMotion ? { scale: 0.98 } : {}}
        onClick={() => onYearChange('all')}
      >
        <div className="flex items-center justify-center gap-2">
          <HiPhotograph className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-semibold text-sm sm:text-base">All Years</span>
          <span className="text-xs sm:text-sm opacity-75 bg-indigo-100 dark:bg-indigo-900/30 px-1.5 sm:px-2 py-0.5 rounded-full">
            {totalImages} photos
          </span>
        </div>

        {selectedYear === 'all' && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"
            layoutId={useReducedMotion ? undefined : "selectedIndicator"}
          />
        )}
      </motion.button>
    </motion.div>
  );
}

export const YearHeader = ({ 
  year, 
  isActive = false, 
  imagesCount = 0,
  onClick,
  onDownloadClick
}) => {
  // Create a safe wrapper for the download click handler
  const handleDownloadClick = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation(); // Prevent triggering the onClick handler
    }
    
    if (onDownloadClick && typeof onDownloadClick === 'function') {
      onDownloadClick(year);
    }
  };

  return (
    <motion.div 
      className={`flex items-end justify-between mb-6 pb-2 border-b ${
        isActive 
          ? 'border-indigo-500 dark:border-indigo-400' 
          : 'border-gray-200 dark:border-gray-700'
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div 
        className="flex items-end cursor-pointer group"
        onClick={onClick}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
          layoutId={`year-title-${year}`}
        >
          {year}
        </motion.h2>
        <span className="ml-3 mb-1 text-sm text-gray-500 dark:text-gray-400">
          {imagesCount} images
        </span>
        <motion.div
          className="ml-2 mb-2 w-6 h-1 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          layoutId={`year-indicator-${year}`}
        />
      </div>
      
      {onDownloadClick && typeof onDownloadClick === 'function' && (
        <motion.button
          onClick={handleDownloadClick}
          className="text-sm px-4 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/40 flex items-center gap-1.5"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <HiDownload className="w-4 h-4" />
          <span>Download All</span>
        </motion.button>
      )}
    </motion.div>
  );
};