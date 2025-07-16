'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Higher-order component for adding scroll-triggered animations
export function withScrollAnimation(Component, animationProps = {}) {
  return function AnimatedComponent(props) {
    const {
      threshold = 0.1,
      once = true,
      delay = 0,
      direction = 'fromBottom',
      ...restProps
    } = props;

    const variants = {
      hidden: {
        opacity: 0,
        y: direction === 'fromBottom' ? 50 : direction === 'fromTop' ? -50 : 0,
        x: direction === 'fromLeft' ? -50 : direction === 'fromRight' ? 50 : 0,
        scale: 0.8
      },
      visible: {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          delay,
          ease: 'easeOut',
          ...animationProps
        }
      }
    };

    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once, threshold }}
        variants={variants}
      >
        <Component {...restProps} />
      </motion.div>
    );
  };
}

// Animated counter component
export function AnimatedCounter({ 
  from = 0, 
  to, 
  duration = 2, 
  className = '',
  suffix = '',
  prefix = '' 
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ textContent: from }}
        animate={{ textContent: to }}
        transition={{
          duration,
          ease: 'easeOut'
        }}
        onUpdate={(latest) => {
          if (typeof latest.textContent === 'number') {
            latest.textContent = Math.round(latest.textContent);
          }
        }}
      />
      {suffix}
    </motion.span>
  );
}

// Animated text reveal
export function AnimatedText({ 
  text, 
  className = '',
  delay = 0,
  staggerDelay = 0.05 
}) {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: staggerDelay
      }
    }
  };

  const child = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Floating animation component
export function FloatingElement({ 
  children, 
  intensity = 10,
  duration = 3,
  className = '' 
}) {
  const floatingVariants = {
    animate: {
      y: [-intensity, intensity, -intensity],
      transition: {
        duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div
      variants={floatingVariants}
      animate="animate"
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Morphing shape component
export function MorphingShape({ 
  shapes = [], 
  duration = 2,
  className = '' 
}) {
  const [currentShape, setCurrentShape] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentShape((prev) => (prev + 1) % shapes.length);
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [shapes.length, duration]);

  return (
    <motion.div
      className={className}
      animate={{
        clipPath: shapes[currentShape]
      }}
      transition={{
        duration: duration * 0.8,
        ease: 'easeInOut'
      }}
    />
  );
}

// Particle system component
export function ParticleSystem({ 
  particleCount = 50,
  className = '',
  particleClassName = 'w-1 h-1 bg-blue-500 rounded-full' 
}) {
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3
  }));

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${particleClassName}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}

// Loading animation component
export function LoadingAnimation({ 
  type = 'spinner',
  size = 'md',
  color = 'blue',
  className = '' 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    purple: 'border-purple-500',
    gray: 'border-gray-500'
  };

  if (type === 'spinner') {
    return (
      <motion.div
        className={`border-2 border-t-transparent rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    );
  }

  if (type === 'dots') {
    return (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`rounded-full bg-current ${sizeClasses[size].replace('w-', 'w-').replace('h-', 'h-').split(' ')[0]} ${sizeClasses[size].split(' ')[1]} ${colorClasses[color].replace('border-', 'text-')}`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <motion.div
        className={`rounded-full bg-current ${sizeClasses[size]} ${colorClasses[color].replace('border-', 'text-')} ${className}`}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    );
  }

  return null;
}