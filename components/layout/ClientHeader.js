// components/layout/ClientHeader.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiHome, 
  HiPhotograph, 
  HiUsers, 
  HiAcademicCap, 
  HiEmojiHappy, 
  HiUser,
  HiMenu,
  HiX
} from 'react-icons/hi';
import { NAVIGATION_ITEMS, APP_METADATA } from '../../lib/constants';
import { menuVariants, buttonVariants } from '../../lib/animations';
import { getDeviceCapabilities } from '../../lib/mobileOptimizations';

const iconMap = {
  home: HiHome,
  photo: HiPhotograph,
  users: HiUsers,
  trophy: HiAcademicCap,
  smile: HiEmojiHappy,
  user: HiUser,
};

export default function ClientHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState(null);
  const pathname = usePathname();

  // Ensure component is mounted before rendering responsive classes
  useEffect(() => {
    setIsMounted(true);
    setDeviceCapabilities(getDeviceCapabilities());
  }, []);

  // Handle scroll effect for header backdrop
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Determine if we should reduce animations for performance
  const shouldReduceMotion = deviceCapabilities?.isLowMemoryDevice || deviceCapabilities?.prefersReducedMotion;

  // Don't render responsive classes until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/home" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">YJ</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    {APP_METADATA.collegeName}
                  </h1>
                </div>
              </Link>
            </div>
            <button className="p-2 rounded-lg text-gray-700 dark:text-gray-300">
              <HiMenu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-custom shadow-lg' 
          : 'bg-transparent'
      }`}
      initial={shouldReduceMotion ? { opacity: 0 } : { y: -100 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.3 : 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo and College Branding */}
          <motion.div 
            className="flex items-center space-x-2 sm:space-x-4"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: shouldReduceMotion ? 0.2 : 0.5 }}
          >
            <Link href="/home" className="flex items-center space-x-2 sm:space-x-3 group touch-manipulation">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-sm sm:text-lg lg:text-xl">YJ</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-[160px] lg:max-w-none">
                  {APP_METADATA.collegeName}
                </h1>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAVIGATION_ITEMS.map((item, index) => {
              const Icon = iconMap[item.icon];
              const isActive = pathname === item.href || 
                             (pathname === '/' && item.href === '/home');
              
              return (
                <motion.div
                  key={item.name}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0.05 : 0.1 * index, duration: shouldReduceMotion ? 0.2 : 0.4 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Mobile Menu Button - Increased tap target */}
          <motion.button
            className="lg:hidden p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={toggleMenu}
            variants={shouldReduceMotion ? {} : buttonVariants}
            whileHover={shouldReduceMotion ? {} : "hover"}
            whileTap={shouldReduceMotion ? {} : "tap"}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <HiX className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <HiMenu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg"
            variants={shouldReduceMotion ? {
              open: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
              closed: { opacity: 0, height: 0, transition: { duration: 0.3 } }
            } : menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <nav className="px-3 sm:px-4 py-3 sm:py-4 space-y-1 sm:space-y-2">
              {NAVIGATION_ITEMS.map((item, index) => {
                const Icon = iconMap[item.icon];
                const isActive = pathname === item.href || 
                               (pathname === '/' && item.href === '/home');
                
                return (
                  <motion.div
                    key={item.name}
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0.03 * index : 0.05 * index, duration: shouldReduceMotion ? 0.2 : 0.3 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-4 sm:py-3 rounded-lg text-base font-medium transition-all duration-200 touch-manipulation min-h-[48px] ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}