'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiDownload } from 'react-icons/fi';
import { MdSelectAll, MdDeselectAll } from 'react-icons/md';
import DownloadButton from '../ui/DownloadButton';

const BatchDownload = ({ 
  images = [], 
  isVisible = false, 
  onClose,
  className = '' 
}) => {
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [selectMode, setSelectMode] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setSelectedImages(new Set());
      setSelectMode(false);
    }
  }, [isVisible]);

  const toggleImageSelection = (imageId) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  const selectAll = () => {
    setSelectedImages(new Set(images.map(img => img.id)));
  };

  const deselectAll = () => {
    setSelectedImages(new Set());
  };

  const getSelectedImagesData = () => {
    return images.filter(img => selectedImages.has(img.id));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 ${className}`}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Batch Download
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Select images to download together
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                {selectedImages.size} of {images.length} selected
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <motion.button
                onClick={selectAll}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MdSelectAll className="w-4 h-4" />
                Select All
              </motion.button>
              
              <motion.button
                onClick={deselectAll}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MdDeselectAll className="w-4 h-4" />
                Deselect All
              </motion.button>
            </div>

            {selectedImages.size > 0 && (
              <DownloadButton
                images={getSelectedImagesData()}
                variant="primary"
                className="ml-auto"
              />
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
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <img
                        src={image.thumbnail || image.url}
                        alt={image.title || 'Gallery image'}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Selection overlay */}
                      <div className={`absolute inset-0 transition-all duration-200 ${
                        isSelected 
                          ? 'bg-blue-500 bg-opacity-20' 
                          : 'bg-black bg-opacity-0 group-hover:bg-opacity-10'
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
                              ? 'bg-blue-500 border-blue-500 text-white'
                              : 'bg-white border-gray-300 text-transparent group-hover:text-gray-400'
                          }`}
                        >
                          {isSelected && <FiCheck className="w-3 h-3" />}
                        </motion.div>
                      </div>
                      
                      {/* Image info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                        <p className="text-white text-xs truncate">
                          {image.title || `Image ${image.id}`}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {selectedImages.size === 0 
                ? 'No images selected' 
                : `${selectedImages.size} image${selectedImages.size === 1 ? '' : 's'} selected`
              }
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              
              {selectedImages.size > 0 && (
                <DownloadButton
                  images={getSelectedImagesData()}
                  variant="primary"
                />
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BatchDownload;