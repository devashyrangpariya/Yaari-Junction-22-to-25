'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  HiPhotograph, 
  HiTrash, 
  HiDownload, 
  HiEye,
  HiHeart,
  HiShare,
  HiFilter,
  HiSearch,
  HiUpload,
  HiCalendar,
  HiUsers
} from 'react-icons/hi';
import { staggerContainer, staggerItem, galleryVariants } from '../../lib/animations';
import { formatDate, storage } from '../../lib/utils';
import { GALLERY_YEARS } from '../../lib/constants';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import ImageUpload from '../gallery/ImageUpload';

export default function MemoryManager({ userProfile }) {
  const [memories, setMemories] = useState([]);
  const [filteredMemories, setFilteredMemories] = useState([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemories, setSelectedMemories] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);

  // Initialize memories data
  useEffect(() => {
    const initializeMemories = () => {
      // Mock memories data - in real app, this would come from API
      const mockMemories = Array.from({ length: 48 }, (_, i) => ({
        id: `memory-${i}`,
        title: `Memory ${i + 1}`,
        image: `/images/gallery/sample-${(i % 12) + 1}.jpg`,
        thumbnail: `/images/gallery/thumb-${(i % 12) + 1}.jpg`,
        year: GALLERY_YEARS[Math.floor(i / 12)],
        uploadDate: new Date(2022 + Math.floor(i / 12), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        tags: ['college', 'friends', 'memories'],
        friends: [],
        views: Math.floor(Math.random() * 100) + 10,
        likes: Math.floor(Math.random() * 50) + 5,
        size: Math.floor(Math.random() * 5000000) + 1000000, // 1-5MB
        format: 'JPEG',
        dimensions: { width: 1920, height: 1080 },
      }));

      setMemories(mockMemories);
      setFilteredMemories(mockMemories);
      setLoading(false);
    };

    initializeMemories();
  }, []);

  // Filter memories based on year and search query
  useEffect(() => {
    let filtered = memories;

    if (selectedYear !== 'all') {
      filtered = filtered.filter(memory => memory.year === selectedYear);
    }

    if (searchQuery) {
      filtered = filtered.filter(memory =>
        memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredMemories(filtered);
  }, [memories, selectedYear, searchQuery]);

  const handleSelectMemory = (memoryId) => {
    setSelectedMemories(prev => 
      prev.includes(memoryId)
        ? prev.filter(id => id !== memoryId)
        : [...prev, memoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMemories.length === filteredMemories.length) {
      setSelectedMemories([]);
    } else {
      setSelectedMemories(filteredMemories.map(memory => memory.id));
    }
  };

  const handleDeleteSelected = () => {
    setMemories(prev => prev.filter(memory => !selectedMemories.includes(memory.id)));
    setSelectedMemories([]);
    setShowDeleteModal(false);
  };

  const handleDownloadSelected = () => {
    // Mock download functionality
    const selectedItems = memories.filter(memory => selectedMemories.includes(memory.id));
    console.log('Downloading memories:', selectedItems);
    // In real app, this would trigger actual download
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        variants={staggerItem}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              My Memories
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your uploaded photos and memories
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="primary"
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2"
            >
              <HiUpload className="w-4 h-4" />
              <span>Upload Photos</span>
            </Button>
            
            {selectedMemories.length > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={handleDownloadSelected}
                  className="flex items-center space-x-2"
                >
                  <HiDownload className="w-4 h-4" />
                  <span>Download ({selectedMemories.length})</span>
                </Button>
                
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center space-x-2"
                >
                  <HiTrash className="w-4 h-4" />
                  <span>Delete ({selectedMemories.length})</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Years</option>
            {GALLERY_YEARS.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSelectAll}
              className="px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              {selectedMemories.length === filteredMemories.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Memory Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
          variants={staggerItem}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <HiPhotograph className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {filteredMemories.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Photos
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
          variants={staggerItem}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <HiEye className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {filteredMemories.reduce((sum, memory) => sum + memory.views, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Views
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
          variants={staggerItem}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
              <HiHeart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {filteredMemories.reduce((sum, memory) => sum + memory.likes, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Likes
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
          variants={staggerItem}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <HiCalendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {new Set(filteredMemories.map(m => m.year)).size}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Years Covered
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Memory Grid */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        variants={staggerItem}
        initial="hidden"
        animate="visible"
      >
        {filteredMemories.length === 0 ? (
          <div className="text-center py-12">
            <HiPhotograph className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No memories found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery || selectedYear !== 'all' 
                ? 'Try adjusting your filters or search terms.'
                : 'Start by uploading your first photos!'
              }
            </p>
            {!searchQuery && selectedYear === 'all' && (
              <Button
                variant="primary"
                onClick={() => setShowUploadModal(true)}
              >
                Upload Photos
              </Button>
            )}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredMemories.map((memory) => (
                <motion.div
                  key={memory.id}
                  className="relative group cursor-pointer"
                  variants={galleryVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover="hover"
                  layout
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <Image
                      src={memory.thumbnail}
                      alt={memory.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                    
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={selectedMemories.includes(memory.id)}
                        onChange={() => handleSelectMemory(memory.id)}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex space-x-2">
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                          <HiEye className="w-4 h-4 text-white" />
                        </button>
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                          <HiDownload className="w-4 h-4 text-white" />
                        </button>
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                          <HiShare className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Year badge */}
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 text-xs font-medium bg-black/50 text-white rounded-full">
                        {memory.year}
                      </span>
                    </div>
                  </div>
                  
                  {/* Memory info */}
                  <div className="mt-2 space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {memory.title}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatDate(memory.uploadDate, { month: 'short', day: 'numeric' })}</span>
                      <span>{formatFileSize(memory.size)}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <HiEye className="w-3 h-3" />
                        <span>{memory.views}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <HiHeart className="w-3 h-3" />
                        <span>{memory.likes}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload New Photos"
        size="large"
      >
        <ImageUpload
          onUploadComplete={(result) => {
            // Handle upload result and add new images to memories
            if (result && result.uploaded && Array.isArray(result.uploaded)) {
              const newMemories = result.uploaded.map((uploadResult, index) => ({
                id: `memory-${Date.now()}-${index}`,
                title: uploadResult.originalFilename || `New Memory ${index + 1}`,
                image: uploadResult.url,
                thumbnail: uploadResult.thumbnailUrl || uploadResult.url,
                year: new Date().getFullYear().toString(),
                uploadDate: new Date(),
                tags: ['college', 'memories'],
                friends: [],
                views: 0,
                likes: 0,
                size: uploadResult.bytes || 0,
                format: uploadResult.format || 'JPEG',
                dimensions: {
                  width: uploadResult.width || 1920,
                  height: uploadResult.height || 1080,
                },
              }));
              setMemories(prev => [...newMemories, ...prev]);
            }
            setShowUploadModal(false);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Selected Memories"
        size="medium"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete {selectedMemories.length} selected memories? 
            This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteSelected}
            >
              Delete Memories
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}