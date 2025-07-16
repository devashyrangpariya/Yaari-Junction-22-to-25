'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const LazyLoadWrapper = ({
  children,
  fallback,
  className = '',
  rootMargin = '50px',
  threshold = 0.1,
  triggerOnce = true,
  onIntersect,
  onLoad,
  disabled = false,
  ...props
}) => {
  const [isInView, setIsInView] = useState(disabled);
  const [hasLoaded, setHasLoaded] = useState(disabled);
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  const handleIntersection = useCallback((entries) => {
    const [entry] = entries;
    
    if (entry.isIntersecting) {
      setIsInView(true);
      
      if (onIntersect) {
        onIntersect(entry);
      }

      if (triggerOnce && observerRef.current) {
        observerRef.current.unobserve(entry.target);
      }
    } else if (!triggerOnce) {
      setIsInView(false);
    }
  }, [onIntersect, triggerOnce]);

  useEffect(() => {
    if (disabled || !elementRef.current) return;

    // Create intersection observer
    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold
    });

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, rootMargin, threshold, disabled]);

  useEffect(() => {
    if (isInView && !hasLoaded) {
      setHasLoaded(true);
      if (onLoad) {
        onLoad();
      }
    }
  }, [isInView, hasLoaded, onLoad]);

  // Default fallback component
  const DefaultFallback = () => (
    <div className="flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="animate-pulse flex flex-col items-center space-y-2">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
        <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>
    </div>
  );

  return (
    <div
      ref={elementRef}
      className={cn('lazy-load-wrapper', className)}
      {...props}
    >
      {isInView ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      ) : (
        fallback || <DefaultFallback />
      )}
    </div>
  );
};

export default LazyLoadWrapper;

// Specialized lazy loading components
export const LazyImage = ({ 
  src, 
  alt, 
  className = '',
  containerClassName = '',
  ...props 
}) => {
  return (
    <LazyLoadWrapper
      className={containerClassName}
      fallback={
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
      }
    >
      <img
        src={src}
        alt={alt}
        className={cn('w-full h-full object-cover', className)}
        loading="lazy"
        {...props}
      />
    </LazyLoadWrapper>
  );
};

export const LazySection = ({ 
  children, 
  title,
  className = '',
  ...props 
}) => {
  return (
    <LazyLoadWrapper
      className={className}
      fallback={
        <div className="space-y-4 p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
          </div>
        </div>
      }
      {...props}
    >
      {title && (
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {title}
        </h2>
      )}
      {children}
    </LazyLoadWrapper>
  );
};

export const LazyGrid = ({ 
  children, 
  columns = 3,
  gap = 4,
  className = '',
  ...props 
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  const gapClasses = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  };

  return (
    <LazyLoadWrapper
      className={className}
      fallback={
        <div className={cn('grid', gridClasses[columns], gapClasses[gap])}>
          {Array.from({ length: columns * 2 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            />
          ))}
        </div>
      }
      {...props}
    >
      <div className={cn('grid', gridClasses[columns], gapClasses[gap])}>
        {children}
      </div>
    </LazyLoadWrapper>
  );
};

// Hook for programmatic lazy loading
export const useLazyLoad = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef(null);

  const {
    rootMargin = '50px',
    threshold = 0.1,
    triggerOnce = true,
    onIntersect,
    onLoad
  } = options;

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          
          if (onIntersect) {
            onIntersect(entry);
          }

          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerOnce, onIntersect]);

  useEffect(() => {
    if (isInView && !hasLoaded) {
      setHasLoaded(true);
      if (onLoad) {
        onLoad();
      }
    }
  }, [isInView, hasLoaded, onLoad]);

  return { elementRef, isInView, hasLoaded };
};