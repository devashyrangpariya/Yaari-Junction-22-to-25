'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';

const ImageUpload = ({ onUploadComplete, onUploadStart, maxFiles = 10 }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File size too large. Maximum size is 10MB.' };
    }

    return { valid: true };
  };

  const handleFiles = useCallback((newFiles) => {
    const validFiles = [];
    const errors = [];

    Array.from(newFiles).forEach((file) => {
      const validation = validateFile(file);
      if (validation.valid) {
        const fileWithPreview = {
          file,
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          preview: URL.createObjectURL(file),
          status: 'pending'
        };
        validFiles.push(fileWithPreview);
      } else {
        errors.push({ file: file.name, error: validation.error });
      }
    });

    if (files.length + validFiles.length > maxFiles) {
      const allowedCount = maxFiles - files.length;
      validFiles.splice(allowedCount);
      errors.push({ 
        file: 'Multiple files', 
        error: `Maximum ${maxFiles} files allowed. Some files were not added.` 
      });
    }

    setFiles(prev => [...prev, ...validFiles]);

    if (errors.length > 0) {
      console.warn('File validation errors:', errors);
      // You could show these errors in a toast or modal
    }
  }, [files.length, maxFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  }, [handleFiles]);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = e.target.files;
    handleFiles(selectedFiles);
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleFiles]);

  const removeFile = useCallback((fileId) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      // Clean up preview URLs
      const removedFile = prev.find(f => f.id === fileId);
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return updated;
    });
  }, []);

  const uploadFiles = async () => {
    if (files.length === 0 || uploading) return;

    setUploading(true);
    onUploadStart?.(files.length);

    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const formData = new FormData();
    
    files.forEach(({ file }) => {
      formData.append('files', file);
    });
    formData.append('batchId', batchId);

    try {
      // Initialize progress for each file
      files.forEach(({ id }) => {
        setUploadProgress(prev => ({ ...prev, [id]: 0 }));
        setFiles(prev => prev.map(f => 
          f.id === id ? { ...f, status: 'uploading' } : f
        ));
      });

      // Simulate progressive upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(fileId => {
            if (updated[fileId] < 90) {
              updated[fileId] = Math.min(90, updated[fileId] + Math.random() * 15);
            }
          });
          return updated;
        });
      }, 500);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      // Update file statuses based on results
      setFiles(prev => prev.map(file => {
        const uploadResult = result.uploaded.find(r => 
          r.originalFilename === file.name
        );
        
        if (uploadResult) {
          setUploadProgress(prevProgress => ({ 
            ...prevProgress, 
            [file.id]: 100 
          }));
          return { 
            ...file, 
            status: 'completed', 
            uploadResult,
            cloudinaryUrls: {
              thumbnail: uploadResult.thumbnailUrl,
              medium: uploadResult.mediumUrl,
              large: uploadResult.largeUrl,
              original: uploadResult.url
            }
          };
        } else {
          const failedResult = result.failed.find(r => 
            r.originalFilename === file.name
          );
          return { 
            ...file, 
            status: 'failed', 
            error: failedResult?.error || 'Upload failed' 
          };
        }
      }));

      // Show upload statistics
      if (result.statistics) {
        console.log('Upload Statistics:', {
          totalFiles: result.statistics.total,
          successful: result.statistics.successCount,
          failed: result.statistics.failureCount,
          totalSize: result.statistics.totalSizeMB + ' MB',
          avgProcessingTime: result.statistics.avgProcessingTimeMs + ' ms'
        });
      }

      onUploadComplete?.(result);

      // Clear completed files after a delay
      setTimeout(() => {
        setFiles(prev => prev.filter(f => f.status !== 'completed'));
        setUploadProgress({});
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(file => ({
        ...file,
        status: 'failed',
        error: error.message
      })));
      
      // Clear progress for failed uploads
      setUploadProgress(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(fileId => {
          updated[fileId] = 0;
        });
        return updated;
      });
    } finally {
      setUploading(false);
    }
  };

  const clearAll = () => {
    files.forEach(({ preview }) => {
      if (preview) URL.revokeObjectURL(preview);
    });
    setFiles([]);
    setUploadProgress({});
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Drop Zone */}
      <motion.div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${files.length > 0 ? 'mb-6' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className={`
            p-4 rounded-full transition-colors duration-300
            ${isDragOver 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }
          `}>
            <FiUpload size={32} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {isDragOver ? 'Drop images here' : 'Upload your memories'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Drag and drop images or click to browse
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Supports JPEG, PNG, WebP, GIF • Max 10MB per file • Up to {maxFiles} files
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Selected Files ({files.length})
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={clearAll}
                  disabled={uploading}
                  className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50"
                >
                  Clear All
                </button>
                <button
                  onClick={uploadFiles}
                  disabled={uploading || files.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {uploading ? 'Uploading...' : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
                </button>
              </div>
            </div>

            <div className="grid gap-3">
              {files.map((fileItem) => (
                <FilePreview
                  key={fileItem.id}
                  fileItem={fileItem}
                  progress={uploadProgress[fileItem.id] || 0}
                  onRemove={() => removeFile(fileItem.id)}
                  uploading={uploading}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilePreview = ({ fileItem, progress, onRemove, uploading }) => {
  const getStatusIcon = () => {
    switch (fileItem.status) {
      case 'completed':
        return <FiCheck className="text-green-500" size={20} />;
      case 'failed':
        return <FiAlertCircle className="text-red-500" size={20} />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (fileItem.status) {
      case 'completed':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      case 'failed':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      default:
        return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`
        flex items-center space-x-4 p-4 border rounded-lg transition-all duration-300
        ${getStatusColor()}
      `}
    >
      {/* Image Preview */}
      <div className="flex-shrink-0">
        <img
          src={fileItem.preview}
          alt={fileItem.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {fileItem.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {(fileItem.size / 1024 / 1024).toFixed(2)} MB
        </p>
        
        {fileItem.status === 'failed' && fileItem.error && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            {fileItem.error}
          </p>
        )}

        {/* Progress Bar */}
        {uploading && fileItem.status === 'pending' && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {progress}% uploaded
            </p>
          </div>
        )}
      </div>

      {/* Status & Actions */}
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        {!uploading && fileItem.status !== 'completed' && (
          <button
            onClick={onRemove}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <FiX size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ImageUpload;