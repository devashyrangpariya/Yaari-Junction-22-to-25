'use client';

import { useState, useEffect, useCallback } from 'react';

export function useImageLoader(src, options = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    fallbackSrc = null,
    onError = null,
    onLoad = null
  } = options;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);

  const loadImage = useCallback((imageSrc) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        resolve(imageSrc);
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${imageSrc}`));
      };
      
      img.src = imageSrc;
    });
  }, []);

  const retry = useCallback(async () => {
    if (retryCount >= maxRetries) {
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setRetryCount(0);
        setError(null);
        return;
      }
      return;
    }

    setLoading(true);
    setError(null);
    
    // Add delay before retry
    await new Promise(resolve => setTimeout(resolve, retryDelay));
    
    try {
      await loadImage(currentSrc);
      setLoading(false);
      setError(null);
      if (onLoad) onLoad(currentSrc);
    } catch (err) {
      setRetryCount(prev => prev + 1);
      setError(err);
      setLoading(false);
      if (onError) onError(err);
    }
  }, [currentSrc, retryCount, maxRetries, retryDelay, fallbackSrc, loadImage, onLoad, onError]);

  useEffect(() => {
    if (!src) {
      setLoading(false);
      setError(new Error('No image source provided'));
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentSrc(src);
    setRetryCount(0);

    loadImage(src)
      .then(() => {
        setLoading(false);
        if (onLoad) onLoad(src);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        if (onError) onError(err);
      });
  }, [src, loadImage, onLoad, onError]);

  // Auto-retry on error
  useEffect(() => {
    if (error && retryCount < maxRetries) {
      const timeoutId = setTimeout(() => {
        retry();
      }, retryDelay);
      
      return () => clearTimeout(timeoutId);
    }
  }, [error, retryCount, maxRetries, retry, retryDelay]);

  return {
    loading,
    error,
    retryCount,
    maxRetries,
    currentSrc,
    retry: () => retry(),
    canRetry: retryCount < maxRetries || (fallbackSrc && currentSrc !== fallbackSrc)
  };
}

export function useImageBatch(srcArray, options = {}) {
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);

  const loadBatch = useCallback(async () => {
    if (!srcArray || srcArray.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setProgress(0);
    
    const results = {};
    const errorResults = {};
    let completed = 0;

    const loadPromises = srcArray.map(async (src, index) => {
      try {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });
        
        results[src] = {
          src,
          loaded: true,
          element: img
        };
      } catch (error) {
        errorResults[src] = error;
        results[src] = {
          src,
          loaded: false,
          error
        };
      } finally {
        completed++;
        setProgress((completed / srcArray.length) * 100);
      }
    });

    await Promise.allSettled(loadPromises);
    
    setImages(results);
    setErrors(errorResults);
    setLoading(false);
  }, [srcArray]);

  useEffect(() => {
    loadBatch();
  }, [loadBatch]);

  const retryFailed = useCallback(() => {
    const failedSrcs = Object.keys(errors);
    if (failedSrcs.length > 0) {
      // Reset errors for failed images
      const newErrors = { ...errors };
      failedSrcs.forEach(src => delete newErrors[src]);
      setErrors(newErrors);
      
      // Reload failed images
      loadBatch();
    }
  }, [errors, loadBatch]);

  return {
    images,
    loading,
    errors,
    progress,
    retryFailed,
    hasErrors: Object.keys(errors).length > 0,
    successCount: Object.values(images).filter(img => img.loaded).length,
    totalCount: srcArray?.length || 0
  };
}