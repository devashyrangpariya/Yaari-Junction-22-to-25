'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiViewGrid, HiViewList, HiFilter, HiSearch } from 'react-icons/hi';
import ImageCard from './ImageCard';
import ImageModal from './ImageModal';
import YearSelector from './YearSelector';
import FriendFilter from './FriendFilter';
import { containerVariants, staggerContainer, staggerItem } from '../../lib/animations';
import { AnimationOptimizer } from '../../lib/mobileOptimizations';
import { GALLERY_YEARS } from '../../lib/constants';
import { getImagesByFriends } from '../../lib/friendTagging';

// Sample gallery data - in a real app, this would come from an API
const SAMPLE_GALLERY_DATA = {
  '2022': [
    {
      id: 'img-2022-1',
      url: '/images/gallery/2022/college-start.jpg',
      thumbnail: '/images/gallery/2022/college-start-thumb.jpg',
      title: 'College Journey Begins',
      year: 2022,
      tags: ['first-day', 'orientation', 'new-beginnings'],
      friends: ['fenil', 'preetraj', 'om'],
      uploadDate: new Date('2022-08-15'),
      cloudinaryId: 'college-start-2022'
    },
    {
      id: 'img-2022-2',
      url: '/images/gallery/2022/first-friends.jpg',
      thumbnail: '/images/gallery/2022/first-friends-thumb.jpg',
      title: 'Meeting New Friends',
      year: 2022,
      tags: ['friends', 'bonding', 'memories'],
      friends: ['vansh', 'meet', 'maharshi'],
      uploadDate: new Date('2022-09-10'),
      cloudinaryId: 'first-friends-2022'
    },
    {
      id: 'img-2022-3',
      url: '/images/gallery/2022/study-group.jpg',
      thumbnail: '/images/gallery/2022/study-group-thumb.jpg',
      title: 'First Study Session',
      year: 2022,
      tags: ['study', 'academic', 'teamwork'],
      friends: ['divy', 'ansh', 'kevel'],
      uploadDate: new Date('2022-10-05'),
      cloudinaryId: 'study-group-2022'
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
      friends: ['rudra', 'smit',],
      uploadDate: new Date('2023-03-20'),
      cloudinaryId: 'cultural-fest-2023'
    },
    {
      id: 'img-2023-2',
      url: '/images/gallery/2023/sports-day.jpg',
      thumbnail: '/images/gallery/2023/sports-day-thumb.jpg',
      title: 'Sports Day Victory',
      year: 2023,
      tags: ['sports', 'victory', 'teamwork'],
      friends: ['fenil', 'om', 'vansh', 'meet'],
      uploadDate: new Date('2023-04-15'),
      cloudinaryId: 'sports-day-2023'
    },
    {
      id: 'img-2023-3',
      url: '/images/gallery/2023/group-photo.jpg',
      thumbnail: '/images/gallery/2023/group-photo-thumb.jpg',
      title: 'All Friends Together',
      year: 2023,
      tags: ['group', 'friendship', 'memories'],
      friends: ['fenil', 'preetraj', 'om', 'vansh', 'meet', 'maharshi', 'divy', 'ansh', 'kevel', 'rudra', 'smit'],
      uploadDate: new Date('2023-06-10'),
      cloudinaryId: 'group-photo-2023'
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
      friends: ['fenil', 'om', 'vansh', 'ansh', 'rudra'],
      uploadDate: new Date('2024-03-15'),
      cloudinaryId: 'cricket-victory-2024'
    },
    {
      id: 'img-2024-2',
      url: '/images/gallery/2024/football-win.jpg',
      thumbnail: '/images/gallery/2024/football-win-thumb.jpg',
      title: 'Satoliya AR7 Victory',
      year: 2024,
      tags: ['football', 'satoliya', 'sports'],
      friends: ['meet', 'maharshi', 'divy', 'kevel', 'smit'],
      uploadDate: new Date('2024-01-20'),
      cloudinaryId: 'football-win-2024'
    },
    {
      id: 'img-2024-3',
      url: '/images/gallery/2024/project-presentation.jpg',
      thumbnail: '/images/gallery/2024/project-presentation-thumb.jpg',
      title: 'Final Year Project',
      year: 2024,
      tags: ['project', 'presentation', 'academic'],
      friends: ['preetraj',],
      uploadDate: new Date('2024-11-30'),
      cloudinaryId: 'project-presentation-2024'
    }
  ],
  '2025': [
    {
      id: 'img-2025-1',
      url: '/images/gallery/2025/graduation-prep.jpg',
      thumbnail: '/images/gallery/2025/graduation-prep-thumb.jpg',
      title: 'Graduation Preparation',
      year: 2025,
      tags: ['graduation', 'preparation', 'milestone'],
      friends: ['fenil', 'preetraj', 'om', 'vansh'],
      uploadDate: new Date('2025-01-15'),
      cloudinaryId: 'graduation-prep-2025'
    },
    {
      id: 'img-2025-2',
      url: '/images/gallery/2025/final-memories.jpg',
      thumbnail: '/images/gallery/2025/final-memories-thumb.jpg',
      title: 'Creating Final Memories',
      year: 2025,
      tags: ['memories', 'final', 'friendship'],
      friends: ['meet', 'maharshi', 'divy', 'ansh'],
      uploadDate: new Date('2025-02-10'),
      cloudinaryId: 'final-memories-2025'
    }
  ]
};

