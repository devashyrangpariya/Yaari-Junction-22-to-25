'use client'; 

import { motion } from 'framer-motion';
import { galleryVariants, buttonVariants } from '../../lib/animations';

export default function HoverZoom({ 
  children, 
  scale = 1.05, 
  duration = 0.2,
  className = '',
  whileTap = false,
  tapScale = 0.95
}) {
  const hoverVariants = {
    initial: {
      scale: 1,
    },
    hover: {
      scale,
      transition: {
        duration,
        ease: 'easeInOut'
      }
    },
    tap: whileTap ? {
      scale: tapScale,
      transition: {
        duration: 0.1,
        ease: 'easeInOut'
      }
    } : {}
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      whileTap={whileTap ? "tap" : undefined}
      variants={hoverVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Specialized hover effects for different elements
export function ImageHover({ children, className = '' }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={galleryVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ButtonHover({ children, className = '', disabled = false }) {
  return (
    <motion.div
      initial="idle"
      whileHover={!disabled ? "hover" : "idle"}
      whileTap={!disabled ? "tap" : "idle"}
      variants={buttonVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Card hover with 3D effect
export function CardHover({ 
  children, 
  className = '',
  rotateX = 5,
  rotateY = 5,
  scale = 1.02
}) {
  const cardVariants = {
    initial: {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
    },
    hover: {
      scale,
      rotateX,
      rotateY,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      variants={cardVariants}
      style={{ transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Hover with glow effect
export function GlowHover({ 
  children, 
  className = '',
  glowColor = 'rgba(59, 130, 246, 0.5)' 
}) {
  const glowVariants = {
    initial: {
      scale: 1,
      boxShadow: '0 0 0 rgba(0,0,0,0)'
    },
    hover: {
      scale: 1.03,
      boxShadow: `0 0 20px ${glowColor}`,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      variants={glowVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}