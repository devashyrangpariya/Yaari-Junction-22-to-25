'use client'

import { useState, useEffect } from 'react'
import ErrorBoundary from '../ui/ErrorBoundary'

// This component will throw an error when the button is clicked
const BuggyComponent = () => {
  const [shouldThrow, setShouldThrow] = useState(false)
  
  useEffect(() => {
    if (shouldThrow) {
      throw new Error('Test error thrown from BuggyComponent')
    }
  }, [shouldThrow])
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Test Component</h3>
      <p className="mb-4">Click the button below to trigger an error:</p>
      <button 
        onClick={() => setShouldThrow(true)}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Trigger Error
      </button>
    </div>
  )
}

// Wrapper component with ErrorBoundary
const ErrorTest = () => {
  return (
    <div className="max-w-md mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6">Error Boundary Test</h2>
      <ErrorBoundary 
        title="Component Error" 
        message="This error was caught by the ErrorBoundary component."
      >
        <BuggyComponent />
      </ErrorBoundary>
    </div>
  )
}

export default ErrorTest 