export default function ImageGallery({ 
  selectedYear = 'all',
  onYearChange,
  onImageClick,
  className = '' 
}) {
  const [layout, setLayout] = useState('grid'); // 'grid' or 'masonry'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isLoading] = useState(false);
  
  // Modal state
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
        totalImages: SAMPLE_GALLERY_DATA[year]?.length || 0
      };
    });
    return stats;
  }, []);

  // Filter images based on selected year, search term, tags, and friends
  const filteredImages = useMemo(() => {
    let images = [];
    
    if (selectedYear === 'all') {
      // Combine all years
      images = Object.values(SAMPLE_GALLERY_DATA).flat();
    } else {
      images = SAMPLE_GALLERY_DATA[selectedYear] || [];
    }

    // Apply search filter
    if (searchTerm) {
      images = images.filter(image => 
        image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      images = images.filter(image =>
        selectedTags.some(tag => image.tags.includes(tag))
      );
    }

    // Apply friend filter using the friend tagging system
    if (selectedFriends.length > 0) {
      images = getImagesByFriends(selectedFriends, images);
    }

    // Sort by upload date (newest first)
    return images.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
  }, [selectedYear, searchTerm, selectedTags, selectedFriends]);

  // Get all unique tags for filter options
  const allTags = useMemo(() => {
    const tags = new Set();
    Object.values(SAMPLE_GALLERY_DATA).flat().forEach(image => {
      image.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSelectedFriends([]);
  };

  const handleFriendsChange = (friendIds) => {
    setSelectedFriends(friendIds);
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
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  const handlePreviousImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const previousIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    setSelectedImage(filteredImages[previousIndex]);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Year Selector */}
      <YearSelector
        selectedYear={selectedYear}
        onYearChange={onYearChange}
        yearStats={yearStats}
      />

      {/* Controls Section */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search Bar */}
          <motion.div 
            className="relative flex-1 max-w-md"
            variants={staggerItem}
          >
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </motion.div>

          {/* Layout Toggle */}
          <motion.div 
            className="flex items-center space-x-2"
            variants={staggerItem}
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Layout:</span>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setLayout('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  layout === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <HiViewGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLayout('masonry')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  layout === 'masonry'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <HiViewList className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <motion.div 
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            variants={staggerItem}
          >
            <div className="flex items-center space-x-2 mb-3">
              <HiFilter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by tags:</span>
              {selectedTags.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results Info */}
        <motion.div 
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          variants={staggerItem}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''}
            {selectedYear !== 'all' && ` from ${selectedYear}`}
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedTags.length > 0 && ` with tags: ${selectedTags.join(', ')}`}
            {selectedFriends.length > 0 && ` with friends selected`}
          </p>
        </motion.div>
      </motion.div>

      {/* Friend Filter */}
      <FriendFilter
        selectedFriends={selectedFriends}
        onFriendsChange={handleFriendsChange}
        availableImages={Object.values(SAMPLE_GALLERY_DATA).flat()}
      />

      {/* Image Gallery */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            className="flex items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </motion.div>
        ) : filteredImages.length === 0 ? (
          <motion.div
            key="empty"
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <HiSearch className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No images found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || selectedTags.length > 0
                  ? 'Try adjusting your search or filters'
                  : `No images available for ${selectedYear === 'all' ? 'any year' : selectedYear}`
                }
              </p>
              {(searchTerm || selectedTags.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Clear filters
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`gallery-${layout}-${selectedYear}`}
            className={
              layout === 'grid'
                ? 'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6'
                : 'columns-1 xs:columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-3 sm:gap-4 lg:gap-6 space-y-3 sm:space-y-4 lg:space-y-6'
            }
            variants={optimizedVariants.container}
            initial="hidden"
            animate="visible"
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                variants={optimizedVariants.item || staggerItem}
                className={layout === 'masonry' ? 'break-inside-avoid mb-3 sm:mb-4 lg:mb-6' : ''}
              >
                <ImageCard
                  image={image}
                  onImageClick={handleImageClick}
                  onFriendTagClick={(friendId) => {
                    // Add the friend to the selected friends filter
                    if (!selectedFriends.includes(friendId)) {
                      setSelectedFriends(prev => [...prev, friendId]);
                    }
                  }}
                  showTags={true}
                  className="h-full"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        images={filteredImages}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onNext={handleNextImage}
        onPrevious={handlePreviousImage}
      />
    </div>
  );
}