// components/gallery/YearSelector.js
'use client';

import { motion } from 'framer-motion';
import { HiCalendar, HiPhotograph, HiChevronRight } from 'react-icons/hi';
import { GALLERY_YEARS } from '../../lib/constants';
import { containerVariants, staggerItem, springTransition } from '../../lib/animations';

export default function YearSelector({ 
  selectedYear, 
  onYearChange, 
  yearStats = {},
  className = '' 
}) {
  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex items-center justify-between mb-6"
        variants={staggerItem}
      >
        <div className="flex items-center space-x-2">
          <HiCalendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Select Year
          </h2>
        </div>
        
        <motion.button
          className="text-sm text-blue-600 dark:text-blue-400 flex items-center space-x-1 hover:underline"
          onClick={() => onYearChange('all')}
          whileTap={{ scale: 0.97 }}
        >
          <span>View All</span>
          <HiChevronRight className="w-4 h-4" />
        </motion.button>
      </motion.div>

      {/* Year Timeline Slider */}
      <div className="relative mb-8 overflow-hidden">
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 rounded-full"></div>
        
        <div className="flex justify-between relative py-4">
          {GALLERY_YEARS.map((year, index) => {
            const isSelected = selectedYear === year;
            const stats = yearStats[year] || { totalImages: 0 };
            
            return (
              <motion.button
                key={year}
                className="relative z-10"
                onClick={() => onYearChange(year)}
                whileTap={{ scale: 0.9 }}
                transition={springTransition}
              >
                <motion.div 
                  className={`w-4 h-4 rounded-full mx-auto mb-2 border-2 ${
                    isSelected 
                      ? 'bg-blue-600 border-blue-600 dark:bg-blue-400 dark:border-blue-400' 
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  }`}
                  animate={isSelected ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.5 }}
                />
                
                <motion.div 
                  className={`text-xs font-medium ${
                    isSelected 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                  animate={isSelected ? { fontSize: '0.9rem', fontWeight: 'bold' } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {year}
                </motion.div>
                
                {isSelected && (
                  <motion.div
                    className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {stats.totalImages} photos
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Year Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {GALLERY_YEARS.map((year) => {
          const isSelected = selectedYear === year;
          const stats = yearStats[year] || { totalImages: 0 };
          
          return (
            <motion.button
              key={year}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
              variants={staggerItem}
              whileTap={{ scale: 0.98 }}
              onClick={() => onYearChange(year)}
            >
              {/* Year Display */}
              <div className="text-center">
                <div className={`text-2xl font-bold mb-2 ${
                  isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                }`}>
                  {year}
                </div>
                
                {/* Stats */}
                <div className="flex items-center justify-center space-x-1 text-sm opacity-75">
                  <HiPhotograph className="w-4 h-4" />
                  <span>{stats.totalImages}</span>
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* All Years Option */}
      <motion.button
        className={`w-full mt-6 p-4 rounded-xl border-2 transition-all duration-300 ${
          selectedYear === 'all'
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }`}
        variants={staggerItem}
        whileTap={{ scale: 0.99 }}
        onClick={() => onYearChange('all')}
      >
        <div className="flex items-center justify-center space-x-2">
          <HiPhotograph className="w-5 h-5" />
          <span className="font-semibold">All Years</span>
          <span className="text-sm opacity-75">
            ({Object.values(yearStats).reduce((total, stats) => total + (stats.totalImages || 0), 0)} photos)
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
}