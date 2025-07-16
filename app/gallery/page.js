'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiViewGrid, 
  HiViewList, 
  HiPhotograph, 
  HiCalendar, 
  HiDownload, 
  HiUpload,
  HiFilter,
  HiX,
  HiChevronDown
} from 'react-icons/hi';
import ImageGallery from '../../components/gallery/ImageGallery';
import YearSelector from '../../components/gallery/YearSelector';
import { containerVariants, staggerItem } from '../../lib/animations';
import { GALLERY_YEARS } from '../../lib/constants';

export default function GalleryPage() {
  const [selectedYear, setSelectedYear] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' or 'masonry'
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={staggerItem}
              className="mb-6"
            >
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                <HiPhotograph className="w-4 h-4" />
                <span>College Memory Gallery</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Our Photo Collection
              </h1>
              
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Browse through our memories from 2022 to 2025. Every photo tells a story 
                of friendship, growth, and unforgettable moments.
              </p>
            </motion.div>

            {/* Year Pills */}
            <motion.div
              variants={staggerItem}
              className="flex flex-wrap justify-center gap-2 mt-8"
            >
              <button 
                onClick={() => handleYearChange('all')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 
                  ${selectedYear === 'all' 
                    ? 'bg-white text-blue-600 shadow-lg' 
                    : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
              >
                All Years
              </button>
              
              {GALLERY_YEARS.map(year => (
                <button 
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${selectedYear === year 
                      ? 'bg-white text-blue-600 shadow-lg' 
                      : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                >
                  {year}
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-8 -right-8 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-32 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Gallery Controls */}
      <section className="py-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Controls */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <HiCalendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {selectedYear === 'all' ? 'All Years' : selectedYear}
                </span>
              </div>
              
              <div className="h-6 border-r border-gray-300 dark:border-gray-700 hidden md:block"></div>
              
              {/* View Toggle */}
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-md flex items-center justify-center ${
                    view === 'grid'
                      ? 'bg-white dark:bg-gray-700 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                  aria-label="Grid view"
                >
                  <HiViewGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setView('masonry')}
                  className={`p-2 rounded-md flex items-center justify-center ${
                    view === 'masonry'
                      ? 'bg-white dark:bg-gray-700 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                  aria-label="Masonry view"
                >
                  <HiViewList className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleFilterPanel}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  isFilterOpen
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {isFilterOpen ? (
                  <>
                    <HiX className="w-5 h-5" />
                    <span>Close Filters</span>
                  </>
                ) : (
                  <>
                    <HiFilter className="w-5 h-5" />
                    <span>Filters</span>
                  </>
                )}
              </button>
              
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                <HiDownload className="w-5 h-5" />
                <span className="hidden sm:inline">Download</span>
              </button>
              
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2">
                <HiUpload className="w-5 h-5" />
                <span className="hidden sm:inline">Upload</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Panel */}
      {isFilterOpen && (
        <motion.div
          className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search images..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="relative">
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 appearance-none">
                    <option value="">Select tags</option>
                    <option value="friends">Friends</option>
                    <option value="sports">Sports</option>
                    <option value="academic">Academic</option>
                    <option value="events">Events</option>
                  </select>
                  <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              {/* Friends */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Friends
                </label>
                <div className="relative">
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 appearance-none">
                    <option value="">Filter by friends</option>
                    <option value="fenil">Fenil</option>
                    <option value="preetraj">Preetraj</option>
                    <option value="om">Om</option>
                    <option value="vansh">Vansh</option>
                  </select>
                  <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Gallery */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isMounted && (
            <ImageGallery 
              selectedYear={selectedYear}
              onYearChange={handleYearChange}
              className="min-h-[500px]"
            />
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Memory Statistics
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our journey in numbers - from the first day to graduation, every moment captured.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {GALLERY_YEARS.length}
              </div>
              <p className="text-gray-600 dark:text-gray-400">Years</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                200+
              </div>
              <p className="text-gray-600 dark:text-gray-400">Photos</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                13
              </div>
              <p className="text-gray-600 dark:text-gray-400">Friends</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                50+
              </div>
              <p className="text-gray-600 dark:text-gray-400">Events</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 