'use client';

import { useEffect, useRef, useCallback } from 'react';
import { KEYBOARD_KEYS, createFocusableElementsQuery, getNextFocusableElement } from '../../lib/accessibility';

const KeyboardNavigation = ({ 
  children, 
  className = '',
  role = 'region',
  ariaLabel,
  enableArrowNavigation = false,
  enableHomeEndNavigation = false,
  trapFocus = false,
  autoFocus = false,
  onEscape,
  ...props 
}) => {
  const containerRef = useRef(null);
  const focusableElementsRef = useRef([]);

  // Update focusable elements list
  const updateFocusableElements = useCallback(() => {
    if (!containerRef.current) return;
    
    const focusableElements = containerRef.current.querySelectorAll(
      createFocusableElementsQuery()
    );
    focusableElementsRef.current = Array.from(focusableElements);
  }, []);

  // Focus management
  const focusElement = useCallback((element) => {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }, []);

  const focusFirst = useCallback(() => {
    const firstElement = focusableElementsRef.current[0];
    focusElement(firstElement);
  }, [focusElement]);

  const focusLast = useCallback(() => {
    const lastElement = focusableElementsRef.current[focusableElementsRef.current.length - 1];
    focusElement(lastElement);
  }, [focusElement]);

  const focusNext = useCallback((currentElement) => {
    const currentIndex = focusableElementsRef.current.indexOf(currentElement);
    const nextIndex = (currentIndex + 1) % focusableElementsRef.current.length;
    const nextElement = focusableElementsRef.current[nextIndex];
    focusElement(nextElement);
  }, [focusElement]);

  const focusPrevious = useCallback((currentElement) => {
    const currentIndex = focusableElementsRef.current.indexOf(currentElement);
    const prevIndex = currentIndex === 0 
      ? focusableElementsRef.current.length - 1 
      : currentIndex - 1;
    const prevElement = focusableElementsRef.current[prevIndex];
    focusElement(prevElement);
  }, [focusElement]);

  // Keyboard event handler
  const handleKeyDown = useCallback((event) => {
    const { key, target } = event;
    
    // Update focusable elements on each interaction
    updateFocusableElements();

    switch (key) {
      case KEYBOARD_KEYS.ESCAPE:
        if (onEscape) {
          event.preventDefault();
          onEscape(event);
        }
        break;

      case KEYBOARD_KEYS.TAB:
        if (trapFocus) {
          event.preventDefault();
          if (event.shiftKey) {
            focusPrevious(target);
          } else {
            focusNext(target);
          }
        }
        break;

      case KEYBOARD_KEYS.ARROW_DOWN:
      case KEYBOARD_KEYS.ARROW_RIGHT:
        if (enableArrowNavigation) {
          event.preventDefault();
          focusNext(target);
        }
        break;

      case KEYBOARD_KEYS.ARROW_UP:
      case KEYBOARD_KEYS.ARROW_LEFT:
        if (enableArrowNavigation) {
          event.preventDefault();
          focusPrevious(target);
        }
        break;

      case KEYBOARD_KEYS.HOME:
        if (enableHomeEndNavigation) {
          event.preventDefault();
          focusFirst();
        }
        break;

      case KEYBOARD_KEYS.END:
        if (enableHomeEndNavigation) {
          event.preventDefault();
          focusLast();
        }
        break;

      default:
        break;
    }
  }, [
    updateFocusableElements,
    onEscape,
    trapFocus,
    enableArrowNavigation,
    enableHomeEndNavigation,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast
  ]);

  // Setup keyboard navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateFocusableElements();

    // Auto focus first element if requested
    if (autoFocus) {
      setTimeout(() => focusFirst(), 100);
    }

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, updateFocusableElements, autoFocus, focusFirst]);

  // Update focusable elements when children change
  useEffect(() => {
    updateFocusableElements();
  }, [children, updateFocusableElements]);

  return (
    <div
      ref={containerRef}
      className={className}
      role={role}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </div>
  );
};

export default KeyboardNavigation;

// Grid navigation component for image galleries
export const GridKeyboardNavigation = ({ 
  children, 
  columns = 3,
  className = '',
  ...props 
}) => {
  const gridRef = useRef(null);

  const handleKeyDown = useCallback((event) => {
    if (!gridRef.current) return;

    const focusableElements = Array.from(
      gridRef.current.querySelectorAll(createFocusableElementsQuery())
    );
    
    const currentIndex = focusableElements.indexOf(event.target);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    switch (event.key) {
      case KEYBOARD_KEYS.ARROW_RIGHT:
        event.preventDefault();
        nextIndex = Math.min(currentIndex + 1, focusableElements.length - 1);
        break;

      case KEYBOARD_KEYS.ARROW_LEFT:
        event.preventDefault();
        nextIndex = Math.max(currentIndex - 1, 0);
        break;

      case KEYBOARD_KEYS.ARROW_DOWN:
        event.preventDefault();
        nextIndex = Math.min(currentIndex + columns, focusableElements.length - 1);
        break;

      case KEYBOARD_KEYS.ARROW_UP:
        event.preventDefault();
        nextIndex = Math.max(currentIndex - columns, 0);
        break;

      case KEYBOARD_KEYS.HOME:
        event.preventDefault();
        nextIndex = 0;
        break;

      case KEYBOARD_KEYS.END:
        event.preventDefault();
        nextIndex = focusableElements.length - 1;
        break;

      default:
        return;
    }

    if (nextIndex !== currentIndex && focusableElements[nextIndex]) {
      focusableElements[nextIndex].focus();
    }
  }, [columns]);

  return (
    <div
      ref={gridRef}
      className={className}
      role="grid"
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  );
};