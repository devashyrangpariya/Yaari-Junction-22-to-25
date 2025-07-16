/**
 * Custom hook for handling touch gestures on mobile devices
 * Provides swipe, pinch, and pan gesture detection
 */

import { useCallback, useRef, useState } from 'react';

export const useTouchGestures = (options = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinch,
    onPan,
    swipeThreshold = 50,
    swipeTimeout = 500,
    pinchThreshold = 10
  } = options;

  const touchStartRef = useRef(null);
  const touchMoveRef = useRef(null);
  const initialPinchDistance = useRef(null);
  const [isGesturing, setIsGesturing] = useState(false);

  // Calculate distance between two touch points
  const getTouchDistance = useCallback((touch1, touch2) => {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback((event) => {
    const touches = event.touches;
    
    if (touches.length === 1) {
      // Single touch - prepare for swipe or pan
      touchStartRef.current = {
        x: touches[0].clientX,
        y: touches[0].clientY,
        time: Date.now()
      };
      setIsGesturing(true);
    } else if (touches.length === 2) {
      // Two touches - prepare for pinch
      const distance = getTouchDistance(touches[0], touches[1]);
      initialPinchDistance.current = distance;
      setIsGesturing(true);
    }
  }, [getTouchDistance]);

  // Handle touch move
  const handleTouchMove = useCallback((event) => {
    if (!isGesturing) return;

    const touches = event.touches;

    if (touches.length === 1 && touchStartRef.current) {
      // Single touch - handle pan
      const currentTouch = {
        x: touches[0].clientX,
        y: touches[0].clientY
      };

      touchMoveRef.current = currentTouch;

      if (onPan) {
        const deltaX = currentTouch.x - touchStartRef.current.x;
        const deltaY = currentTouch.y - touchStartRef.current.y;
        
        onPan({
          deltaX,
          deltaY,
          startX: touchStartRef.current.x,
          startY: touchStartRef.current.y,
          currentX: currentTouch.x,
          currentY: currentTouch.y
        });
      }
    } else if (touches.length === 2 && initialPinchDistance.current !== null) {
      // Two touches - handle pinch
      const currentDistance = getTouchDistance(touches[0], touches[1]);
      const scale = currentDistance / initialPinchDistance.current;
      
      if (onPinch) {
        const centerX = (touches[0].clientX + touches[1].clientX) / 2;
        const centerY = (touches[0].clientY + touches[1].clientY) / 2;
        
        onPinch({
          scale,
          centerX,
          centerY,
          distance: currentDistance,
          initialDistance: initialPinchDistance.current
        });
      }
    }
  }, [isGesturing, onPan, onPinch, getTouchDistance]);

  // Handle touch end
  const handleTouchEnd = useCallback((event) => {
    if (!isGesturing) return;

    const touches = event.changedTouches;

    if (touches.length === 1 && touchStartRef.current && touchMoveRef.current) {
      // Single touch ended - check for swipe
      const endTouch = {
        x: touches[0].clientX,
        y: touches[0].clientY,
        time: Date.now()
      };

      const deltaX = endTouch.x - touchStartRef.current.x;
      const deltaY = endTouch.y - touchStartRef.current.y;
      const deltaTime = endTouch.time - touchStartRef.current.time;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Check if it's a valid swipe
      const isQuickEnough = deltaTime < swipeTimeout;
      const isLongEnough = Math.max(absX, absY) > swipeThreshold;
      
      if (isQuickEnough && isLongEnough) {
        if (absX > absY) {
          // Horizontal swipe
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight({
              distance: absX,
              velocity: absX / deltaTime,
              startX: touchStartRef.current.x,
              endX: endTouch.x
            });
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft({
              distance: absX,
              velocity: absX / deltaTime,
              startX: touchStartRef.current.x,
              endX: endTouch.x
            });
          }
        } else {
          // Vertical swipe
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown({
              distance: absY,
              velocity: absY / deltaTime,
              startY: touchStartRef.current.y,
              endY: endTouch.y
            });
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp({
              distance: absY,
              velocity: absY / deltaTime,
              startY: touchStartRef.current.y,
              endY: endTouch.y
            });
          }
        }
      }
    }

    // Reset state
    setIsGesturing(false);
    touchStartRef.current = null;
    touchMoveRef.current = null;
    initialPinchDistance.current = null;
  }, [
    isGesturing,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    swipeThreshold,
    swipeTimeout
  ]);

  // Prevent default touch behavior when needed
  const handleTouchCancel = useCallback(() => {
    setIsGesturing(false);
    touchStartRef.current = null;
    touchMoveRef.current = null;
    initialPinchDistance.current = null;
  }, []);

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel
    },
    isGesturing
  };
};

// Hook specifically for image modal gestures
export const useImageModalGestures = ({
  onNext,
  onPrevious,
  onClose,
  onZoom,
  onPan,
  hasNext = true,
  hasPrevious = true,
  isZoomed = false
}) => {
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoomScale, setZoomScale] = useState(1);

  const handleSwipeLeft = useCallback((gesture) => {
    if (!isZoomed && hasNext && onNext) {
      onNext();
    }
  }, [isZoomed, hasNext, onNext]);

  const handleSwipeRight = useCallback((gesture) => {
    if (!isZoomed && hasPrevious && onPrevious) {
      onPrevious();
    }
  }, [isZoomed, hasPrevious, onPrevious]);

  const handleSwipeDown = useCallback((gesture) => {
    if (!isZoomed && gesture.velocity > 0.5 && onClose) {
      onClose();
    }
  }, [isZoomed, onClose]);

  const handlePinch = useCallback((gesture) => {
    const newScale = Math.max(0.5, Math.min(5, gesture.scale));
    setZoomScale(newScale);
    
    if (onZoom) {
      onZoom({
        scale: newScale,
        centerX: gesture.centerX,
        centerY: gesture.centerY
      });
    }
  }, [onZoom]);

  const handlePanGesture = useCallback((gesture) => {
    if (isZoomed) {
      const newOffset = {
        x: gesture.deltaX,
        y: gesture.deltaY
      };
      setPanOffset(newOffset);
      
      if (onPan) {
        onPan(newOffset);
      }
    }
  }, [isZoomed, onPan]);

  const { touchHandlers, isGesturing } = useTouchGestures({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    onSwipeDown: handleSwipeDown,
    onPinch: handlePinch,
    onPan: handlePanGesture,
    swipeThreshold: 50,
    swipeTimeout: 500
  });

  const resetGestures = useCallback(() => {
    setPanOffset({ x: 0, y: 0 });
    setZoomScale(1);
  }, []);

  return {
    touchHandlers,
    isGesturing,
    panOffset,
    zoomScale,
    resetGestures
  };
};