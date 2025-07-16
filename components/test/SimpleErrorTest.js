'use client'

import React from 'react'
import ErrorBoundary from '../ui/ErrorBoundary'

// Component that always throws an error
class BrokenComponent extends React.Component {
  componentDidMount() {
    throw new Error('I crashed on purpose!')
  }

  render() {
    return <h1>You should never see this</h1>
  }
}

// Simple test component with ErrorBoundary
export default function SimpleErrorTest() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Simple Error Test</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">With Error Boundary:</h3>
          <ErrorBoundary 
            title="Error Caught!" 
            message="This component crashed, but the error was caught by the ErrorBoundary."
          >
            <BrokenComponent />
          </ErrorBoundary>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Working Component:</h3>
          <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
            <p>This component works fine!</p>
          </div>
        </div>
      </div>
    </div>
  )
} 