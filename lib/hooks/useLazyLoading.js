'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Intersection Observer hook for lazy loading
export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true
}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        if (isVisible && triggerOnce && !hasTriggered) {
          setHasTriggered(true);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return {
    elementRef,
    isIntersecting: triggerOnce ? (hasTriggered || isIntersecting) : isIntersecting,
    hasTriggered
  };
}

// Virtual scrolling hook for large lists
export function useVirtualScrolling({
  items = [],
  itemHeight = 200,
  containerHeight = 600,
  overscan = 5
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef(null);

  const visibleItemsCount = Math.ceil(containerHeight / itemHeight);
  const totalHeight = items.length * itemHeight;
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    startIndex + visibleItemsCount + overscan * 2
  );

  const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
    ...item,
    index: startIndex + index,
    offsetTop: (startIndex + index) * itemHeight
  }));

  const handleScroll = useCallback((event) => {
    setScrollTop(event.target.scrollTop);
  }, []);

  return {
    scrollElementRef,
    visibleItems,
    totalHeight,
    startIndex,
    endIndex,
    handleScroll
  };
}

// Progressive image loading
export function useProgressiveImage(src, placeholderSrc) {
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    
    img.onload = () => {
      setCurrentSrc(src);
      setLoading(false);
    };
    
    img.onerror = () => {
      setError(true);
      setLoading(false);
    };
    
    img.src = src;
  }, [src]);

  return { currentSrc, loading, error };
}

// Lazy component loading
export function useLazyComponent(importFunction, fallback = null) {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadComponent = useCallback(async () => {
    if (Component || loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const module = await importFunction();
      setComponent(() => module.default || module);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [importFunction, Component, loading]);

  return {
    Component,
    loading,
    error,
    loadComponent
  };
}

// Batch loading for multiple resources
export function useBatchLoader(resources = [], batchSize = 5) {
  const [loadedResources, setLoadedResources] = useState(new Set());
  const [loadingBatch, setLoadingBatch] = useState(new Set());
  const [errors, setErrors] = useState(new Map());
  const [currentBatch, setCurrentBatch] = useState(0);

  const loadBatch = useCallback(async (batchIndex) => {
    const startIndex = batchIndex * batchSize;
    const endIndex = Math.min(startIndex + batchSize, resources.length);
    const batch = resources.slice(startIndex, endIndex);
    
    setLoadingBatch(new Set(batch.map(r => r.id)));
    
    const promises = batch.map(async (resource) => {
      try {
        if (resource.type === 'image') {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(resource);
            img.onerror = reject;
            img.src = resource.src;
          });
        } else if (resource.type === 'component') {
          const module = await resource.importFunction();
          return { ...resource, component: module.default || module };
        }
        return resource;
      } catch (error) {
        setErrors(prev => new Map(prev).set(resource.id, error));
        throw error;
      }
    });

    try {
      const results = await Promise.allSettled(promises);
      
      results.forEach((result, index) => {
        const resource = batch[index];
        if (result.status === 'fulfilled') {
          setLoadedResources(prev => new Set(prev).add(resource.id));
        }
      });
    } finally {
      setLoadingBatch(new Set());
    }
  }, [resources, batchSize]);

  const loadNext = useCallback(() => {
    const nextBatch = currentBatch + 1;
    const maxBatch = Math.ceil(resources.length / batchSize);
    
    if (nextBatch < maxBatch) {
      setCurrentBatch(nextBatch);
      loadBatch(nextBatch);
    }
  }, [currentBatch, resources.length, batchSize, loadBatch]);

  const loadAll = useCallback(async () => {
    const maxBatch = Math.ceil(resources.length / batchSize);
    
    for (let i = 0; i < maxBatch; i++) {
      await loadBatch(i);
    }
  }, [resources.length, batchSize, loadBatch]);

  // Auto-load first batch
  useEffect(() => {
    if (resources.length > 0 && currentBatch === 0) {
      loadBatch(0);
    }
  }, [resources.length, currentBatch, loadBatch]);

  return {
    loadedResources,
    loadingBatch,
    errors,
    currentBatch,
    totalBatches: Math.ceil(resources.length / batchSize),
    loadNext,
    loadAll,
    isComplete: loadedResources.size === resources.length
  };
}