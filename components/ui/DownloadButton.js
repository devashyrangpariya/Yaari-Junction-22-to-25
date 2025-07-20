'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiDownload, HiOutlineCheck } from 'react-icons/hi';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function DownloadButton({
  images = [],
  variant = 'default',
  size = 'md',
  className = '',
  onDownloadStart,
  onDownloadComplete,
  onDownloadError
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // Define styles based on variant
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    default: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
    outline: 'border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
  };
  
  // Define sizes
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  // Handle the download process
  const handleDownload = async () => {
    if (isDownloading || images.length === 0) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    setIsSuccess(false);

    if (onDownloadStart) {
      onDownloadStart(images.length);
    }

    try {
      // Create a new JSZip instance
      const zip = new JSZip();
      
      // Group images by year for better organization
      const imagesByYear = {};
      images.forEach(image => {
        const year = image.year.toString();
        if (!imagesByYear[year]) {
          imagesByYear[year] = [];
        }
        imagesByYear[year].push(image);
      });

      // Total images for progress calculation
      const totalImages = images.length;
      let processedImages = 0;

      // Add images to zip by year folders
      for (const year in imagesByYear) {
        const yearFolder = zip.folder(`Year ${year}`);
        
        for (const [index, image] of imagesByYear[year].entries()) {
          try {
            // For real implementation, fetch the actual image blob
            // Here we just create a placeholder text file for demonstration
            const imageName = `${image.title || `image_${index + 1}`}.jpg`;
            
            // In a real app, you would fetch the image and convert it to blob
            // For demo, we just add a text file
            yearFolder.file(
              imageName, 
              `Image URL: ${image.url}\nYear: ${image.year}`
            );
            
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
      
      // Download the zip file
      const timestamp = new Date().toISOString().split('T')[0];
      saveAs(zipBlob, `gallery_images_${timestamp}.zip`);
      
      // Show success state
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
      
      if (onDownloadComplete) {
        onDownloadComplete();
      }
    } catch (error) {
      console.error('Download failed:', error);
      if (onDownloadError) {
        onDownloadError(error);
      }
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <motion.button
      onClick={handleDownload}
      disabled={isDownloading || images.length === 0}
      className={`
        rounded-lg font-medium transition-all flex items-center space-x-2 relative
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.md}
        ${images.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      whileHover={!isDownloading && images.length > 0 ? { scale: 1.03 } : {}}
      whileTap={!isDownloading && images.length > 0 ? { scale: 0.97 } : {}}
    >
      {isDownloading ? (
        <>
          <div className="relative w-5 h-5">
            {/* Progress circle */}
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <circle
                className="opacity-75"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${downloadProgress * 0.6283} 62.83`} // 2π*10 ≈ 62.83
                strokeDashoffset="15.71" // π*10/2 ≈ 15.71
              />
            </svg>
          </div>
          <span>{downloadProgress < 100 ? `${downloadProgress}%` : 'Packaging...'}</span>
        </>
      ) : isSuccess ? (
        <>
          <HiOutlineCheck className="w-5 h-5 text-green-500" />
          <span>Downloaded</span>
        </>
      ) : (
        <>
          <HiDownload className="w-5 h-5" />
          <span>Download {images.length > 0 ? `(${images.length})` : ''}</span>
        </>
      )}
    </motion.button>
  );
}