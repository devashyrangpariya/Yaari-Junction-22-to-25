'use client';

import { motion } from 'framer-motion';
import { 
  HiExclamationTriangle, 
  HiExclamationCircle, 
  HiInformationCircle,
  HiCheckCircle,
  HiX
} from 'react-icons/hi';

const errorTypes = {
  error: {
    icon: HiExclamationTriangle,
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    iconColor: 'text-red-600 dark:text-red-400',
    textColor: 'text-red-800 dark:text-red-200',
    titleColor: 'text-red-900 dark:text-red-100'
  },
  warning: {
    icon: HiExclamationCircle,
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    textColor: 'text-yellow-800 dark:text-yellow-200',
    titleColor: 'text-yellow-900 dark:text-yellow-100'
  },
  info: {
    icon: HiInformationCircle,
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-400',
    textColor: 'text-blue-800 dark:text-blue-200',
    titleColor: 'text-blue-900 dark:text-blue-100'
  },
  success: {
    icon: HiCheckCircle,
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    iconColor: 'text-green-600 dark:text-green-400',
    textColor: 'text-green-800 dark:text-green-200',
    titleColor: 'text-green-900 dark:text-green-100'
  }
};

export function ErrorMessage({ 
  type = 'error', 
  title, 
  message, 
  onClose, 
  actions = null,
  className = '',
  dismissible = true
}) {
  const config = errorTypes[type];
  const Icon = config.icon;

  return (
    <motion.div
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.titleColor} mb-1`}>
              {title}
            </h3>
          )}
          
          <p className={`text-sm ${config.textColor}`}>
            {message}
          </p>
          
          {actions && (
            <div className="mt-3 flex space-x-2">
              {actions}
            </div>
          )}
        </div>
        
        {dismissible && onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 ${config.textColor} hover:${config.bgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type}-50 focus:ring-${type}-600`}
            >
              <HiX className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Predefined error messages for common scenarios
export const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: {
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection and try again.',
    type: 'error'
  },
  
  // Image loading errors
  IMAGE_LOAD_FAILED: {
    title: 'Image Loading Failed',
    message: 'Some images could not be loaded. This might be due to a slow connection or server issues.',
    type: 'warning'
  },
  
  // Upload errors
  UPLOAD_FAILED: {
    title: 'Upload Failed',
    message: 'Your files could not be uploaded. Please check the file size and format, then try again.',
    type: 'error'
  },
  
  UPLOAD_SIZE_ERROR: {
    title: 'File Too Large',
    message: 'The selected file is too large. Please choose a file smaller than 10MB.',
    type: 'warning'
  },
  
  UPLOAD_FORMAT_ERROR: {
    title: 'Unsupported Format',
    message: 'This file format is not supported. Please use JPEG, PNG, WebP, or GIF files.',
    type: 'warning'
  },
  
  // Gallery errors
  GALLERY_LOAD_ERROR: {
    title: 'Gallery Unavailable',
    message: 'The photo gallery could not be loaded at this time. Please try refreshing the page.',
    type: 'error'
  },
  
  // Friend data errors
  FRIENDS_LOAD_ERROR: {
    title: 'Friends Data Unavailable',
    message: 'Friend information could not be loaded. Some features may be limited.',
    type: 'warning'
  },
  
  // Download errors
  DOWNLOAD_FAILED: {
    title: 'Download Failed',
    message: 'The download could not be completed. Please try again or contact support.',
    type: 'error'
  },
  
  // Generic errors
  SOMETHING_WENT_WRONG: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.',
    type: 'error'
  },
  
  // Success messages
  UPLOAD_SUCCESS: {
    title: 'Upload Successful',
    message: 'Your images have been uploaded and are now available in the gallery.',
    type: 'success'
  },
  
  DOWNLOAD_SUCCESS: {
    title: 'Download Complete',
    message: 'Your files have been downloaded successfully.',
    type: 'success'
  }
};

// Toast notification component
export function Toast({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  position = 'top-right'
}) {
  const config = errorTypes[type];
  const Icon = config.icon;
  
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-50 max-w-sm w-full`}
      initial={{ opacity: 0, x: position.includes('right') ? 100 : -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: position.includes('right') ? 100 : -100 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg p-4`}>
        <div className="flex items-center">
          <Icon className={`w-5 h-5 ${config.iconColor} mr-3`} />
          <p className={`text-sm ${config.textColor} flex-1`}>
            {message}
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className={`ml-2 ${config.textColor} hover:opacity-75`}
            >
              <HiX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}