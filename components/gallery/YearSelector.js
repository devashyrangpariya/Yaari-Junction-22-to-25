'use client';

import { motion } from 'framer-motion';
import { HiCalendar, HiPhotograph } from 'react-icons/hi';
import { GALLERY_YEARS } from '../../lib/constants';
import { containerVariants, staggerItem } from '../../lib/animations';

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
        className="flex items-center space-x-2 mb-6"
        variants={staggerItem}
      >
        <HiCalendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Select Year
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              whileHover={{ scale: 1.02 }}
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

              {/* Hover Effect */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* All Years Option */}
      <motion.button
        className={`w-full mt-4 p-4 rounded-xl border-2 transition-all duration-300 ${
          selectedYear === 'all'
            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }`}
        variants={staggerItem}
        whileHover={{ scale: 1.01 }}
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

      {/* Selected Year Info */}
      {selectedYear && selectedYear !== 'all' && (
        <motion.div
          className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {selectedYear} Memories
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {yearStats[selectedYear]?.totalImages || 0} photos capturing the best moments of {selectedYear}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}