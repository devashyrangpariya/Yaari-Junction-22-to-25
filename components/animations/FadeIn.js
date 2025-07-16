'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { scrollVariants, fadeInVariants } from '../../lib/animations';
import { prefersReducedMotion } from '../../lib/accessibility';

export default function FadeIn({ 
  children, 
  direction = 'fromBottom', 
  delay = 0, 
  duration = 0.6,
  once = true,
  className = '',
  threshold = 0.1 
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    threshold,
    margin: "-100px 0px -100px 0px"
  });

  const variants = direction === 'scroll' ? scrollVariants : fadeInVariants[direction];

  return (
    <motion.div
      ref={ref}
      initial={direction === 'scroll' ? 'offscreen' : 'hidden'}
      animate={isInView ? (direction === 'scroll' ? 'onscreen' : 'visible') : (direction === 'scroll' ? 'offscreen' : 'hidden')}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Specialized scroll-triggered fade-in component
export function ScrollFadeIn({ 
  children, 
  delay = 0, 
  className = '',
  threshold = 0.1,
  once = true 
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    threshold,
    margin: "-50px 0px -50px 0px"
  });

  return (
    <motion.div
      ref={ref}
      initial="offscreen"
      animate={isInView ? "onscreen" : "offscreen"}
      variants={scrollVariants}
      transition={{
        delay,
        type: 'spring',
        bounce: 0.4,
        duration: 0.8
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered fade-in for lists
export function StaggeredFadeIn({ 
  children, 
  staggerDelay = 0.1, 
  className = '',
  threshold = 0.1 
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    threshold,
    margin: "-100px 0px -100px 0px"
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {Array.isArray(children) ? 
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        )) : 
        <motion.div variants={itemVariants}>
          {children}
        </motion.div>
      }
    </motion.div>
  );
}

export function FadeInStagger({ 
  children, 
  className = '', 
  delay = 0, 
  staggerDelay = 0.1,
  direction = 'up',
  distance = 20,
  once = true
}) {
  // Define container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion() ? 0 : staggerDelay,
        delayChildren: prefersReducedMotion() ? 0 : delay
      }
    }
  };
  
  // Define item variants based on direction
  const fadeItemVariants = {
    hidden: { 
      opacity: 0,
      y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
      x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: { duration: prefersReducedMotion() ? 0.01 : 0.5, ease: "easeOut" }
    }
  };

  // If we're rendering a list of children with keys
  if (Array.isArray(children)) {
    return (
      <motion.div
        className={className}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once }}
      >
        {children.map((child, index) => (
          <motion.div key={index} variants={fadeItemVariants}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }
  
  // If we're wrapping a single component
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
    >
      <motion.div variants={fadeItemVariants}>
        {children}
      </motion.div>
    </motion.div>
  );
}