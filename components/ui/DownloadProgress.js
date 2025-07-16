'use client';

import { motion } from 'framer-motion';
import { FiDownload, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

const DownloadProgress = ({ 
  isVisible = false,
  progress = 0,
  status = 'idle', // 'idle', 'downloading', 'success', 'error'
  fileName = '',
  onCancel,
  onClose,
  className = ''
}) => {
  if (!isVisible) return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'downloading':
        return <FiDownload className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'success':
        return <FiCheck className="w-5 h-5 text-green-500" />;
      case 'error':
        return <FiAlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FiDownload className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'downloading':
        return 'Downloading...';
      case 'success':
        return 'Download Complete!';
      case 'error':
        return 'Download Failed';
      default:
        return 'Preparing Download';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'downloading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProgressBarColor = () => {
    switch (status) {
      case 'downloading':
        return 'bg-blue-500';
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[300px] z-50 ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <div className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </div>
            {fileName && (
              <div className="text-sm text-gray-500 truncate max-w-[200px]">
                {fileName}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {status === 'downloading' && onCancel && (
            <button
              onClick={onCancel}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Cancel download"
            >
              <FiX className="w-4 h-4 text-gray-500" />
            </button>
          )}
          
          {(status === 'success' || status === 'error') && onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Close"
            >
              <FiX className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full ${getProgressBarColor()} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Status Messages */}
      {status === 'error' && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
          Failed to download. Please try again.
        </div>
      )}
      
      {status === 'success' && (
        <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
          Your download has started successfully.
        </div>
      )}
    </motion.div>
  );
};

export default DownloadProgress;