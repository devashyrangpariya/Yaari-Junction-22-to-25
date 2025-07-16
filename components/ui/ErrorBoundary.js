'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { HiExclamationCircle, HiRefresh } from 'react-icons/hi'

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError (error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch (error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
    this.setState({ errorInfo })
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render () {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 rounded-lg bg-red-50 border border-red-100 text-center"
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <HiExclamationCircle className="w-12 h-12 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-800">
              {this.props.title || 'Something went wrong'}
            </h2>
            <p className="text-gray-600 max-w-md">
              {this.props.message ||
                'An error occurred while rendering this component. Please try again later.'}
            </p>
            {this.props.showReset !== false && (
              <button
                onClick={this.resetError}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <HiRefresh className="mr-2" />
                Try Again
              </button>
            )}
          </div>
        </motion.div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary