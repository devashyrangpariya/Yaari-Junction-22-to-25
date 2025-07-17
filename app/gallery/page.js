'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiViewGrid, 
  HiViewList, 
  HiCalendar, 
  HiDownload, 
  HiUpload,
} from 'react-icons/hi';
import ImageGallery from '../../components/gallery/ImageGallery';
import YearSelector from '../../components/gallery/YearSelector';
import ImageUpload from '../../components/gallery/ImageUpload';
import { containerVariants, staggerItem, ANIMATION_PRESETS } from '../../lib/animations';
import { GALLERY_YEARS } from '../../lib/constants';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function GalleryPage() {
  const [selectedYear, setSelectedYear] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' or 'masonry'
  const [isDownloading, setIsDownloading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [galleryKey, setGalleryKey] = useState(Date.now()); // Used to force re-render of gallery
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  // Calculate year statistics
  const yearStats = {};
  GALLERY_YEARS.forEach(year => {
    yearStats[year] = {
      totalImages: Math.floor(Math.random() * 50) + 20 // Placeholder for demo
    };
  });

  // Handle download of images
  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // This is a simplified version - in a real app, you would get the actual images
      // For demo purposes, we'll just create a simple text file
      const zip = new JSZip();
      
      // Add a text file with information about the download
      zip.file("download-info.txt", `Downloaded ${selectedYear === 'all' ? 'All Years' : selectedYear} images on ${new Date().toLocaleString()}`);
      
      // Generate the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Save the zip file
      const fileName = selectedYear === 'all' ? 'all-years-images.zip' : `${selectedYear}-images.zip`;
      saveAs(content, fileName);
    } catch (error) {
      console.error('Error downloading images:', error);
      alert('Failed to download images. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle upload completion
  const handleUploadComplete = (uploadedImages) => {
    // Force re-render of gallery to show new images
    setGalleryKey(Date.now());
    setShowUploadModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Gallery Controls */}
      <section className="py-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <HiCalendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {selectedYear === 'all' ? 'All Years' : selectedYear}
                </span>
              </div>
              
              {/* <div className="h-6 border-r border-gray-300 dark:border-gray-700 hidden md:block"></div> */}
              
              {/* View Toggle */}
              {/* <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
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
              </div> */}
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3">
              <button 
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  isDownloading 
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <HiDownload className="w-5 h-5" />
                    <span className="hidden sm:inline">Download</span>
                  </>
                )}
              </button>
              
              <button 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
                onClick={() => setShowUploadModal(true)}
              >
                <HiUpload className="w-5 h-5" />
                <span className="hidden sm:inline">Upload</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Year Selector */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <YearSelector 
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            yearStats={yearStats}
            className="mb-8"
          />
        </div>
      </section>

      {/* Gallery */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isMounted && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedYear}-${galleryKey}`}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={ANIMATION_PRESETS.fadeIn}
              >
                <ImageGallery 
                  selectedYear={selectedYear}
                  onYearChange={handleYearChange}
                  className="min-h-[500px]"
                  layout={view}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <ImageUpload 
            onClose={() => setShowUploadModal(false)}
            onUploadComplete={handleUploadComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 

