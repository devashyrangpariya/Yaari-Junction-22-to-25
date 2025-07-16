'use client';

import { useEffect, useRef } from 'react';
import { createFocusableElementsQuery } from '../accessibility';

/**
 * Hook to trap focus within a container (e.g., modal dialog)
 * @param {Object} options - Configuration options
 * @param {boolean} options.isActive - Whether the focus trap is active
 * @param {boolean} options.autoFocus - Whether to auto-focus the first element
 * @param {string} options.initialFocusId - ID of element to focus initially
 * @returns {Object} - Ref to attach to the container
 */
export default function useFocusTrap({
  isActive = false,
  autoFocus = true,
  initialFocusId = null
}) {
  const containerRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Handle focus trap
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      createFocusableElementsQuery()
    );
    
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    // Set initial focus
    if (autoFocus) {
      if (initialFocusId) {
        const initialElement = container.querySelector(`#${initialFocusId}`);
        if (initialElement) {
          initialElement.focus();
        } else {
          firstFocusableElement?.focus();
        }
      } else {
        firstFocusableElement?.focus();
      }
    }

    // Handle tab key to trap focus
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;
      
      // No focusable elements
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      // Shift + Tab
      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement?.focus();
          e.preventDefault();
        }
      } 
      // Tab
      else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement?.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
      
      // Restore focus to previous element when unmounting
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive, autoFocus, initialFocusId]);

  return containerRef;
} 