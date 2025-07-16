'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiX, 
  HiChevronLeft, 
  HiChevronRight, 
  HiZoomIn, 
  HiZoomOut,
  HiRefresh,
  HiTag,
  HiDownload,
  HiHeart,
  HiShare,
  HiUsers
} from 'react-icons/hi';
import { modalVariants, backdropVariants } from '../../lib/animations';
import { FRIENDS_DATA } from '../../lib/constants';
import { getImageTags, updateImageTags } from '../../lib/friendTagging';
import DownloadButton from '../ui/DownloadButton';
import Button from '../ui/Button';
import FriendTagOverlay from './FriendTagOverlay';
import { cn } from '../../lib/utils';
import { useImageModalGestures } from '../../lib/hooks/useTouchGestures';
import { AnimationOptimizer } from '../../lib/mobileOptimizations';

const ImageModal = ({
  image,
  images = [],
  isOpen,
  onClose,
  onNext,
  onPrevious,
  className,
  ...props
}) => {
  // State management
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showTagOverlay, setShowTagOverlay] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showImageInfo, setShowImageInfo] = useState(true);
  
  // Swipe gesture state
  const [swipeStart, setSwipeStart] = useState({ x: 0, y: 0, time: 0 });
  const [isSwipeGesture, setIsSwipeGesture] = useState(false);
  
  // Refs
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  
  // Find current image index
  const currentIndex = images.findIndex(img => img.id === image?.id);
  const hasNext = currentIndex < images.length - 1;
  const hasPrevious = currentIndex > 0;
  
  // Reset zoom and position when image changes
  useEffect(() => {
    if (image) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setShowTagOverlay(false);
    }
  }, [image?.id]);
  
  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (event) => {
      switch (event.key) {
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
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          handleResetZoom();
          break;
        case 't':
        case 'T':
          setShowTagOverlay(!showTagOverlay);
          break;
        case 'i':
        case 'I':
          setShowImageInfo(!showImageInfo);
          break;
        default:
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasNext, hasPrevious, onNext, onPrevious, onClose, showTagOverlay, showImageInfo]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Zoom functions
  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev * 1.5, 5));
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev / 1.5, 0.5));
  }, []);
  
  const handleResetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);
  
  // Mouse/touch drag handlers
  const handleMouseDown = useCallback((event) => {
    if (scale <= 1) return;
    
    setIsDragging(true);
    setDragStart({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  }, [scale, position]);
  
  const handleMouseMove = useCallback((event) => {
    if (!isDragging || scale <= 1) return;
    
    const newX = event.clientX - dragStart.x;
    const newY = event.clientY - dragStart.y;
    
    // Constrain movement to prevent image from going too far off screen
    const maxX = (scale - 1) * 200;
    const maxY = (scale - 1) * 150;
    
    setPosition({
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY)),
    });
  }, [isDragging, dragStart, scale]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // Touch handlers for mobile
  const handleTouchStart = useCallback((event) => {
    const touch = event.touches[0];
    
    // Initialize swipe detection for navigation when not zoomed
    if (scale <= 1 && event.touches.length === 1) {
      setSwipeStart({
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      });
      setIsSwipeGesture(true);
      return;
    }
    
    // Handle pan when zoomed
    if (scale > 1 && event.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    }
  }, [scale, position]);
  
  const handleTouchMove = useCallback((event) => {
    // Handle pan when zoomed
    if (isDragging && scale > 1 && event.touches.length === 1) {
      event.preventDefault();
      const touch = event.touches[0];
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;
      
      const maxX = (scale - 1) * 200;
      const maxY = (scale - 1) * 150;
      
      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });
    }
  }, [isDragging, dragStart, scale]);
  
  const handleTouchEnd = useCallback((event) => {
    // Handle swipe navigation when not zoomed
    if (isSwipeGesture && scale <= 1) {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - swipeStart.x;
      const deltaY = touch.clientY - swipeStart.y;
      const deltaTime = Date.now() - swipeStart.time;
      
      // Check if it's a valid swipe (horizontal movement > vertical, fast enough, long enough)
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
      const isQuickSwipe = deltaTime < 500;
      const isLongEnoughSwipe = Math.abs(deltaX) > 50;
      
      if (isHorizontalSwipe && isQuickSwipe && isLongEnoughSwipe) {
        if (deltaX > 0 && hasPrevious) {
          // Swipe right - go to previous image
          onPrevious();
        } else if (deltaX < 0 && hasNext) {
          // Swipe left - go to next image
          onNext();
        }
      }
    }
    
    // Reset states
    setIsDragging(false);
    setIsSwipeGesture(false);
  }, [isSwipeGesture, scale, swipeStart, hasNext, hasPrevious, onNext, onPrevious]);
  
  // Mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);
  
  // Download handler
  const handleDownload = async (format, progressCallback) => {
    try {
      // Simulate download progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        progressCallback(i);
      }
      
      // In a real app, this would trigger actual download
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `${image.title}.${format === 'original' ? 'jpg' : format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  };
  
  // Friend tagging handlers
  const handleTagsUpdate = useCallback((imageId, newFriendIds) => {
    updateImageTags(imageId, newFriendIds);
    // Force re-render by updating a state that triggers component refresh
    setShowTagOverlay(prev => prev);
  }, []);

  // Get friend data for tags using the tagging system
  const getTaggedFriends = () => {
    if (!image?.id) return [];
    const taggedFriendIds = getImageTags(image.id);
    return FRIENDS_DATA.filter(friend => taggedFriendIds.includes(friend.id));
  };
  
  const taggedFriends = getTaggedFriends();
  
  if (!image) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            ref={containerRef}
            className={cn(
              'relative w-full h-full flex items-center justify-center',
              className
            )}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            {...props}
          >
            {/* Navigation Controls - Mobile optimized */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex items-center justify-between z-20">
              {/* Left controls */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={onClose}
                  className="p-3 sm:p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm touch-manipulation min-h-12 min-w-12 sm:min-h-auto sm:min-w-auto"
                  aria-label="Close modal"
                >
                  <HiX className="w-6 h-6" />
                </Button>
                
                {images.length > 1 && (
                  <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 sm:py-2 text-white text-xs sm:text-sm">
                    {currentIndex + 1} / {images.length}
                  </div>
                )}
              </div>
              
              {/* Right controls */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setIsLiked(!isLiked)}
                  className={cn(
                    'p-3 rounded-full backdrop-blur-sm transition-colors duration-200 touch-manipulation min-h-12 min-w-12 sm:min-h-auto sm:min-w-auto',
                    isLiked 
                      ? 'bg-red-500/80 hover:bg-red-600/80 text-white' 
                      : 'bg-black/50 hover:bg-black/70 text-white'
                  )}
                  aria-label={isLiked ? 'Unlike image' : 'Like image'}
                >
                  <HiHeart className="w-5 h-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setShowTagOverlay(!showTagOverlay)}
                  className={cn(
                    'p-3 rounded-full backdrop-blur-sm transition-colors duration-200 touch-manipulation min-h-12 min-w-12 sm:min-h-auto sm:min-w-auto',
                    showTagOverlay 
                      ? 'bg-blue-500/80 hover:bg-blue-600/80 text-white' 
                      : 'bg-black/50 hover:bg-black/70 text-white'
                  )}
                  aria-label="Toggle friend tags"
                >
                  <HiTag className="w-5 h-5" />
                </Button>
                
                <DownloadButton
                  onDownload={handleDownload}
                  formats={['original', 'zip', 'gif']}
                  className="bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full touch-manipulation min-h-12 min-w-12 sm:min-h-auto sm:min-w-auto"
                />
              </div>
            </div>
            
            {/* Image Navigation Arrows - Mobile optimized */}
            {hasPrevious && (
              <Button
                variant="ghost"
                size="large"
                onClick={onPrevious}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm z-20 touch-manipulation min-h-12 min-w-12 sm:min-h-auto sm:min-w-auto"
                aria-label="Previous image"
              >
                <HiChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </Button>
            )}
            
            {hasNext && (
              <Button
                variant="ghost"
                size="large"
                onClick={onNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm z-20 touch-manipulation min-h-12 min-w-12 sm:min-h-auto sm:min-w-auto"
                aria-label="Next image"
              >
                <HiChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </Button>
            )}
            
            {/* Zoom Controls - Mobile optimized */}
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex items-center space-x-1 sm:space-x-2 z-20">
              <Button
                variant="ghost"
                size="small"
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
                className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm disabled:opacity-50 touch-manipulation min-h-12 min-w-12 sm:min-h-auto sm:min-w-auto"
                aria-label="Zoom out"
              >
                <HiZoomOut className="w-5 h-5" />
              </Button>
              
              <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 sm:py-2 text-white text-xs sm:text-sm min-w-[50px] sm:min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </div>
              
              <Button
                variant="ghost"
                size="small"
                onClick={handleZoomIn}
                disabled={scale >= 5}
                className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm disabled:opacity-50 touch-manipulation min-h-12 min-w-12 sm:min-h-auto sm:min-w-auto"
                aria-label="Zoom in"
              >
                <HiZoomIn className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="small"
                onClick={handleResetZoom}
                className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm touch-manipulation min-h-12 min-w-12 sm:min-h-auto sm:min-w-auto"
                aria-label="Reset zoom"
              >
                <HiRefresh className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Image Container */}
            <div className="relative w-full h-full flex items-center justify-center p-16">
              <motion.img
                ref={imageRef}
                src={image.url}
                alt={image.title}
                className={cn(
                  'max-w-full max-h-full object-contain select-none',
                  scale > 1 ? 'cursor-grab' : 'cursor-zoom-in',
                  isDragging && 'cursor-grabbing'
                )}
                style={{
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onDoubleClick={scale === 1 ? handleZoomIn : handleResetZoom}
                draggable={false}
              />
              
              {/* Friend Tags Overlay */}
              <FriendTagOverlay
                image={image}
                isVisible={showTagOverlay}
                onToggle={() => setShowTagOverlay(!showTagOverlay)}
                onTagsUpdate={handleTagsUpdate}
              />
            </div>
            
            {/* Image Info Panel - Mobile optimized */}
            <AnimatePresence>
              {showImageInfo && (
                <motion.div
                  className="absolute bottom-16 sm:bottom-4 right-2 sm:right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-white max-w-xs sm:max-w-sm z-20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="font-semibold text-base sm:text-lg mb-2 truncate">{image.title}</h3>
                  <div className="space-y-1 text-xs sm:text-sm text-gray-300">
                    <p>Year: {image.year}</p>
                    <p className="hidden sm:block">Uploaded: {new Date(image.uploadDate).toLocaleDateString()}</p>
                    {image.tags && image.tags.length > 0 && (
                      <div>
                        <p className="mb-1">Tags:</p>
                        <div className="flex flex-wrap gap-1">
                          {image.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="bg-gray-600/50 px-2 py-1 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          {image.tags.length > 3 && (
                            <span className="bg-gray-600/50 px-2 py-1 rounded text-xs">
                              +{image.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {taggedFriends.length > 0 && (
                      <div>
                        <p className="mb-1">Friends ({taggedFriends.length}):</p>
                        <div className="flex flex-wrap gap-1">
                          {taggedFriends.slice(0, 2).map(friend => (
                            <span
                              key={friend.id}
                              className="bg-green-600/50 px-2 py-1 rounded text-xs flex items-center space-x-1"
                            >
                              <HiUsers className="w-3 h-3" />
                              <span className="truncate max-w-16">{friend.name}</span>
                            </span>
                          ))}
                          {taggedFriends.length > 2 && (
                            <span className="bg-green-600/50 px-2 py-1 rounded text-xs">
                              +{taggedFriends.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => setShowImageInfo(false)}
                    className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 hover:bg-white/20 rounded touch-manipulation min-h-8 min-w-8"
                    aria-label="Hide image info"
                  >
                    <HiX className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Keyboard Shortcuts Help */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-xs z-10 opacity-60">
              <div className="flex items-center space-x-4">
                <span>← → Navigate</span>
                <span>+ - Zoom</span>
                <span>0 Reset</span>
                <span>T Tags</span>
                <span>I Info</span>
                <span>ESC Close</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImageModal;