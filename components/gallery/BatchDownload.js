'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi';
import { MdSelectAll, MdOutlineDeselect } from 'react-icons/md';
import { HiDownload } from 'react-icons/hi';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const BatchDownload = ({ 
  images = [], 
  isVisible = false, 
  onClose,
  className = '' 
}) => {
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setSelectedImages(new Set());
      setSelectMode(false);
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  }, [isVisible]);

  // Toggle image selection
  const toggleImageSelection = (imageId) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  // Select all images
  const selectAll = () => {
    setSelectedImages(new Set(images.map(img => img.id)));
  };

  // Deselect all images
  const deselectAll = () => {
    setSelectedImages(new Set());
  };

  // Get selected images data
  const getSelectedImagesData = () => {
    return images.filter(img => selectedImages.has(img.id));
  };

  // Handle the download process
  const handleDownload = async () => {
    const selectedImagesData = getSelectedImagesData();
    if (selectedImagesData.length === 0 || isDownloading) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      // Create a new JSZip instance
      const zip = new JSZip();
      
      // Group images by year for better organization
      const imagesByYear = {};
      selectedImagesData.forEach(image => {
        const year = image.year.toString();
        if (!imagesByYear[year]) {
          imagesByYear[year] = [];
        }
        imagesByYear[year].push(image);
      });

      // Total images for progress calculation
      const totalImages = selectedImagesData.length;
      let processedImages = 0;

      // Add images to zip by year folders
      for (const year in imagesByYear) {
        const yearFolder = zip.folder(`Year ${year}`);
        
        for (const [index, image] of imagesByYear[year].entries()) {
          try {
            // Get original image name from URL without adding prefixes
            const pathParts = image.url.split('/');
            const imageName = pathParts[pathParts.length - 1];
            
            // Use original filename without modifications
            const filename = imageName;
            
            // In a real app with access to real images:
            // Fetch the image as a blob and add it to the zip
            const response = await fetch(image.url);
            const blob = await response.blob();
            yearFolder.file(filename, blob);
            
            // Update progress
            processedImages++;
            const progress = Math.round((processedImages / totalImages) * 100);
            setDownloadProgress(progress);
          } catch (error) {
            console.error(`Failed to process image: ${image.url}`, error);
          }
        }
      }

      // Generate the zip file
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });
      
      // Download the zip file with a meaningful name
      const timestamp = new Date().toISOString().slice(0, 10);
      const selectedYears = Object.keys(imagesByYear).join('-');
      const zipFilename = selectedYears ? 
        `college_photos_${selectedYears}_${timestamp}.zip` : 
        `college_photos_${timestamp}.zip`;
      
      saveAs(zipBlob, zipFilename);
      
      // Close after successful download with a slight delay
      setTimeout(() => {
        setIsDownloading(false);
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${className}`}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Select Images to Download
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Images will be organized by year in the downloaded zip file
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {selectedImages.size} of {images.length} selected
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close"
            >
              <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <motion.button
              onClick={selectAll}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MdSelectAll className="w-4 h-4" />
              Select All
            </motion.button>
            
            <motion.button
              onClick={deselectAll}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={selectedImages.size === 0}
            >
              <MdOutlineDeselect className="w-4 h-4" />
              Deselect All
            </motion.button>
          </div>

          {/* Download Button */}
          {selectedImages.size > 0 && (
            <motion.button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isDownloading 
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              } transition-colors`}
              whileHover={isDownloading ? {} : { scale: 1.03 }}
              whileTap={isDownloading ? {} : { scale: 0.97 }}
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>{downloadProgress < 100 ? `${downloadProgress}%` : 'Packaging...'}</span>
                </>
              ) : (
                <>
                  <HiDownload className="w-5 h-5" />
                  <span>Download ({selectedImages.size})</span>
                </>
              )}
            </motion.button>
          )}
        </div>

        {/* Image Grid */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image) => {
              const isSelected = selectedImages.has(image.id);
              
              return (
                <motion.div
                  key={image.id}
                  className="relative group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleImageSelection(image.id)}
                >
                  <div className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    isSelected 
                      ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900/50' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}>
                    {/* Image */}
                    <img
                      src={image.thumbnail || image.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Selection overlay */}
                    <div className={`absolute inset-0 transition-all duration-200 ${
                      isSelected 
                        ? 'bg-indigo-500/20 backdrop-blur-[1px]' 
                        : 'bg-black/0 group-hover:bg-black/10'
                    }`} />
                    
                    {/* Selection indicator */}
                    <div className="absolute top-2 right-2">
                      <motion.div
                        initial={false}
                        animate={{
                          scale: isSelected ? 1 : 0.8,
                          opacity: isSelected ? 1 : 0.7
                        }}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'bg-indigo-500 border-indigo-500 text-white'
                            : 'bg-white/70 backdrop-blur-sm border-gray-300 dark:border-gray-500 text-transparent group-hover:text-gray-400'
                        }`}
                      >
                        {isSelected && <FiCheck className="w-3 h-3" />}
                      </motion.div>
                    </div>
                    
                    {/* Year badge */}
                    <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      {image.year}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {selectedImages.size === 0 
              ? 'No images selected' 
              : `${selectedImages.size} ${selectedImages.size === 1 ? 'image' : 'images'} selected`
            }
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            
            {selectedImages.size > 0 && !isDownloading && (
              <motion.button
                onClick={handleDownload}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <HiDownload className="w-5 h-5" />
                <span>Download</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BatchDownload;