// components/gallery/ImageLightbox.js
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiChevronLeft, HiChevronRight, HiDownload, HiZoomIn, HiZoomOut } from 'react-icons/hi';
import { BsFullscreen, BsFullscreenExit } from 'react-icons/bs';

export default function ImageLightbox({ 
  image, 
  isOpen, 
  onClose, 
  images = [] 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (image && images.length > 0) {
      const index = images.findIndex(img => img.id === image.id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [image, images]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const currentImage = images[currentIndex] || image;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(currentImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = currentImage.url.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen || !currentImage) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
          onClick={onClose}
        >
          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all duration-300 z-10"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <HiX className="w-6 h-6" />
          </motion.button>

          {/* Top Controls Bar */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute top-4 left-4 right-16 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {/* Year Badge */}
              <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium">
                Year {currentImage.year}
              </div>
              
              {/* Image Counter */}
              <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <motion.button
                className="p-2.5 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(!isZoomed);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isZoomed ? <HiZoomOut className="w-5 h-5" /> : <HiZoomIn className="w-5 h-5" />}
              </motion.button>

              {/* Fullscreen Toggle */}
              <motion.button
                className="p-2.5 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isFullscreen ? <BsFullscreenExit className="w-5 h-5" /> : <BsFullscreen className="w-5 h-5" />}
              </motion.button>

              {/* Download Button */}
              <motion.button
                className="p-2.5 rounded-full bg-indigo-600/80 backdrop-blur-md hover:bg-indigo-600 text-white transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                disabled={isDownloading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isDownloading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <HiDownload className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Main Image Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              key={currentImage.id}
              src={currentImage.url}
              alt={currentImage.alt || "Gallery image"}
              className={`max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              animate={{ 
                scale: isZoomed ? 1.5 : 1,
                opacity: 1,
                x: 0
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
              initial={{ opacity: 0, x: 100 }}
              exit={{ opacity: 0, x: -100 }}
              drag={isZoomed}
              dragConstraints={{ top: -200, bottom: 200, left: -200, right: 200 }}
              dragElastic={0.2}
            />

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute left-4 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <HiChevronLeft className="w-6 h-6" />
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute right-4 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <HiChevronRight className="w-6 h-6" />
                </motion.button>
              </>
            )}
          </motion.div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 overflow-x-auto scrollbar-none"
            >
              <div className="flex gap-2 p-2 rounded-xl bg-black/50 backdrop-blur-md">
                {images.map((img, index) => (
                  <motion.button
                    key={img.id}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      index === currentIndex 
                        ? 'border-white shadow-lg scale-110' 
                        : 'border-white/30 hover:border-white/60'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                      setIsZoomed(false);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={img.thumbnail || img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}