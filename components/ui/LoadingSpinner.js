'use client';

import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const LoadingSpinner = ({
  size = 'medium',
  color = 'primary',
  text,
  className,
  ...props
}) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16',
  };
  
  const colors = {
    primary: 'border-blue-600',
    secondary: 'border-gray-600',
    white: 'border-white',
    accent: 'border-purple-600',
  };
  
  const spinnerClasses = cn(
    'border-2 border-t-transparent rounded-full',
    sizes[size],
    colors[color],
    className
  );
  
  return (
    <div className="flex flex-col items-center justify-center space-y-2" {...props}>
      <motion.div
        className={spinnerClasses}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {text && (
        <motion.p
          className="text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Skeleton loader component for image placeholders
export const SkeletonLoader = ({
  width = '100%',
  height = '200px',
  className,
  rounded = true,
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        'bg-gray-200 dark:bg-gray-700 animate-pulse',
        rounded && 'rounded-lg',
        className
      )}
      style={{ width, height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...props}
    />
  );
};

// Pulse loader for text content
export const PulseLoader = ({
  lines = 3,
  className,
  ...props
}) => {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          style={{ width: `${Math.random() * 40 + 60}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        />
      ))}
    </div>
  );
};

// Dots loader animation
export const DotsLoader = ({
  size = 'medium',
  color = 'primary',
  className,
  ...props
}) => {
  const dotSizes = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4',
  };
  
  const dotColors = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    white: 'bg-white',
    accent: 'bg-purple-600',
  };
  
  const dotClasses = cn(
    'rounded-full',
    dotSizes[size],
    dotColors[color]
  );
  
  return (
    <div className={cn('flex space-x-1', className)} {...props}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={dotClasses}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
};

// Progress bar loader
export const ProgressLoader = ({
  progress = 0,
  showPercentage = true,
  color = 'primary',
  className,
  ...props
}) => {
  const colors = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    danger: 'bg-red-600',
  };
  
  return (
    <div className={cn('w-full', className)} {...props}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Loading...
        </span>
        {showPercentage && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          className={cn('h-2 rounded-full', colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;