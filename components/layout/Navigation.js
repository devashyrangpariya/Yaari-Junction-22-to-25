// components/layout/Navigation.js
// Mobile navigation sidebar with smooth animations and glassmorphism design
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HiHome, 
  HiPhotograph, 
  HiUsers, 
  HiAcademicCap, 
  HiEmojiHappy, 
  HiUser 
} from 'react-icons/hi';
import { NAVIGATION_ITEMS } from '../../lib/constants';
import { containerVariants, staggerItem } from '../../lib/animations';

const iconMap = {
  home: HiHome,
  photo: HiPhotograph,
  users: HiUsers,
  trophy: HiAcademicCap,
  smile: HiEmojiHappy,
  user: HiUser,
};

export default function Navigation({ isOpen, onToggle, className = '' }) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <motion.nav
      className={`fixed inset-0 z-40 lg:hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onToggle}
      />

      {/* Navigation Panel */}
      <motion.div
        className="absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl"
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">CM</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                College Memories
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                2022-2025
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-2">
          {NAVIGATION_ITEMS.map((item, index) => {
            const Icon = iconMap[item.icon];
            const isActive = pathname === item.href || 
                           (pathname === '/' && item.href === '/home');
            
            return (
              <motion.div
                key={item.name}
                variants={staggerItem}
                custom={index}
              >
                <Link
                  href={item.href}
                  onClick={onToggle}
                  className={`flex items-center space-x-4 px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    isActive 
                      ? 'bg-blue-200 dark:bg-blue-800/50' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              College Memory Gallery
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Preserving memories since 2022
            </p>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}