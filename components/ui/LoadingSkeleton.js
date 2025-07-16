'use client';

import { motion } from 'framer-motion';

// Base skeleton component
export function Skeleton({ className = '', animate = true, ...props }) {
  const baseClasses = "bg-gray-200 dark:bg-gray-700 rounded";
  const animationClasses = animate ? "animate-pulse" : "";
  
  return (
    <div 
      className={`${baseClasses} ${animationClasses} ${className}`}
      {...props}
    />
  );
}

// Gallery skeleton for image grids
export function GallerySkeleton({ count = 12, layout = 'grid' }) {
  const skeletonItems = Array.from({ length: count }, (_, i) => i);
  
  const gridClasses = layout === 'masonry' 
    ? "columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4"
    : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4";

  return (
    <motion.div
      className={gridClasses}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {skeletonItems.map((index) => (
        <motion.div
          key={index}
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <Skeleton 
            className={`w-full ${
              layout === 'masonry' 
                ? `h-${40 + (index % 4) * 20}` // Varying heights for masonry
                : 'aspect-square'
            }`}
          />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </motion.div>
      ))}
    </motion.div>
  );
}

// Friend cards skeleton
export function FriendsSkeleton({ count = 8 }) {
  const skeletonItems = Array.from({ length: count }, (_, i) => i);
  
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {skeletonItems.map((index) => (
        <motion.div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <div className="text-center space-y-4">
            <Skeleton className="w-20 h-20 rounded-full mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-24 mx-auto" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
            <div className="flex justify-center space-x-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Sports achievements skeleton
export function SportsSkeleton() {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {[1, 2].map((team) => (
        <motion.div
          key={team}
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: team * 0.2, duration: 0.3 }}
        >
          <div className="p-8 space-y-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((achievement) => (
                <div key={achievement} className="space-y-3">
                  <Skeleton className="w-full aspect-video rounded-lg" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Funny moments skeleton
export function FunnyMomentsSkeleton({ count = 6 }) {
  const skeletonItems = Array.from({ length: count }, (_, i) => i);
  
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {skeletonItems.map((index) => (
        <motion.div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <Skeleton className="w-full aspect-square" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center space-x-2">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Profile skeleton
export function ProfileSkeleton() {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="text-center sm:text-left space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
            <div className="flex justify-center sm:justify-start space-x-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((stat) => (
          <div key={stat} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
            <Skeleton className="h-8 w-12 mx-auto mb-2" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
        ))}
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((activity) => (
            <div key={activity} className="flex items-center space-x-4">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Generic content skeleton
export function ContentSkeleton({ lines = 3, className = '' }) {
  const skeletonLines = Array.from({ length: lines }, (_, i) => i);
  
  return (
    <div className={`space-y-3 ${className}`}>
      {skeletonLines.map((index) => (
        <Skeleton 
          key={index}
          className={`h-4 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}