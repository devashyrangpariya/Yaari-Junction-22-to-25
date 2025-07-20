// components/gallery/ScrollAnimation.js
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, useReducedMotion } from 'framer-motion';
import { prefersReducedMotion } from '../../lib/accessibility';
import { HiDownload } from 'react-icons/hi';

// Animation variants for different effects
export const SCROLL_ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  },
  fadeInUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  fadeInDown: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  zoomIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  },
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 }
  },
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 }
  },
  rotateIn: {
    initial: { opacity: 0, rotate: -5 },
    animate: { opacity: 1, rotate: 0 },
    transition: { duration: 0.5 }
  }
};

/**
 * ScrollAnimation Component
 * Wraps children with scroll-based animations using Framer Motion
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Child components to animate
 * @param {string} props.animation - Animation preset name (from SCROLL_ANIMATIONS)
 * @param {Object} props.custom - Custom animation variants
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.threshold - Visibility threshold for triggering animation (0-1)
 * @param {boolean} props.once - Whether to trigger animation only once
 * @param {number} props.delay - Delay before animation starts (seconds)
 * @param {Function} props.onAnimationComplete - Callback when animation completes
 */
export default function ScrollAnimation({
  children,
  animation = 'fadeIn',
  custom,
  className = '',
  threshold = 0.2,
  once = true,
  delay = 0,
  staggerDelay = 0,
  staggerChildren = false,
  onAnimationComplete,
  style = {},
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    threshold,
    margin: "0px 0px -100px 0px" // Trigger slightly before element is in view
  });

  const shouldReduceMotion = useReducedMotion();
  const [hasAnimated, setHasAnimated] = useState(false);

  // Get animation variant based on name or use custom
  const animationVariant = custom || SCROLL_ANIMATIONS[animation] || SCROLL_ANIMATIONS.fadeIn;

  // Apply reduced motion settings if needed
  const safeAnimationVariant = shouldReduceMotion ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.1 }
  } : animationVariant;

  // Handle animation completion
  const handleAnimationComplete = () => {
    if (!hasAnimated) {
      setHasAnimated(true);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }
  };

  // Apply stagger effect for child elements if needed
  const containerVariants = staggerChildren ? {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay || 0.1,
        delayChildren: delay || 0
      }
    }
  } : undefined;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      variants={containerVariants}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      onAnimationComplete={handleAnimationComplete}
      {...(!staggerChildren && {
        initial: safeAnimationVariant.initial,
        animate: isInView ? safeAnimationVariant.animate : safeAnimationVariant.initial,
        transition: {
          ...safeAnimationVariant.transition,
          delay: delay || 0
        }
      })}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollTrigger Component
 * Uses scroll position to animate values based on scroll progress
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Child components to animate
 * @param {string} props.property - CSS property to animate
 * @param {Array} props.inputRange - Input range for scroll values [start, end]
 * @param {Array} props.outputRange - Output range for animated values [start, end]
 */
export function ScrollTrigger({
  children,
  property = "y",
  inputRange = [0, 1],
  outputRange = [0, -100],
  springConfig = { stiffness: 100, damping: 30 },
  className = '',
  style = {}
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const value = useTransform(scrollYProgress, inputRange, outputRange);
  const smoothValue = useSpring(value, springConfig);

  const animatedStyles = {
    [property]: shouldReduceMotion() ? 0 : smoothValue
  };

  return (
    <motion.div
      ref={ref}
      style={{
        ...style,
        ...animatedStyles
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * YearHeader Component
 * Creates a sticky year header with parallax and highlight effects
 */
export const YearHeader = ({
  year,
  isActive = false,
  imagesCount = 0,
  onClick,
  onDownloadClick,
  isDownloading = false,
  downloadProgress = 0
}) => {
  return (
    <motion.div
      className={`flex items-end justify-between mb-6 pb-3 border-b-2 ${isActive ? 'border-indigo-500' : 'border-gray-200 dark:border-gray-700'
        }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <h2
        className={`text-2xl md:text-3xl font-bold flex items-center gap-3 cursor-pointer hover:text-indigo-600 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-800 dark:text-gray-200'
          }`}
        onClick={onClick}
      >
        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          {year}
        </span>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          {imagesCount} images
        </span>
      </h2>

      {onDownloadClick && (
        <motion.button
          onClick={onDownloadClick}
          disabled={isDownloading}
          className={`
            relative px-4 py-2 rounded-xl font-medium text-sm
            backdrop-blur-md transition-all duration-200
            ${isDownloading
              ? 'bg-gray-300/20 text-gray-500 cursor-not-allowed'
              : 'bg-white/10 hover:bg-white/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 shadow-lg hover:shadow-indigo-500/25'
            }
          `}
          whileHover={!isDownloading ? { scale: 1.05 } : {}}
          whileTap={!isDownloading ? { scale: 0.95 } : {}}
        >
          <span className="flex items-center gap-2">
            {isDownloading ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <span>{downloadProgress}%</span>
              </>
            ) : (
              <>
                <HiDownload className="w-4 h-4" />
                <span>Download Year</span>
              </>
            )}
          </span>

          {isDownloading && (
            <motion.div
              className="absolute inset-0 bg-indigo-500/20 rounded-xl"
              initial={{ width: '0%' }}
              animate={{ width: `${downloadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.button>
      )}
    </motion.div>
  );
};

/**
 * ScrollProgressIndicator Component
 * Shows a progress bar based on scroll position
 */
export function ScrollProgressIndicator({ color = "#4f46e5" }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 origin-left z-50"
      style={{ scaleX }}
    />
  );
} 