'use client';

import { prefersReducedMotion } from './accessibility';

// Animation variants for Framer Motion
export const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.3 }
  },
  in: { 
    opacity: 1, 
    y: 0,
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.3, ease: "easeOut" }
  },
  out: { 
    opacity: 0, 
    y: -20,
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.2 }
  }
};

export const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.2 }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: prefersReducedMotion() ? 0.01 : 0.3, 
      ease: "easeOut",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.2 }
  }
};

export const backdropVariants = {
  hidden: { 
    opacity: 0,
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.2 }
  },
  visible: { 
    opacity: 1,
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.2 }
  }
};

export const buttonVariants = {
  idle: { 
    scale: 1,
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.2 }
  },
  hover: { 
    scale: prefersReducedMotion() ? 1 : 1.02,
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.2 }
  },
  tap: { 
    scale: prefersReducedMotion() ? 1 : 0.98,
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.1 }
  }
};

export const galleryVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.3 }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: prefersReducedMotion() ? 0.01 : 0.3, 
      ease: "easeOut" 
    }
  },
  hover: { 
    scale: prefersReducedMotion() ? 1 : 1.05,
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.2 }
  }
};

export const containerVariants = {
  hidden: { 
    opacity: 0,
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.3 }
  },
  visible: {
    opacity: 1,
    transition: {
      duration: prefersReducedMotion() ? 0.01 : 0.3,
      staggerChildren: prefersReducedMotion() ? 0 : 0.1,
      delayChildren: prefersReducedMotion() ? 0 : 0.2
    }
  }
};

export const menuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: { 
      duration: prefersReducedMotion() ? 0.01 : 0.2,
      ease: "easeInOut"
    }
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: { 
      duration: prefersReducedMotion() ? 0.01 : 0.3,
      ease: "easeOut"
    }
  }
};

export const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.3 }
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.3 }
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.3 }
  })
};

// Utility function to create responsive animations
export const createResponsiveVariant = (baseVariant, mobileVariant = {}) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return isMobile ? { ...baseVariant, ...mobileVariant } : baseVariant;
};

// Animation presets for common use cases
export const ANIMATION_PRESETS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.3 }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.3 }
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.3 }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.3 }
  },
  
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.3 }
  },
  
  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.3 }
  }
};

// Performance-optimized animation utilities
export const optimizedTransition = {
  type: "tween",
  ease: "easeOut",
  duration: prefersReducedMotion() ? 0.01 : 0.3
};

export const springTransition = {
  type: "spring",
  stiffness: prefersReducedMotion() ? 1000 : 300,
  damping: prefersReducedMotion() ? 100 : 30
};

// Stagger animation utilities
export const createStaggerContainer = (staggerDelay = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: prefersReducedMotion() ? 0 : staggerDelay,
      delayChildren: prefersReducedMotion() ? 0 : 0.1
    }
  }
});

// Pre-configured stagger container with default settings
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: prefersReducedMotion() ? 0 : 0.1,
      delayChildren: prefersReducedMotion() ? 0 : 0.1
    }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: prefersReducedMotion() ? 0.01 : 0.3 }
  }
};