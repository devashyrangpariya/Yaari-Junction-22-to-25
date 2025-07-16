'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ARIA_LABELS } from '@/lib/accessibility';
import useFocusTrap from '@/lib/hooks/useFocusTrap';
import useKeyboardNavigation from '@/lib/hooks/useKeyboardNavigation';
import { prefersReducedMotion } from '@/lib/accessibility';

/**
 * Accessible modal component with:
 * - Focus trapping
 * - Keyboard navigation
 * - ARIA attributes
 * - Motion preferences respect
 * - Backdrop click handling
 */
const AccessibleModal = ({
  isOpen,
  onClose,
  title,
  children,
  initialFocusId = null,
  className = '',
  showCloseButton = true,
  closeOnBackdropClick = true,
  size = 'md' // 'sm', 'md', 'lg', 'xl', 'full'
}) => {
  // Use focus trap hook
  const containerRef = useFocusTrap({
    isActive: isOpen,
    autoFocus: true,
    initialFocusId
  });

  // Handle keyboard navigation
  useKeyboardNavigation({
    onEscape: onClose,
    enabled: isOpen
  });

  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Determine if animations should be disabled
  const disableAnimations = typeof window !== 'undefined' ? prefersReducedMotion() : false;

  // Modal size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full h-full m-0'
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  // Don't render anything if not in browser
  if (typeof window === 'undefined') return null;

  // Use portal to render modal at the end of the document body
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`modal-title-${title?.replace(/\s+/g, '-').toLowerCase() || 'dialog'}`}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={disableAnimations ? {} : backdropVariants}
            transition={{ duration: 0.2 }}
            onClick={closeOnBackdropClick ? onClose : undefined}
            aria-hidden="true"
          />
          
          {/* Modal content */}
          <motion.div
            ref={containerRef}
            className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-10 w-full mx-4 ${sizeClasses[size]} ${className}`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={disableAnimations ? {} : modalVariants}
            transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 500 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with title and close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2
                id={`modal-title-${title?.replace(/\s+/g, '-').toLowerCase() || 'dialog'}`}
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                {title || 'Dialog'}
              </h2>
              
              {showCloseButton && (
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                  onClick={onClose}
                  aria-label={ARIA_LABELS.MODAL_CLOSE}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Modal body */}
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AccessibleModal; 