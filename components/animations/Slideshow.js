'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8
  })
};

const slideTransition = {
  x: { type: "spring", stiffness: 300, damping: 30 },
  opacity: { duration: 0.3 },
  scale: { duration: 0.3 }
};

export default function Slideshow({
  images = [],
  autoPlay = true,
  interval = 5000,
  showControls = true,
  showIndicators = true,
  className = '',
  imageClassName = '',
  onSlideChange = () => { }
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const paginate = useCallback((newDirection) => {
    const newIndex = currentIndex + newDirection;
    if (newIndex >= images.length) {
      setCurrentIndex(0);
    } else if (newIndex < 0) {
      setCurrentIndex(images.length - 1);
    } else {
      setCurrentIndex(newIndex);
    }
    setDirection(newDirection);
    onSlideChange(newIndex >= images.length ? 0 : newIndex < 0 ? images.length - 1 : newIndex);
  }, [currentIndex, images.length, onSlideChange]);

  const goToSlide = useCallback((index) => {
    const newDirection = index > currentIndex ? 1 : -1;
    setDirection(newDirection);
    setCurrentIndex(index);
    onSlideChange(index);
  }, [currentIndex, onSlideChange]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return;

    const timer = setInterval(() => {
      paginate(1);
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, interval, paginate, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        paginate(-1);
      } else if (e.key === 'ArrowRight') {
        paginate(1);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [paginate, isPlaying]);

  if (!images.length) return null;

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* Main slideshow area */}
      <div className="relative aspect-video bg-gray-900">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="absolute inset-0"
          >
            {typeof images[currentIndex] === 'string' ? (
              <img
                src={images[currentIndex]}
                alt={`Slide ${currentIndex + 1}`}
                className={`w-full h-full object-cover ${imageClassName}`}
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {images[currentIndex]}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation controls */}
        {showControls && images.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200 z-10"
              aria-label="Previous slide"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200 z-10"
              aria-label="Next slide"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </motion.button>

            {/* Play/Pause button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200 z-10"
              aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isPlaying ? (
                <PauseIcon className="w-5 h-5" />
              ) : (
                <PlayIcon className="w-5 h-5" />
              )}
            </motion.button>
          </>
        )}
      </div>

      {/* Slide indicators */}
      {showIndicators && images.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {images.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${index === currentIndex
                  ? 'bg-blue-500'
                  : 'bg-gray-300 hover:bg-gray-400'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {isPlaying && autoPlay && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-blue-500 z-10"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: interval / 1000, ease: 'linear' }}
          key={currentIndex}
        />
      )}
    </div>
  );
}

// Carousel component for horizontal scrolling
export function Carousel({
  items = [],
  itemWidth = 300,
  gap = 16,
  showArrows = true,
  className = '',
  itemClassName = ''
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const maxIndex = Math.max(0, items.length - Math.floor(window?.innerWidth / (itemWidth + gap)) || 3);

  const goToPrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const threshold = 50;

    if (info.offset.x > threshold && currentIndex > 0) {
      goToPrevious();
    } else if (info.offset.x < -threshold && currentIndex < maxIndex) {
      goToNext();
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="flex"
        animate={{ x: -currentIndex * (itemWidth + gap) }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        drag="x"
        dragConstraints={{ left: -maxIndex * (itemWidth + gap), right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={`flex-shrink-0 ${itemClassName}`}
            style={{ width: itemWidth, marginRight: gap }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {item}
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation arrows */}
      {showArrows && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full shadow-lg z-10"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full shadow-lg z-10"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </motion.button>
        </>
      )}
    </div>
  );
}