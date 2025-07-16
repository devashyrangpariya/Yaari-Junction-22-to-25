'use client';

import { useState, useRef, useEffect } from 'react';
import { TouchGestureHandler } from '../../lib/mobileOptimizations';

export default function TouchGestureWrapper({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  onTap,
  onDoubleTap,
  className = '',
  disabled = false,
  swipeThreshold = 50,
  timeThreshold = 500,
  doubleTapDelay = 300,
  ...props
}) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [lastTap, setLastTap] = useState(0);
  const [pinchStart, setPinchStart] = useState(null);
  const containerRef = useRef(null);

  // Handle touch start
  const handleTouchStart = (e) => {
    if (disabled) return;

    const touch = e.touches[0];
    setTouchStart({
      clientX: touch.clientX,
      clientY: touch.clientY,
      timeStamp: e.timeStamp
    });

    // Handle pinch gesture start
    if (e.touches.length === 2 && onPinch) {
      const pinchData = TouchGestureHandler.detectPinch(e.touches);
      setPinchStart(pinchData);
    }
  };

  // Handle touch move
  const handleTouchMove = (e) => {
    if (disabled) return;

    // Handle pinch gesture
    if (e.touches.length === 2 && onPinch && pinchStart) {
      const currentPinch = TouchGestureHandler.detectPinch(e.touches);
      if (currentPinch) {
        const scale = currentPinch.distance / pinchStart.distance;
        onPinch({
          scale,
          center: currentPinch.center,
          delta: currentPinch.distance - pinchStart.distance
        });
      }
    }
  };

  // Handle touch end
  const handleTouchEnd = (e) => {
    if (disabled || !touchStart) return;

    const touch = e.changedTouches[0];
    const touchEndData = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      timeStamp: e.timeStamp
    };

    setTouchEnd(touchEndData);

    // Handle tap gestures
    const deltaTime = touchEndData.timeStamp - touchStart.timeStamp;
    const deltaX = Math.abs(touchEndData.clientX - touchStart.clientX);
    const deltaY = Math.abs(touchEndData.clientY - touchStart.clientY);

    // Check if it's a tap (minimal movement and quick)
    if (deltaX < 10 && deltaY < 10 && deltaTime < timeThreshold) {
      const now = Date.now();
      
      // Check for double tap
      if (onDoubleTap && now - lastTap < doubleTapDelay) {
        onDoubleTap({
          clientX: touchEndData.clientX,
          clientY: touchEndData.clientY
        });
        setLastTap(0); // Reset to prevent triple tap
      } else {
        setLastTap(now);
        
        // Single tap with delay to check for double tap
        if (onTap) {
          setTimeout(() => {
            if (Date.now() - lastTap >= doubleTapDelay) {
              onTap({
                clientX: touchEndData.clientX,
                clientY: touchEndData.clientY
              });
            }
          }, doubleTapDelay);
        }
      }
    } else {
      // Handle swipe gestures
      const swipe = TouchGestureHandler.detectSwipe(
        touchStart,
        touchEndData,
        swipeThreshold,
        timeThreshold
      );

      if (swipe) {
        const { direction, distance, velocity } = swipe;
        const swipeData = { direction, distance, velocity };

        switch (direction) {
          case 'left':
            onSwipeLeft && onSwipeLeft(swipeData);
            break;
          case 'right':
            onSwipeRight && onSwipeRight(swipeData);
            break;
        }

        // Check for vertical swipes
        const verticalDelta = touchEndData.clientY - touchStart.clientY;
        if (Math.abs(verticalDelta) > swipeThreshold) {
          if (verticalDelta < 0 && onSwipeUp) {
            onSwipeUp({ ...swipeData, direction: 'up' });
          } else if (verticalDelta > 0 && onSwipeDown) {
            onSwipeDown({ ...swipeData, direction: 'down' });
          }
        }
      }
    }

    // Reset pinch state
    setPinchStart(null);
  };

  // Prevent default touch behaviors that might interfere
  const handleTouchCancel = () => {
    setTouchStart(null);
    setTouchEnd(null);
    setPinchStart(null);
  };

  return (
    <div
      ref={containerRef}
      className={`touch-manipulation ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      {...props}
    >
      {children}
    </div>
  );
}

// Specialized wrapper for image galleries
export function SwipeableImageGallery({
  children,
  onPrevious,
  onNext,
  className = '',
  showIndicators = true,
  currentIndex = 0,
  totalItems = 0,
  ...props
}) {
  return (
    <TouchGestureWrapper
      className={`relative ${className}`}
      onSwipeLeft={() => onNext && onNext()}
      onSwipeRight={() => onPrevious && onPrevious()}
      {...props}
    >
      {children}
      
      {/* Swipe indicators */}
      {showIndicators && totalItems > 1 && (
        <div className="swipe-indicator">
          {Array.from({ length: totalItems }).map((_, index) => (
            <div
              key={index}
              className={`swipe-dot ${index === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      )}
    </TouchGestureWrapper>
  );
}

// Wrapper for modal/overlay interactions
export function TouchModal({
  children,
  onClose,
  onSwipeDown,
  className = '',
  ...props
}) {
  return (
    <TouchGestureWrapper
      className={`${className}`}
      onSwipeDown={(swipeData) => {
        if (swipeData.distance > 100) {
          onSwipeDown ? onSwipeDown() : onClose && onClose();
        }
      }}
      onTap={(tapData) => {
        // Close modal on background tap
        if (tapData.target === tapData.currentTarget) {
          onClose && onClose();
        }
      }}
      {...props}
    >
      {children}
    </TouchGestureWrapper>
  );
}