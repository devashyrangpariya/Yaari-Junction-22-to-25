'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { HiChevronDown, HiX, HiArrowLeft, HiArrowRight, HiDownload } from 'react-icons/hi';
import EnhancedImageCard from './EnhancedImageCard';
import { YearHeader, ScrollProgressIndicator } from './ScrollAnimation';
import ScrollAnimation from './ScrollAnimation';
import BatchDownload from './BatchDownload';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function ScrollableGallery({ 
  galleryData, 
  selectedYear = 'all',
  onYearChange,
  className = '' 
}) {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [visibleImages, setVisibleImages] = useState(12);
  const [activeYear, setActiveYear] = useState(null);
  const [showBatchDownload, setShowBatchDownload] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [currentDownloadingYear, setCurrentDownloadingYear] = useState(null);
  
  // Refs
  const galleryRef = useRef(null);
  const yearRefs = useRef({});
  const lastScrollY = useRef(0);
  const observer = useRef(null);
  
  // Prepare data based on selected year
  const images = useMemo(() => {
    if (selectedYear === 'all') {
      return Object.values(galleryData).flat();
    }
    return galleryData[selectedYear] || [];
  }, [galleryData, selectedYear]);

  // Group images by year for rendering
  const groupedByYear = useMemo(() => {
    if (selectedYear !== 'all') {
      return { [selectedYear]: images };
    }

    const grouped = {};
    images.forEach(image => {
      const year = image.year.toString();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(image);
    });
    
    // Sort years in descending order (newest first)
    return Object.fromEntries(
      Object.entries(grouped)
        .sort((a, b) => b[0] - a[0])
    );
  }, [images, selectedYear]);

  // Years list for navigation
  const years = useMemo(() => {
    return Object.keys(groupedByYear).sort((a, b) => b - a);
  }, [groupedByYear]);

  // Handle direct year download
  const handleYearDownload = async (year) => {
    if (isDownloading) return;
    
    try {
      setIsDownloading(true);
      setCurrentDownloadingYear(year);
      setDownloadProgress(0);
      
      const yearImages = groupedByYear[year];
      if (!yearImages || yearImages.length === 0) {
        console.error('No images found for year', year);
        setIsDownloading(false);
        setCurrentDownloadingYear(null);
        return;
      }
      
      // Create zip file
      const zip = new JSZip();
      const yearFolder = zip.folder(`Year ${year}`);
      
      // Track progress
      let processedCount = 0;
      const totalCount = yearImages.length;
      
      // Add all images to the zip
      for (const image of yearImages) {
        try {
          // Get original image name
          const pathParts = image.url.split('/');
          const imageName = pathParts[pathParts.length - 1];
          
          // Fetch the image
          const response = await fetch(image.url);
          const blob = await response.blob();
          
          // Add to zip with original name
          yearFolder.file(imageName, blob);
          
          // Update progress
          processedCount++;
          setDownloadProgress(Math.round((processedCount / totalCount) * 100));
        } catch (error) {
          console.error('Failed to add image to zip:', error);
        }
      }
      
      // Generate and download the zip
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE'
      });
      
      // Create a descriptive filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `college_photos_${year}_${timestamp}.zip`;
      
      // Download the zip file
      saveAs(zipBlob, filename);
      
    } catch (error) {
      console.error('Error creating zip file:', error);
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
        setCurrentDownloadingYear(null);
        setDownloadProgress(0);
      }, 1000);
    }
  };

  // Handle batch download
  const handleBatchDownload = () => {
    // Use the BatchDownload component
    setShowBatchDownload(true);
  };

  // Handle year navigation
  const scrollToYear = (year) => {
    const yearElement = yearRefs.current[year];
    if (yearElement) {
      yearElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      if (onYearChange && typeof onYearChange === 'function') {
        onYearChange(year);
      }
    }
  };

  // Setup intersection observer for year headers
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const year = entry.target.dataset.year;
          setActiveYear(year);
        }
      });
    }, { 
      rootMargin: '-10% 0px -90% 0px',
      threshold: 0.1
    });
    
    // Observe year headers
    Object.values(yearRefs.current).forEach(ref => {
      if (ref) observer.current.observe(ref);
    });
    
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [years]);

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Setup infinite scroll behavior
  useEffect(() => {
    const handleInfiniteScroll = () => {
      if (galleryRef.current && 
          window.innerHeight + window.scrollY >= 
          galleryRef.current.offsetTop + galleryRef.current.clientHeight - 600) {
        setVisibleImages(prev => prev + 8);
      }
    };
    
    window.addEventListener('scroll', handleInfiniteScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleInfiniteScroll);
  }, []);

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [selectedYear]);

  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="aspect-square animate-pulse rounded-xl bg-gray-300 dark:bg-gray-700"></div>
      ))}
    </div>
  );

  const handleYearHeaderDownload = (year) => {
    if (typeof year === 'string') {
      handleYearDownload(year);
    }
  };

  return (
    <div ref={galleryRef} className={`min-h-screen ${className}`}>
      {/* Progress indicator */}
      <ScrollProgressIndicator />
      
      {/* Years Navigation */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 z-30 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {activeYear ? `Viewing ${activeYear}` : 'All Years'}
          </div>
          
          <div className="flex items-center space-x-3 overflow-x-auto pb-1 scrollbar-thin">
            {years.map(year => (
              <motion.button
                key={year}
                onClick={() => scrollToYear(year)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                  ${activeYear === year 
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {year}
                {activeYear === year && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleYearDownload(year);
                    }}
                    className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 inline-flex items-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={isDownloading && currentDownloadingYear === year}
                  >
                    {isDownloading && currentDownloadingYear === year ? (
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <HiDownload className="w-3 h-3" />
                    )}
                  </motion.button>
                )}
              </motion.button>
            ))}
            
            {/* Batch Download Button */}
            <motion.button
              onClick={handleBatchDownload}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors whitespace-nowrap flex items-center space-x-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HiDownload className="w-4 h-4" />
              <span>Download All</span>
            </motion.button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="py-12 px-4">
          {renderSkeleton()}
        </div>
      ) : (
        <div className="py-8 px-4">
          {years.map((year) => {
            const yearImages = groupedByYear[year].slice(0, visibleImages);
            
            return (
              <section 
                key={year} 
                className="mb-16 md:mb-24 scroll-mt-24" 
                id={`year-${year}`}
                ref={(el) => {
                  yearRefs.current[year] = el;
                  if (el) el.dataset.year = year;
                }}
              >
                {/* Year Header */}
                <YearHeader 
                  year={year} 
                  isActive={activeYear === year}
                  imagesCount={groupedByYear[year].length}
                  onClick={() => scrollToYear(year)}
                  onDownloadClick={() => handleYearHeaderDownload(year)}
                />
                
                {/* Year Images Grid */}
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                  initial="initial"
                  animate="animate"
                  variants={{
                    animate: {
                      transition: {
                        staggerChildren: 0.08
                      }
                    }
                  }}
                >
                  {yearImages.map((image, index) => (
                    <EnhancedImageCard
                      key={image.id}
                      image={image}
                      animation="fadeInUp"
                      index={index}
                      uniqueIdentifier={`year-${year}`}
                      showTags={false}
                      disableClick={true}
                    />
                  ))}
                </motion.div>
                
                {/* Show more button for this year */}
                {groupedByYear[year].length > visibleImages && (
                  <ScrollAnimation animation="fadeIn">
                    <div className="flex justify-center mt-8">
                      <motion.button
                        onClick={() => setVisibleImages(prev => prev + 8)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Show more</span>
                        <HiChevronDown />
                      </motion.button>
                    </div>
                  </ScrollAnimation>
                )}
              </section>
            );
          })}
        </div>
      )}
      
      {/* Batch Download Modal */}
      <BatchDownload 
        images={images}
        isVisible={showBatchDownload}
        onClose={() => setShowBatchDownload(false)}
      />
      
      {/* Scroll to top button */}
      <AnimatePresence>
        {!isLoading && lastScrollY.current > 500 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 p-3 rounded-full bg-indigo-600 text-white shadow-lg z-40"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}