// components/gallery/ImageGallery.js
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiViewGrid, HiViewList, HiDownload, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import ImageCard from './ImageCard';
import ImageModal from './ImageModal';
import { containerVariants, staggerContainer, staggerItem, ANIMATION_PRESETS } from '../../lib/animations';
import { AnimationOptimizer } from '../../lib/mobileOptimizations';
import { GALLERY_YEARS } from '../../lib/constants';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Sample gallery data - in a real app, this would come from an API or localStorage
const SAMPLE_GALLERY_DATA = {
  '2022': [
    {
      id: 'img-2022-1',
      url: '/images/gallery/2022/college-start.jpg',
      thumbnail: '/images/gallery/2022/college-start-thumb.jpg',
      title: 'College Journey Begins',
      year: 2022,
      tags: ['first-day', 'orientation', 'new-beginnings'],
      uploadDate: new Date('2022-08-15'),
      width: 1200,
      height: 800
    },
    {
      id: 'img-2022-2',
      url: '/images/gallery/2022/first-friends.jpg',
      thumbnail: '/images/gallery/2022/first-friends-thumb.jpg',
      title: 'Meeting New Friends',
      year: 2022,
      tags: ['friends', 'bonding', 'memories'],
      uploadDate: new Date('2022-09-10'),
      width: 800,
      height: 1200
    },
    {
      id: 'img-2022-3',
      url: '/images/gallery/2022/study-group.jpg',
      thumbnail: '/images/gallery/2022/study-group-thumb.jpg',
      title: 'First Study Session',
      year: 2022,
      tags: ['study', 'academic', 'teamwork'],
      uploadDate: new Date('2022-10-05'),
      width: 1200,
      height: 900
    },
    {
      id: 'img-2022-4',
      url: '/images/gallery/2022/first-project.jpg',
      thumbnail: '/images/gallery/2022/first-project-thumb.jpg',
      title: 'First College Project',
      year: 2022,
      tags: ['project', 'teamwork', 'learning'],
      uploadDate: new Date('2022-11-20'),
      width: 1000,
      height: 750
    },
    {
      id: 'img-2022-5',
      url: '/images/gallery/2022/winter-break.jpg',
      thumbnail: '/images/gallery/2022/winter-break-thumb.jpg',
      title: 'Winter Break Fun',
      year: 2022,
      tags: ['vacation', 'fun', 'friends'],
      uploadDate: new Date('2022-12-25'),
      width: 1500,
      height: 1000
    }
  ],
  '2023': [
    {
      id: 'img-2023-1',
      url: '/images/gallery/2023/cultural-fest.jpg',
      thumbnail: '/images/gallery/2023/cultural-fest-thumb.jpg',
      title: 'Cultural Festival Performance',
      year: 2023,
      tags: ['cultural', 'performance', 'festival'],
      uploadDate: new Date('2023-03-20'),
      width: 1200,
      height: 800
    },
    {
      id: 'img-2023-2',
      url: '/images/gallery/2023/sports-day.jpg',
      thumbnail: '/images/gallery/2023/sports-day-thumb.jpg',
      title: 'Sports Day Victory',
      year: 2023,
      tags: ['sports', 'victory', 'teamwork'],
      uploadDate: new Date('2023-04-15'),
      width: 1600,
      height: 900
    },
    {
      id: 'img-2023-3',
      url: '/images/gallery/2023/group-photo.jpg',
      thumbnail: '/images/gallery/2023/group-photo-thumb.jpg',
      title: 'All Friends Together',
      year: 2023,
      tags: ['group', 'friendship', 'memories'],
      uploadDate: new Date('2023-06-10'),
      width: 1800,
      height: 1200
    },
    {
      id: 'img-2023-4',
      url: '/images/gallery/2023/summer-trip.jpg',
      thumbnail: '/images/gallery/2023/summer-trip-thumb.jpg',
      title: 'Summer Vacation Trip',
      year: 2023,
      tags: ['summer', 'vacation', 'travel'],
      uploadDate: new Date('2023-07-05'),
      width: 1200,
      height: 900
    },
    {
      id: 'img-2023-5',
      url: '/images/gallery/2023/hackathon.jpg',
      thumbnail: '/images/gallery/2023/hackathon-thumb.jpg',
      title: 'College Hackathon',
      year: 2023,
      tags: ['tech', 'coding', 'competition'],
      uploadDate: new Date('2023-09-18'),
      width: 1000,
      height: 750
    }
  ],
  '2024': [
    {
      id: 'img-2024-1',
      url: '/images/gallery/2024/cricket-victory.jpg',
      thumbnail: '/images/gallery/2024/cricket-victory-thumb.jpg',
      title: 'Cricke AR11 Championship',
      year: 2024,
      tags: ['cricket', 'championship', 'victory'],
      uploadDate: new Date('2024-03-15'),
      width: 1200,
      height: 800
    },
    {
      id: 'img-2024-2',
      url: '/images/gallery/2024/football-win.jpg',
      thumbnail: '/images/gallery/2024/football-win-thumb.jpg',
      title: 'Satoliya AR7 Victory',
      year: 2024,
      uploadDate: new Date('2024-01-20'),
      width: 1600,
      height: 900
    },
    {
      id: 'img-2024-3',
      url: '/images/gallery/2024/project-presentation.jpg',
      thumbnail: '/images/gallery/2024/project-presentation-thumb.jpg',
      title: 'Final Year Project',
      year: 2024,
      uploadDate: new Date('2024-11-30'),
      width: 1200,
      height: 900
    },
    {
      id: 'img-2024-4',
      url: '/images/gallery/2024/tech-fest.jpg',
      thumbnail: '/images/gallery/2024/tech-fest-thumb.jpg',
      title: 'Technology Festival',
      year: 2024,
      uploadDate: new Date('2024-04-25'),
      width: 1000,
      height: 750
    },
    {
      id: 'img-2024-5',
      url: '/images/gallery/2024/internship.jpg',
      thumbnail: '/images/gallery/2024/internship-thumb.jpg',
      title: 'Summer Internship',
      year: 2024,
      uploadDate: new Date('2024-06-15'),
      width: 1500,
      height: 1000
    }
  ],
  '2025': [
    {
      id: 'img-2025-1',
      url: '/images/gallery/2025/graduation-prep.jpg',
      thumbnail: '/images/gallery/2025/graduation-prep-thumb.jpg',
      title: 'Graduation Preparation',
      year: 2025,
      uploadDate: new Date('2025-01-15'),
      width: 1200,
      height: 800
    },
    {
      id: 'img-2025-2',
      url: '/images/gallery/2025/final-memories.jpg',
      thumbnail: '/images/gallery/2025/final-memories-thumb.jpg',
      title: 'Creating Final Memories',
      year: 2025,
      uploadDate: new Date('2025-02-10'),
      width: 1600,
      height: 900
    },
    {
      id: 'img-2025-3',
      url: '/images/gallery/2025/farewell-party.jpg',
      thumbnail: '/images/gallery/2025/farewell-party-thumb.jpg',
      title: 'Farewell Celebration',
      year: 2025,
      uploadDate: new Date('2025-03-20'),
      width: 1800,
      height: 1200
    },
    {
      id: 'img-2025-4',
      url: '/images/gallery/2025/graduation-day.jpg',
      thumbnail: '/images/gallery/2025/graduation-day-thumb.jpg',
      title: 'Graduation Day',
      year: 2025,
      uploadDate: new Date('2025-04-30'),
      width: 1200,
      height: 900
    },
    {
      id: 'img-2025-5',
      url: '/images/gallery/2025/future-plans.jpg',
      thumbnail: '/images/gallery/2025/future-plans-thumb.jpg',
      title: 'Future Planning Session',
      year: 2025,
      uploadDate: new Date('2025-05-15'),
      width: 1000,
      height: 750
    }
  ]
};

