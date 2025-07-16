'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronLeft, HiChevronRight, HiPlay, HiPause } from 'react-icons/hi';
import { galleryVariants, ANIMATION_PRESETS } from '../../lib/animations';

// Sample highlight images - in a real app, these would come from an API
const HIGHLIGHT_IMAGES = [
  {
    id: 1,
    url: '/images/gallery/highlight-1.jpg',
    title: 'Graduation Day 2025',
    description: 'The moment we all worked towards - celebrating our achievements together.',
    year: '2025',
    category: 'milestone'
  },
  {
    id: 2,
    url: '/images/gallery/highlight-1.jpg',
    title: 'Cricke AR11 Victory',
    description: 'Our cricket team winning the inter-college championship with incredible teamwork.',
    year: '2024',
    category: 'sports'
  },
  {
    id: 3,
    url: '/images/gallery/highlight-1.jpg',
    title: 'Satoliya AR7 Champions',
    description: 'Another victory for our sports teams - celebrating our football achievements.',
    year: '2024',
    category: 'sports'
  },
  {
    id: 4,
    url: '/images/gallery/highlight-1.jpg',
    title: 'Friends Forever',
    description: 'All 13 of us together - Fenil, Preetraj, Om, Vansh, Meet, Maharshi, Divy, Ansh, Kevel, Rudra, Smit.',
    year: '2023',
    category: 'friends'
  },
  {
    id: 5,
    url: '/images/gallery/highlight-1.jpg',
    title: 'Cultural Festival',
    description: 'Our amazing performance at the college cultural festival.',
    year: '2023',
    category: 'events'
  },
  {
    id: 6,
    url: '/images/gallery/highlight-1.jpg',
    title: 'Study Sessions',
    description: 'Late night study sessions that brought us closer together.',
    year: '2022',
    category: 'academic'
  },
  {
    id: 7,
    url: '/images/gallery/highlight-1.jpg',
    title: 'Funny Moments',
    description: 'Hilarious memories that still make us laugh - our collection of funny moments.',
    year: '2023',
    category: 'funny'
  }
];

export default function HighlightReel({ autoPlay = true, showControls = true }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoaded, setIsLoaded] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === HIGHLIGHT_IMAGES.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Preload images
  useEffect(() => {
    const imagePromises = HIGHLIGHT_IMAGES.map((image) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = image.url;
      });
    });

    Promise.all(imagePromises)
      .then(() => setIsLoaded(true))
      .catch(() => setIsLoaded(true)); // Still show component even if some images fail
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? HIGHLIGHT_IMAGES.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === HIGHLIGHT_IMAGES.length - 1 ? 0 : currentIndex + 1);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (!isLoaded) {
    return (
      <div className="relative w-full h-96 lg:h-[500px] bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const currentImage = HIGHLIGHT_IMAGES[currentIndex];

  return (
    <motion.div
      className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
      variants={galleryVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {/* Main Image Display */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {/* Placeholder for actual image */}
            <div 
              className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center"
              style={{
                backgroundImage: `linear-gradient(45deg, 
                  ${currentImage.category === 'milestone' ? '#3b82f6, #8b5cf6' : 
                    currentImage.category === 'sports' ? '#10b981, #3b82f6' :
                    currentImage.category === 'friends' ? '#f59e0b, #ef4444' :
                    currentImage.category === 'events' ? '#8b5cf6, #ec4899' :
                    currentImage.category === 'funny' ? '#f59e0b, #ec4899' :
                    '#6366f1, #06b6d4'})`
              }}
            >
              <div className="text-center text-white p-8">
                <div className="text-6xl mb-4">
                  {currentImage.category === 'milestone' ? '🎓' :
                   currentImage.category === 'sports' ? '🏆' :
                   currentImage.category === 'friends' ? '👥' :
                   currentImage.category === 'events' ? '🎭' :
                   currentImage.category === 'funny' ? '😂' : '📚'}
                </div>
                <h3 className="text-2xl font-bold mb-2">{currentImage.title}</h3>
                <p className="text-lg opacity-90">{currentImage.year}</p>
              </div>
            </div>

            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Content Overlay */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="max-w-2xl">
                <motion.div
                  className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentImage.year} • {currentImage.category.charAt(0).toUpperCase() + currentImage.category.slice(1)}
                </motion.div>
                
                <motion.h3
                  className="text-2xl lg:text-3xl font-bold mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {currentImage.title}
                </motion.h3>
                
                <motion.p
                  className="text-lg opacity-90 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {currentImage.description}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      {showControls && (
        <>
          {/* Previous/Next Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            aria-label="Previous image"
          >
            <HiChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            aria-label="Next image"
          >
            <HiChevronRight className="w-6 h-6" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? (
              <HiPause className="w-5 h-5" />
            ) : (
              <HiPlay className="w-5 h-5 ml-0.5" />
            )}
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {HIGHLIGHT_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Progress Bar */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <motion.div
            className="h-full bg-white"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
          />
        </div>
      )}
    </motion.div>
  );
}