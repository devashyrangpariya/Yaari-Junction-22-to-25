'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiX, 
  HiDownload, 
  HiShare, 
  HiHeart, 
  HiPlus, 
  HiMinus, 
  HiRefresh,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi';
import FriendTagOverlay from './FriendTagOverlay';
import { getOptimizedImageUrl } from '@/lib/imageUtils';

export default function ImageModal({
  image,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  onFavoriteToggle,
  onDownload,
  onShare,
  hasNext = false,
  hasPrevious = false,
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  
  // Reset zoom and position when image changes
  useEffect(() => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }, [image]);
  
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.25, 1));
  }, []);
  
  const handleResetZoom = useCallback(() => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrevious) onPrevious();
          break;
        case 'ArrowRight':
          if (hasNext) onNext();
          break;
        case '+':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          handleResetZoom();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious, hasNext, hasPrevious, handleZoomIn, handleZoomOut, handleResetZoom]);
  
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleWheel = (e) => {
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };
  
  if (!image || !isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Modal content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>
            
            {/* Image container */}
            <div 
              className="relative w-full h-[70vh] bg-black flex items-center justify-center overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <img
                src={getOptimizedImageUrl(image.src, { preset: 'large' })}
                alt={image.caption || 'Gallery image'}
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{ 
                  transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                  transformOrigin: 'center'
                }}
                draggable={false}
              />
              
              {/* Friend tags */}
              {image.friends && image.friends.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0">
                  <FriendTagOverlay image={image} readOnly={true} />
                </div>
              )}
              
              {/* Navigation buttons */}
              {hasPrevious && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                >
                  <HiChevronLeft className="w-6 h-6" />
                </button>
              )}
              
              {hasNext && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                >
                  <HiChevronRight className="w-6 h-6" />
                </button>
              )}
              
              {/* Zoom controls */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiMinus className="w-5 h-5" />
                </button>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiPlus className="w-5 h-5" />
                </button>
                <button
                  onClick={handleResetZoom}
                  disabled={zoomLevel === 1 && position.x === 0 && position.y === 0}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiRefresh className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Image info and actions */}
            <div className="p-4 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                {/* Image details */}
                <div className="flex-1 min-w-0">
                  {image.caption && (
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {image.caption}
                    </h3>
                  )}
                  
                  {image.date && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(image.date).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  )}
                  
                  {image.description && (
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      {image.description}
                    </p>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => onFavoriteToggle && onFavoriteToggle(image.id)}
                    className={`p-2 rounded-full ${
                      image.favorite 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <HiHeart className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => onDownload && onDownload(image)}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <HiDownload className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => onShare && onShare(image)}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <HiShare className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}