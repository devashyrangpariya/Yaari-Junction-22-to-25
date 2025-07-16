'use client';

import { useEffect, useCallback } from 'react';
import { KEYBOARD_KEYS } from '../accessibility';

/**
 * Hook for handling keyboard navigation in components
 * @param {Object} options - Configuration options
 * @param {Function} options.onArrowUp - Handler for arrow up key
 * @param {Function} options.onArrowDown - Handler for arrow down key
 * @param {Function} options.onArrowLeft - Handler for arrow left key
 * @param {Function} options.onArrowRight - Handler for arrow right key
 * @param {Function} options.onEnter - Handler for enter key
 * @param {Function} options.onEscape - Handler for escape key
 * @param {Function} options.onSpace - Handler for space key
 * @param {Function} options.onHome - Handler for home key
 * @param {Function} options.onEnd - Handler for end key
 * @param {boolean} options.enabled - Whether keyboard navigation is enabled
 * @param {HTMLElement} options.targetElement - Element to attach listeners to (defaults to document)
 */
export default function useKeyboardNavigation({
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  onEnter,
  onEscape,
  onSpace,
  onHome,
  onEnd,
  enabled = true,
  targetElement = null
}) {
  const handleKeyDown = useCallback(
    (event) => {
      if (!enabled) return;

      const { key } = event;

      // Map keys to handlers
      const keyHandlers = {
        [KEYBOARD_KEYS.ARROW_UP]: onArrowUp,
        [KEYBOARD_KEYS.ARROW_DOWN]: onArrowDown,
        [KEYBOARD_KEYS.ARROW_LEFT]: onArrowLeft,
        [KEYBOARD_KEYS.ARROW_RIGHT]: onArrowRight,
        [KEYBOARD_KEYS.ENTER]: onEnter,
        [KEYBOARD_KEYS.ESCAPE]: onEscape,
        [KEYBOARD_KEYS.SPACE]: onSpace,
        [KEYBOARD_KEYS.HOME]: onHome,
        [KEYBOARD_KEYS.END]: onEnd
      };

      const handler = keyHandlers[key];
      
      if (handler) {
        // Prevent default behavior for navigation keys
        if (
          key === KEYBOARD_KEYS.ARROW_UP ||
          key === KEYBOARD_KEYS.ARROW_DOWN ||
          key === KEYBOARD_KEYS.SPACE
        ) {
          event.preventDefault();
        }
        
        handler(event);
      }
    },
    [
      enabled,
      onArrowUp,
      onArrowDown,
      onArrowLeft,
      onArrowRight,
      onEnter,
      onEscape,
      onSpace,
      onHome,
      onEnd
    ]
  );

  useEffect(() => {
    if (!enabled) return;
    
    const target = targetElement || document;
    target.addEventListener('keydown', handleKeyDown);
    
    return () => {
      target.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown, targetElement]);
}

// Hook for grid navigation (like image galleries)
export function useGridNavigation({
  items = [],
  columns = 4,
  currentIndex = 0,
  onIndexChange,
  onItemSelect,
  enabled = true,
  wrapAround = false
}) {
  const totalItems = items.length;
  const rows = Math.ceil(totalItems / columns);

  const moveUp = useCallback(() => {
    const newIndex = currentIndex - columns;
    if (newIndex >= 0) {
      onIndexChange?.(newIndex);
    } else if (wrapAround) {
      // Move to bottom row, same column
      const column = currentIndex % columns;
      const lastRowIndex = (rows - 1) * columns + column;
      const wrappedIndex = lastRowIndex < totalItems ? lastRowIndex : totalItems - 1;
      onIndexChange?.(wrappedIndex);
    }
  }, [currentIndex, columns, rows, totalItems, onIndexChange, wrapAround]);

  const moveDown = useCallback(() => {
    const newIndex = currentIndex + columns;
    if (newIndex < totalItems) {
      onIndexChange?.(newIndex);
    } else if (wrapAround) {
      // Move to top row, same column
      const column = currentIndex % columns;
      onIndexChange?.(column);
    }
  }, [currentIndex, columns, totalItems, onIndexChange, wrapAround]);

  const moveLeft = useCallback(() => {
    if (currentIndex > 0) {
      onIndexChange?.(currentIndex - 1);
    } else if (wrapAround) {
      onIndexChange?.(totalItems - 1);
    }
  }, [currentIndex, totalItems, onIndexChange, wrapAround]);

  const moveRight = useCallback(() => {
    if (currentIndex < totalItems - 1) {
      onIndexChange?.(currentIndex + 1);
    } else if (wrapAround) {
      onIndexChange?.(0);
    }
  }, [currentIndex, totalItems, onIndexChange, wrapAround]);

  const selectCurrent = useCallback(() => {
    if (items[currentIndex]) {
      onItemSelect?.(items[currentIndex], currentIndex);
    }
  }, [items, currentIndex, onItemSelect]);

  useKeyboardNavigation({
    onArrowUp: moveUp,
    onArrowDown: moveDown,
    onArrowLeft: moveLeft,
    onArrowRight: moveRight,
    onEnter: selectCurrent,
    onSpace: selectCurrent,
    enabled
  });

  return {
    currentIndex,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    selectCurrent
  };
}

// Hook for focus management
export function useFocusManagement() {
  const focusableElementsSelector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  const getFocusableElements = useCallback((container = document) => {
    return Array.from(container.querySelectorAll(focusableElementsSelector));
  }, [focusableElementsSelector]);

  const trapFocus = useCallback((container) => {
    const focusableElements = getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    // Focus first element
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [getFocusableElements]);

  const restoreFocus = useCallback((element) => {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }, []);

  return {
    getFocusableElements,
    trapFocus,
    restoreFocus
  };
}