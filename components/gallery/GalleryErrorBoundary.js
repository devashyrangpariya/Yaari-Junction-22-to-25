'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HiPhotograph, HiRefresh, HiExclamationCircle } from 'react-icons/hi';

class GalleryErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log gallery-specific errors
    console.error('Gallery Error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      props: this.props
    });
  }

  handleRetry = () => {
    this.setState(prevState => ({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          className="w-full p-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <motion.div
              className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
              <HiPhotograph className="w-10 h-10 text-gray-400" />
            </motion.div>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Gallery Loading Error
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              We couldn't load the gallery images. This might be due to a network issue or server problem.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={this.handleRetry}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={this.state.retryCount >= 3}
              >
                <HiRefresh className="w-4 h-4" />
                <span>
                  {this.state.retryCount >= 3 ? 'Max Retries Reached' : 'Retry Loading'}
                </span>
              </motion.button>
              
              <motion.button
                onClick={() => window.location.reload()}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <HiExclamationCircle className="w-4 h-4" />
                <span>Refresh Page</span>
              </motion.button>
            </div>
            
            {this.state.retryCount > 0 && (
              <p className="text-sm text-gray-500 mt-4">
                Retry attempts: {this.state.retryCount}/3
              </p>
            )}
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default GalleryErrorBoundary;