'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiCheck, FiLoader } from 'react-icons/fi';
import { MdOutlineFileDownload, MdOutlineGif } from 'react-icons/md';
import { BsFileZip } from 'react-icons/bs';

import { 
  downloadSingleImage, 
  downloadImagesAsZip, 
  generateFilename,
  supportsDownload 
} from '../../lib/downloadUtils';

const DownloadButton = ({ 
  images = [], 
  singleImage = null, 
  className = '',
  variant = 'primary', // 'primary', 'secondary', 'minimal'
  onDownloadStart = () => {},
  onDownloadComplete = () => {},
  onDownloadError = () => {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadState, setDownloadState] = useState('idle'); // 'idle', 'downloading', 'success', 'error'
  const [progress, setProgress] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Check if downloads are supported
  if (!supportsDownload()) {
    return null;
  }

  const imagesToProcess = singleImage ? [singleImage] : images;
  const hasMultipleImages = imagesToProcess.length > 1;

  const downloadFormats = [
    {
      id: 'original',
      label: hasMultipleImages ? 'Original (ZIP)' : 'Original',
      icon: MdOutlineFileDownload,
      description: hasMultipleImages 
        ? 'Download all in original format as ZIP' 
        : 'Download in original format',
      extension: hasMultipleImages ? 'zip' : 'jpg'
    },
    ...(hasMultipleImages ? [{
      id: 'zip',
      label: 'ZIP Archive',
      icon: BsFileZip,
      description: 'Download all as compressed ZIP file',
      extension: 'zip'
    }] : [])
  ];

  const handleSingleDownload = async () => {
    const image = imagesToProcess[0];
    const filename = generateFilename(image, 0);
    
    setProgress(50);
    await downloadSingleImage(image.url, filename);
    setProgress(100);
  };

  const handleZipDownload = async () => {
    await downloadImagesAsZip(imagesToProcess, (progressValue) => {
      setProgress(progressValue);
    });
  };

  const handleDownload = async (format) => {
    setSelectedFormat(format);
    setDownloadState('downloading');
    setProgress(0);
    setErrorMessage('');
    
    onDownloadStart();

    try {
      if (format.id === 'original') {
        if (hasMultipleImages) {
          await handleZipDownload();
        } else {
          await handleSingleDownload();
        }
      } else if (format.id === 'zip') {
        await handleZipDownload();
      }

      setDownloadState('success');
      onDownloadComplete();
      
      setTimeout(() => {
        setDownloadState('idle');
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Download failed:', error);
      setErrorMessage(error.message || 'Download failed');
      setDownloadState('error');
      onDownloadError(error);
      
      setTimeout(() => {
        setDownloadState('idle');
      }, 3000);
    }
  };



  const getButtonVariant = () => {
    const baseClasses = "relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    switch (variant) {
      case 'secondary':
        return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500`;
      case 'minimal':
        return `${baseClasses} text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500`;
      default:
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
    }
  };

  const getStatusIcon = () => {
    switch (downloadState) {
      case 'downloading':
        return <FiLoader className="w-4 h-4 animate-spin" />;
      case 'success':
        return <FiCheck className="w-4 h-4" />;
      case 'error':
        return <FiDownload className="w-4 h-4" />;
      default:
        return <FiDownload className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (downloadState) {
      case 'downloading':
        return selectedFormat ? `Creating ${selectedFormat.label}...` : 'Downloading...';
      case 'success':
        return 'Downloaded!';
      case 'error':
        return 'Failed';
      default:
        return singleImage ? 'Download' : `Download (${images.length})`;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        disabled={downloadState === 'downloading'}
        className={getButtonVariant()}
        whileHover={{ scale: downloadState === 'downloading' ? 1 : 1.02 }}
        whileTap={{ scale: downloadState === 'downloading' ? 1 : 0.98 }}
      >
        {getStatusIcon()}
        <span>{getStatusText()}</span>
        
        {downloadState === 'downloading' && (
          <div className="absolute inset-0 bg-current opacity-10 rounded-lg overflow-hidden">
            <motion.div
              className="h-full bg-current"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && downloadState === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-50"
          >
            {downloadFormats.map((format) => {
              const Icon = format.icon;
              const isDisabled = format.id === 'gif' && (!images.length || images.length < 2);
              
              return (
                <motion.button
                  key={format.id}
                  onClick={() => handleDownload(format)}
                  disabled={isDisabled}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  whileHover={!isDisabled ? { backgroundColor: 'rgba(0,0,0,0.02)' } : {}}
                >
                  <Icon className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-gray-900">{format.label}</div>
                    <div className="text-sm text-gray-500">{format.description}</div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DownloadButton;