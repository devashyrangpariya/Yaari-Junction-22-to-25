'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HiRefresh, HiExclamationCircle } from 'react-icons/hi';

export default function RetryWrapper({ 
  children, 
  onRetry, 
  maxRetries = 3, 
  retryDelay = 1000,
  fallbackComponent = null,
  errorMessage = "Something went wrong. Please try again."
}) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleRetry = useCallback(async () => {
    if (retryCount >= maxRetries) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      // Add delay before retry
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      
      if (onRetry) {
        await onRetry();
      }
      
      setHasError(false);
    } catch (error) {
      console.error('Retry failed:', error);
      setHasError(true);
    } finally {
      setIsRetrying(false);
    }
  }, [retryCount, maxRetries, retryDelay, onRetry]);

  const handleReset = useCallback(() => {
    setRetryCount(0);
    setHasError(false);
    setIsRetrying(false);
  }, []);

  if (hasError && retryCount >= maxRetries) {
    if (fallbackComponent) {
      return fallbackComponent;
    }
    
    return (
      <motion.div
        className="flex flex-col items-center justify-center p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-16 h-16 mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        >
          <HiExclamationCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </motion.div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Unable to Load Content
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          {errorMessage}
        </p>
        
        <motion.button
          onClick={handleReset}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <HiRefresh className="w-4 h-4" />
          <span>Start Over</span>
        </motion.button>
      </motion.div>
    );
  }

  if (isRetrying) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-8 h-8 mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <HiRefresh className="w-8 h-8 text-blue-600" />
        </motion.div>
        <p className="text-gray-600 dark:text-gray-400">
          Retrying... ({retryCount}/{maxRetries})
        </p>
      </motion.div>
    );
  }

  return children;
}