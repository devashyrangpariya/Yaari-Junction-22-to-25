'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiChevronLeft, HiChevronRight, HiDownload, HiHeart, HiShare, HiUsers } from 'react-icons/hi';
import { ResponsiveImage, ProfileImage } from '../ui/ResponsiveImage';
import TouchGestureWrapper, { SwipeableImageGallery, TouchModal } from '../ui/TouchGestureWrapper';
import { getDeviceCapabilities, AnimationOptimizer } from '../../lib/mobileOptimizations';
import { FRIENDS_DATA } from '../../lib/constants';

export default function MobileImageModal({
  image,
  images = [],
  isOpen,
  onClose,
  onNext,
  onPrevious,
  onDownload
}) {
  const [deviceCapabilities, setDeviceCapabilities] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const imageRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    const capabilities = getDeviceCapabilities();
    setDeviceCapabilities(capabilities);
  }, []);

  useEffect(() => {
    if (image && images.length > 0) {
      const index = images.findIndex(img => img.id === image.id);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [image, images]);

  // Auto-hide controls on mobile
  useEffect(() => {
    if (deviceCapabilities?.isMobile && showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, deviceCapabilities]);

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    }
    setIsZoomed(false);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
    setIsZoomed(false);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handlePinch = ({ scale, center }) => {
    if (!deviceCapabilities?.isMobile) return;
    
    const newZoomLevel = Math.max(1, Math.min(3, scale));
    setZoomLevel(newZoomLevel);
    setIsZoomed(newZoomLevel > 1);
  };

  const handleDoubleTap = ({ clientX, clientY }) => {
    if (isZoomed) {
      setIsZoomed(false);
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
    } else {
      setIsZoomed(true);
      setZoomLevel(2);
      
      // Calculate pan offset to center on tap point
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const offsetX = (centerX - (clientX - rect.left)) * 0.5;
        const offsetY = (centerY - (clientY - rect.top)) * 0.5;
        setPanOffset({ x: offsetX, y: offsetY });
      }
    }
  };

  const handleTap = () => {
    setShowControls(!showControls);
  };

  const handleShare = async () => {
    if (navigator.share && image) {
      try {
        await navigator.share({
          title: image.title,
          text: `Check out this memory: ${image.title}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(image);
    }
  };

  const getFriendNames = () => {
    if (!image?.friends) return [];
    return image.friends.map(friendId => 
      FRIENDS_DATA.find(f => f.id === friendId)
    ).filter(Boolean);
  };

  const getModalVariants = () => {
    return AnimationOptimizer.createResponsiveVariants({
      hidden: { 
        opacity: 0,
        scale: deviceCapabilities?.isMobile ? 1 : 0.9
      },
      visible: { 
        opacity: 1,
        scale: 1,
        transition: {
          duration: AnimationOptimizer.getOptimalAnimationDuration(300),
          ease: "easeOut"
        }
      },
      exit: { 
        opacity: 0,
        scale: deviceCapabilities?.isMobile ? 1 : 0.9,
        transition: {
          duration: AnimationOptimizer.getOptimalAnimationDuration(200),
          ease: "easeIn"
        }
      }
    });
  };

  if (!isOpen || !image) return null;

  const friends = getFriendNames();
  const modalVariants = getModalVariants();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Main image container */}
        <TouchGestureWrapper
          onSwipeLeft={handleNext}
          onSwipeRight={handlePrevious}
          onSwipeDown={() => deviceCapabilities?.isMobile && onClose()}
          onPinch={handlePinch}
          onDoubleTap={handleDoubleTap}
          onTap={handleTap}
          className="relative w-full h-full flex items-center justify-center"
        >
          <div 
            ref={imageRef}
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
          >
            <motion.div
              className="relative max-w-full max-h-full"
              animate={{
                scale: zoomLevel,
                x: panOffset.x,
                y: panOffset.y
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <ResponsiveImage
                src={image.url}
                alt={image.title}
                cloudinaryId={image.cloudinaryId}
                priority={true}
                aspectRatio="auto"
                containerClassName="max-w-screen max-h-screen"
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>
          </div>

          {/* Swipe indicators for mobile */}
          {deviceCapabilities?.isMobile && images.length > 1 && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-white scale-125'
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </TouchGestureWrapper>

        {/* Controls overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Top bar */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 pointer-events-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={onClose}
                      className="p-2 text-white hover:bg-white/20 rounded-full transition-colors touch-manipulation min-h-10 min-w-10"
                    >
                      <HiX className="w-6 h-6" />
                    </button>
                    
                    <div className="text-white">
                      <h2 className="font-semibold text-lg truncate max-w-48">
                        {image.title}
                      </h2>
                      <p className="text-sm text-white/80">
                        {currentIndex + 1} of {images.length}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className="p-2 text-white hover:bg-white/20 rounded-full transition-colors touch-manipulation min-h-10 min-w-10"
                    >
                      <HiHeart className={`w-6 h-6 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                    </button>
                    
                    {navigator.share && (
                      <button
                        onClick={handleShare}
                        className="p-2 text-white hover:bg-white/20 rounded-full transition-colors touch-manipulation min-h-10 min-w-10"
                      >
                        <HiShare className="w-6 h-6" />
                      </button>
                    )}
                    
                    <button
                      onClick={handleDownload}
                      className="p-2 text-white hover:bg-white/20 rounded-full transition-colors touch-manipulation min-h-10 min-w-10"
                    >
                      <HiDownload className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Navigation arrows for desktop */}
              {!deviceCapabilities?.isMobile && images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors pointer-events-auto"
                  >
                    <HiChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors pointer-events-auto"
                  >
                    <HiChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Bottom info bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pointer-events-auto">
                <div className="space-y-3">
                  {/* Tags */}
                  {image.tags && image.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {image.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Friends */}
                  {friends.length > 0 && (
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <HiUsers className="w-5 h-5 text-white/80" />
                        <span className="text-white/80 text-sm">Tagged friends:</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {friends.slice(0, 4).map(friend => (
                            <ProfileImage
                              key={friend.id}
                              src={friend.profileImage}
                              alt={friend.name}
                              size="sm"
                              className="border-2 border-black"
                            />
                          ))}
                        </div>
                        
                        <div className="text-white text-sm">
                          {friends.slice(0, 3).map(f => f.name).join(', ')}
                          {friends.length > 3 && ` +${friends.length - 3} more`}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload date */}
                  <div className="text-white/60 text-sm">
                    Uploaded {new Date(image.uploadDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Zoom indicator */}
              {isZoomed && (
                <div className="absolute top-20 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm pointer-events-auto">
                  {Math.round(zoomLevel * 100)}%
                </div>
              )}

              {/* Mobile instructions */}
              {deviceCapabilities?.isMobile && !showControls && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm pointer-events-auto">
                  Tap to show controls
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent opacity-50"></div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Simplified modal for mobile-first approach
export function SimpleMobileImageModal({
  image,
  isOpen,
  onClose,
  className = ''
}) {
  const [deviceCapabilities, setDeviceCapabilities] = useState(null);

  useEffect(() => {
    const capabilities = getDeviceCapabilities();
    setDeviceCapabilities(capabilities);
  }, []);

  if (!isOpen || !image) return null;

  return (
    <TouchModal
      onClose={onClose}
      className={`bg-black ${className}`}
    >
      <div className="relative w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/50">
          <h2 className="text-white font-semibold truncate flex-1 mr-4">
            {image.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors touch-manipulation min-h-10 min-w-10"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Image */}
        <div className="flex-1 flex items-center justify-center p-4">
          <ResponsiveImage
            src={image.url}
            alt={image.title}
            cloudinaryId={image.cloudinaryId}
            priority={true}
            aspectRatio="auto"
            containerClassName="max-w-full max-h-full"
            className="object-contain"
            sizes="100vw"
          />
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/50">
          <div className="flex items-center justify-between">
            <div className="text-white/80 text-sm">
              {new Date(image.uploadDate).toLocaleDateString()}
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-white hover:bg-white/20 rounded-full transition-colors touch-manipulation min-h-10 min-w-10">
                <HiHeart className="w-5 h-5" />
              </button>
              <button className="p-2 text-white hover:bg-white/20 rounded-full transition-colors touch-manipulation min-h-10 min-w-10">
                <HiDownload className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </TouchModal>
  );
}