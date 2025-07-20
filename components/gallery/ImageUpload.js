'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { HiUpload, HiX, HiCheck, HiExclamation } from 'react-icons/hi';

export default function ImageUpload({
  onUploadStart,
  onUploadComplete,
  onUploadError,
  maxFiles = 10,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeInMB = 5,
  className = '',
  buttonText = 'Upload Images',
  multiple = true,
}) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate files
    const validFiles = [];
    const newErrors = {};
    
    selectedFiles.forEach(file => {
      const id = uuidv4();
      
      if (!allowedTypes.includes(file.type)) {
        newErrors[id] = `File type ${file.type} is not supported`;
        return;
      }
      
      if (file.size > maxSizeInBytes) {
        newErrors[id] = `File size exceeds ${maxSizeInMB}MB limit`;
        return;
      }
      
      validFiles.push({
        id,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file),
      });
    });
    
    if (validFiles.length + files.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} files`);
      return;
    }
    
    setFiles(prev => [...prev, ...validFiles]);
    setErrors(prev => ({ ...prev, ...newErrors }));
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[id];
      return newProgress;
    });
  };

  const handleUpload = async () => {
    if (!files.length) return;
    
    setUploading(true);
    if (onUploadStart) onUploadStart(files);
    
    try {
      // Simulate upload progress
      const promises = files.map(async (fileObj) => {
        // Simulate upload with progress
        for (let i = 0; i <= 100; i += 10) {
          setUploadProgress(prev => ({
            ...prev,
            [fileObj.id]: i
          }));
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        return {
          id: fileObj.id,
          name: fileObj.name,
          url: fileObj.preview, // In a real app, this would be the uploaded file URL
          size: fileObj.size,
          type: fileObj.type,
        };
      });
      
      const results = await Promise.all(promises);
      
      if (onUploadComplete) onUploadComplete(results);
      
      // Clear files after successful upload
      setFiles([]);
      setUploadProgress({});
      
    } catch (error) {
      console.error('Upload error:', error);
      if (onUploadError) onUploadError(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload button and file input */}
      <div className="mb-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={allowedTypes.join(',')}
          multiple={multiple}
          className="hidden"
        />
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <HiUpload className="w-5 h-5 mr-2" />
          {buttonText}
        </motion.button>
        
        <p className="text-xs text-gray-500 mt-2">
          Allowed types: {allowedTypes.map(type => type.replace('image/', '')).join(', ')} • 
          Max size: {maxSizeInMB}MB • 
          Max files: {maxFiles}
        </p>
      </div>
      
      {/* File preview list */}
      {files.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {files.map((file) => (
              <div 
                key={file.id} 
                className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group"
              >
                {/* Preview image */}
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-full aspect-square object-cover"
                />
                
                {/* File info overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="text-white text-xs truncate">{file.name}</div>
                  <div className="text-white text-xs">
                    {(file.size / 1024 / 1024).toFixed(2)}MB
                  </div>
                </div>
                
                {/* Remove button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFile(file.id)}
                  disabled={uploading}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity"
                >
                  <HiX className="w-4 h-4" />
                </motion.button>
                
                {/* Error indicator */}
                {errors[file.id] && (
                  <div className="absolute bottom-1 left-1 bg-red-500 text-white text-xs rounded-full p-1 flex items-center">
                    <HiExclamation className="w-3 h-3 mr-1" />
                    Error
                  </div>
                )}
                
                {/* Upload progress */}
                {uploading && uploadProgress[file.id] !== undefined && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${uploadProgress[file.id]}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Upload button */}
      {files.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUpload}
          disabled={uploading || Object.keys(errors).length > 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <HiCheck className="w-5 h-5 mr-2" />
              Upload {files.length} {files.length === 1 ? 'file' : 'files'}
            </>
          )}
        </motion.button>
      )}
    </div>
  );
}