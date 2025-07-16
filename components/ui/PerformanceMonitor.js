'use client';

import React, { useState } from 'react';
import usePerformanceMonitor from '@/lib/hooks/usePerformanceMonitor';

/**
 * Performance monitoring component
 * Displays real-time performance metrics in development
 */
const PerformanceMonitor = ({
  enabled = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  componentName = 'App',
  showDetails = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const metrics = usePerformanceMonitor({ enabled, componentName });
  
  if (!enabled) return null;
  
  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };
  
  // Color based on FPS
  const getFpsColor = (fps) => {
    if (fps >= 55) return 'text-green-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Color based on LCP time
  const getLcpColor = (lcp) => {
    if (lcp <= 2500) return 'text-green-500';
    if (lcp <= 4000) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Color based on FID time
  const getFidColor = (fid) => {
    if (fid <= 100) return 'text-green-500';
    if (fid <= 300) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Color based on CLS score
  const getClsColor = (cls) => {
    if (cls <= 0.1) return 'text-green-500';
    if (cls <= 0.25) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 bg-gray-800 bg-opacity-90 text-white rounded-lg shadow-lg p-3 text-sm transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-auto'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="font-medium">Performance</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white focus:outline-none"
          aria-label={isExpanded ? 'Collapse performance monitor' : 'Expand performance monitor'}
        >
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-3 space-y-2">
          <div className="flex justify-between">
            <span>FPS:</span>
            <span className={getFpsColor(metrics.fps)}>{metrics.fps}</span>
          </div>
          
          <div className="flex justify-between">
            <span>LCP:</span>
            <span className={getLcpColor(metrics.lcpTime)}>
              {(metrics.lcpTime / 1000).toFixed(2)}s
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>FID:</span>
            <span className={getFidColor(metrics.fidTime)}>
              {metrics.fidTime.toFixed(1)}ms
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>CLS:</span>
            <span className={getClsColor(metrics.clsScore)}>
              {metrics.clsScore.toFixed(3)}
            </span>
          </div>
          
          {metrics.memory && (
            <div className="flex justify-between">
              <span>Memory:</span>
              <span>
                {metrics.memory.usedJSHeapSize}MB / {metrics.memory.totalJSHeapSize}MB
              </span>
            </div>
          )}
          
          {showDetails && (
            <div className="mt-2 pt-2 border-t border-gray-700 text-xs">
              <div className="text-gray-400">{componentName}</div>
              <div className="text-gray-400">Render time: {metrics.renderTime.toFixed(1)}ms</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor; 