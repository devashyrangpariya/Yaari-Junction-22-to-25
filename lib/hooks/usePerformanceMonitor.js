'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to monitor performance metrics
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Whether monitoring is enabled
 * @param {string} options.componentName - Name of the component being monitored
 * @param {Function} options.onReport - Callback for performance reports
 * @returns {Object} - Performance metrics
 */
export default function usePerformanceMonitor({
  enabled = true,
  componentName = 'Component',
  onReport = null
}) {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: null,
    lcpTime: 0,
    fidTime: 0,
    clsScore: 0,
    renderTime: 0
  });

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId;
    const renderStart = performance.now();
    
    // Monitor FPS
    const measureFps = () => {
      const now = performance.now();
      frameCount++;
      
      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        
        setMetrics(prev => ({
          ...prev,
          fps,
          renderTime: renderStart ? now - renderStart : prev.renderTime,
          memory: performance.memory ? {
            usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / (1024 * 1024)),
            totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / (1024 * 1024))
          } : null
        }));
        
        frameCount = 0;
        lastTime = now;
      }
      
      animationFrameId = requestAnimationFrame(measureFps);
    };
    
    // Start FPS measurement
    animationFrameId = requestAnimationFrame(measureFps);
    
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        setMetrics(prev => ({
          ...prev,
          lcpTime: lastEntry.startTime
        }));
      });
      
      // First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstEntry = entries[0];
        
        setMetrics(prev => ({
          ...prev,
          fidTime: firstEntry.processingStart - firstEntry.startTime
        }));
      });
      
      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        let clsScore = 0;
        
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
          }
        });
        
        setMetrics(prev => ({
          ...prev,
          clsScore
        }));
      });
      
      try {
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        fidObserver.observe({ type: 'first-input', buffered: true });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.error('Performance observer error:', e);
      }
      
      // Cleanup observers
      return () => {
        cancelAnimationFrame(animationFrameId);
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
    
    // Fallback cleanup if PerformanceObserver not available
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled, componentName, onReport]);

  // Report metrics if callback provided
  useEffect(() => {
    if (onReport && enabled) {
      onReport({
        componentName,
        timestamp: new Date().toISOString(),
        ...metrics
      });
    }
  }, [metrics, onReport, componentName, enabled]);

  return metrics;
} 