// Load images from localStorage if available
const loadImagesFromStorage = () => {
  if (typeof window === 'undefined') return SAMPLE_GALLERY_DATA;
  
  try {
    const storedImages = localStorage.getItem('galleryImages');
    if (storedImages) {
      const parsedData = JSON.parse(storedImages);
      // Merge with sample data
      const mergedData = { ...SAMPLE_GALLERY_DATA };
      
      Object.keys(parsedData).forEach(year => {
        if (!mergedData[year]) mergedData[year] = [];
        mergedData[year] = [...mergedData[year], ...parsedData[year]];
      });
      
      return mergedData;
    }
  } catch (error) {
    console.error("Error loading images from localStorage:", error);
  }
  
  return SAMPLE_GALLERY_DATA;
};

export default function ImageGallery({ 
  selectedYear = 'all',
  onYearChange,
  onImageClick,
  className = '',
  layout = 'grid'
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [galleryData, setGalleryData] = useState(SAMPLE_GALLERY_DATA);
  const [visibleImages, setVisibleImages] = useState(10);
  const galleryRef = useRef(null);
  
  // Modal state
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Load images from localStorage on mount
  useEffect(() => {
    const loadedData = loadImagesFromStorage();
    setGalleryData(loadedData);
  }, []);
  
  // Performance-aware animation variants
  const optimizedVariants = useMemo(() => {
    return AnimationOptimizer.createResponsiveVariants({
      container: staggerContainer,
      item: staggerItem
    });
  }, []);

  // Calculate year statistics
  const yearStats = useMemo(() => {
    const stats = {};
    GALLERY_YEARS.forEach(year => {
      stats[year] = {
        totalImages: galleryData[year]?.length || 0
      };
    });
    return stats;
  }, [galleryData]);

  // Filter images based on selected year
  const filteredImages = useMemo(() => {
    let images = [];
    
    if (selectedYear === 'all') {
      // Combine all years
      images = Object.values(galleryData).flat();
    } else {
      images = galleryData[selectedYear] || [];
    }

    // Sort by upload date (newest first)
    return images.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
  }, [selectedYear, galleryData]);

  // Implement infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (galleryRef.current && window.innerHeight + window.scrollY >= galleryRef.current.offsetTop + galleryRef.current.clientHeight - 600) {
        if (visibleImages < filteredImages.length) {
          setVisibleImages(prev => Math.min(prev + 10, filteredImages.length));
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleImages, filteredImages.length]);

  // Reset visible images when year changes
  useEffect(() => {
    setVisibleImages(10);
    
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedYear]);

  // Download images as zip
  const handleDownloadImages = async () => {
    setIsDownloading(true);
    
    try {
      const zip = new JSZip();
      const imagesToDownload = selectedYear === 'all' 
        ? filteredImages 
        : galleryData[selectedYear] || [];
      
      // Create a folder for each year if downloading all
      if (selectedYear === 'all') {
        const imagesByYear = {};
        
        // Group images by year
        imagesToDownload.forEach(image => {
          const year = image.year.toString();
          if (!imagesByYear[year]) imagesByYear[year] = [];
          imagesByYear[year].push(image);
        });
        
        // Add images to year folders
        for (const year in imagesByYear) {
          const yearFolder = zip.folder(`${year}`);
          
          // Add images to the year folder
          for (const image of imagesByYear[year]) {
            const imageName = image.title.replace(/\s+/g, '_').toLowerCase() + '.jpg';
            
            // Fetch the image
            const response = await fetch(image.url);
            const blob = await response.blob();
            
            yearFolder.file(imageName, blob);
          }
        }
      } else {
        // Just add all images to the root of the zip
        for (const image of imagesToDownload) {
          const imageName = image.title.replace(/\s+/g, '_').toLowerCase() + '.jpg';
          
          // Fetch the image
          const response = await fetch(image.url);
          const blob = await response.blob();
          
          zip.file(imageName, blob);
        }
      }
      
      // Generate and download the zip
      const content = await zip.generateAsync({ type: 'blob' });
      const zipName = selectedYear === 'all' ? 'all_years_gallery.zip' : `${selectedYear}_gallery.zip`;
      saveAs(content, zipName);
    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Failed to download images. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Modal handlers
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    // Call parent onImageClick if provided
    if (onImageClick) {
      onImageClick(image);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleNextImage = () => {
    if (!selectedImage) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    if (currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1]);
    }
  };

  const handlePreviousImage = () => {
    if (!selectedImage) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    if (currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1]);
    }
  };

  // Group images by year if showing all years
  const groupedImages = useMemo(() => {
    if (selectedYear !== 'all') return null;
    
    const grouped = {};
    filteredImages.forEach(image => {
      const year = image.year.toString();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(image);
    });
    
    // Sort years in descending order
    return Object.keys(grouped)
      .sort((a, b) => b - a)
      .map(year => ({
        year,
        images: grouped[year].slice(0, visibleImages)
      }));
  }, [filteredImages, selectedYear, visibleImages]);

  // Render loading skeleton
  const renderSkeleton = () => {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6`}>
        {[...Array(10)].map((_, index) => (
          <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-xl aspect-square animate-pulse"></div>
        ))}
      </div>
    );
  };

  // Render the grid layout
  const renderGridLayout = (images) => {
    const displayImages = images.slice(0, visibleImages);
    
    return (
      <motion.div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6`}
        variants={optimizedVariants.container}
        initial="hidden"
        animate="visible"
      >
        {displayImages.map((image, index) => (
          <motion.div
            key={image.id}
            variants={optimizedVariants.item}
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { 
                delay: index * 0.05,
                duration: 0.5
              }
            }}
          >
            <ImageCard
              image={image}
              onImageClick={handleImageClick}
              showTags={true}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  // Render the masonry layout
  const renderMasonryLayout = (images) => {
    // Split images into columns for masonry effect based on image dimensions
    const displayImages = images.slice(0, visibleImages);
    const columns = [[], [], [], []];
    
    displayImages.forEach((image, index) => {
      // Calculate which column to put the image in based on height/width ratio
      const ratio = image.height / image.width;
      let columnIndex;
      
      if (ratio > 1.2) { // Tall image
        columnIndex = index % 2 === 0 ? 0 : 2;
      } else if (ratio < 0.8) { // Wide image
        columnIndex = index % 2 === 0 ? 1 : 3;
      } else { // Square-ish image
        columnIndex = index % 4;
      }
      
      columns[columnIndex].push(image);
    });
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {columns.map((column, colIndex) => (
          <motion.div 
            key={colIndex} 
            className="flex flex-col gap-4 sm:gap-6"
            variants={optimizedVariants.container}
            initial="hidden"
            animate="visible"
          >
            {column.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    delay: index * 0.1 + colIndex * 0.05,
                    duration: 0.5
                  }
                }}
              >
                <ImageCard
                  image={image}
                  onImageClick={handleImageClick}
                  showTags={true}
                  className="w-full"
                />
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`} ref={galleryRef}>
      {/* Download Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleDownloadImages}
          disabled={isDownloading || filteredImages.length === 0}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            isDownloading 
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isDownloading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <HiDownload className="w-5 h-5" />
              <span>Download {selectedYear === 'all' ? 'All' : selectedYear} Images</span>
            </>
          )}
        </button>
      </div>

      {/* Gallery Content */}
      {isLoading ? (
        renderSkeleton()
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">No images found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            There are no images available for {selectedYear === 'all' ? 'any year' : selectedYear}
          </p>
        </div>
      ) : selectedYear === 'all' && groupedImages ? (
        // Year-wise grouped display for "All Years"
        <div className="space-y-12">
          {groupedImages.map(group => (
            <div key={group.year} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-lg mr-3">
                    {group.year}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 text-lg font-normal">
                    ({galleryData[group.year]?.length || 0} photos)
                  </span>
                </h2>
                
                <motion.button
                  className="text-blue-600 dark:text-blue-400 flex items-center space-x-1 hover:underline"
                  onClick={() => onYearChange(group.year)}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>View Year</span>
                  <HiChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
              
              <AnimatePresence>
                {layout === 'grid' ? 
                  renderGridLayout(group.images) : 
                  renderMasonryLayout(group.images)
                }
              </AnimatePresence>
            </div>
          ))}
          
          {/* Load More Button for All Years */}
          {visibleImages < filteredImages.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleImages(prev => Math.min(prev + 10, filteredImages.length))}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Load More Images
              </button>
            </div>
          )}
        </div>
      ) : (
        // Single year display
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedYear}-${layout}`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={ANIMATION_PRESETS.fadeIn}
          >
            {layout === 'grid' ? 
              renderGridLayout(filteredImages) : 
              renderMasonryLayout(filteredImages)
            }
            
            {/* Load More Button for Single Year */}
            {visibleImages < filteredImages.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleImages(prev => Math.min(prev + 10, filteredImages.length))}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Load More Images
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Image Modal */}
      {isModalOpen && selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={handleCloseModal}
          onNext={handleNextImage}
          onPrevious={handlePreviousImage}
          hasNext={filteredImages.findIndex(img => img.id === selectedImage.id) < filteredImages.length - 1}
          hasPrevious={filteredImages.findIndex(img => img.id === selectedImage.id) > 0}
        />
      )}
      
      {/* Navigation Buttons for Mobile */}
      {filteredImages.length > 0 && (
        <div className="fixed bottom-6 right-6 flex space-x-3 z-10 md:hidden">
          <motion.button
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              const currentIndex = GALLERY_YEARS.indexOf(selectedYear);
              if (currentIndex > 0) {
                onYearChange(GALLERY_YEARS[currentIndex - 1]);
              } else if (selectedYear === 'all') {
                onYearChange(GALLERY_YEARS[GALLERY_YEARS.length - 1]);
              } else {
                onYearChange('all');
              }
            }}
          >
            <HiChevronLeft className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              const currentIndex = GALLERY_YEARS.indexOf(selectedYear);
              if (currentIndex >= 0 && currentIndex < GALLERY_YEARS.length - 1) {
                onYearChange(GALLERY_YEARS[currentIndex + 1]);
              } else {
                onYearChange('all');
              }
            }}
          >
            <HiChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      )}
    </div>
  );
}