'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HiCloudUpload, HiRefresh, HiExclamationTriangle } from 'react-icons/hi';

class UploadErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      uploadErrors: []
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
    
    // Log upload-specific errors
    console.error('Upload Error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      uploadContext: this.props.uploadContext
    });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    // Call parent retry function if provided
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  handleClearErrors = () => {
    this.setState({ uploadErrors: [] });
  };

  render() {
    if (this.state.hasError) {
      const isNetworkError = this.state.error?.message?.includes('network') || 
                            this.state.error?.message?.includes('fetch');
      const isFileError = this.state.error?.message?.includes('file') || 
                         this.state.error?.message?.includes('upload');

      return (
        <motion.div
          className="w-full p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start space-x-4">
            <motion.div
              className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
              <HiExclamationTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-1">
                Upload Failed
              </h3>
              
              <p className="text-red-700 dark:text-red-300 mb-4">
                {isNetworkError && "Network connection issue. Please check your internet connection."}
                {isFileError && "File upload error. The file might be too large or in an unsupported format."}
                {!isNetworkError && !isFileError && "An unexpected error occurred during upload."}
              </p>
              
              <div className="flex flex-wrap gap-3">
                <motion.button
                  onClick={this.handleRetry}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <HiRefresh className="w-4 h-4" />
                  <span>Try Again</span>
                </motion.button>
                
                <motion.button
                  onClick={() => this.setState({ hasError: false })}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <HiCloudUpload className="w-4 h-4" />
                  <span>Choose Different Files</span>
                </motion.button>
              </div>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                    Technical Details
                  </summary>
                  <pre className="mt-2 text-xs bg-red-100 dark:bg-red-900/30 p-3 rounded overflow-auto max-h-32 text-red-800 dark:text-red-200">
                    {this.state.error?.toString()}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default UploadErrorBoundary;