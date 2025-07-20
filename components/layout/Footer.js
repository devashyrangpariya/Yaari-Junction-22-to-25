// components/layout/Footer.js
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import {
  HiHeart,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiExternalLink,
  HiArrowUp,
  HiCode,
  HiSparkles,
  HiCalendar,
  HiUserGroup,
  HiAcademicCap,
  HiPhotograph,
  HiChat,
  HiShare,
} from 'react-icons/hi';
import { 
  FaGithub, 
  FaLinkedin, 
  FaInstagram, 
  FaTwitter,
  FaWhatsapp,
  FaFacebook,
  FaYoutube,
  FaSnapchat,
} from 'react-icons/fa';

export default function Footer() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const currentYear = new Date().getFullYear();
  
  // Only render footer on home page
  const isHomePage = pathname === '/' || pathname === '/home';
  
  useEffect(() => {
    // Only add event listeners if we're on the home page
    if (!isHomePage) return;
    
    const handleScroll = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHomePage]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const contactInfo = [
    {
      icon: HiMail,
      label: 'Email',
      value: '224550307112@aiet.edu.in',
      href: 'mailto:224550307112@aiet.edu.in',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: HiPhone,
      label: 'Phone',
      value: '+91 7600776596',
      href: 'tel:+917600776596',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: HiLocationMarker,
      label: 'Location',
      value: 'Apollo Institute, Gujarat',
      href: 'https://www.google.com/maps/place/Apollo+Institute+of+Engineering+and+Technology',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const quickLinks = [
    { label: 'Gallery', href: '#gallery', icon: HiPhotograph },
    { label: 'Memories', href: '#memories', icon: HiCalendar },
    { label: 'The Boys', href: '#team', icon: HiUserGroup },
    { label: 'Stories', href: '#stories', icon: HiChat },
  ];

  const features = [
    { icon: HiAcademicCap, label: 'College Life', count: '3+ Years' },
    { icon: HiUserGroup, label: 'Squad Members', count: '15+' },
    { icon: HiPhotograph, label: 'Memories', count: '1000+' },
    { icon: HiSparkles, label: 'Inside Jokes', count: '∞' },
  ];

  const socialLinks = [
    { icon: FaGithub, href: '#', label: 'GitHub', color: 'hover:text-gray-400' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-400' },
    { icon: FaInstagram, href: '#', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: FaTwitter, href: '#', label: 'Twitter', color: 'hover:text-cyan-400' },
    { icon: FaWhatsapp, href: '#', label: 'WhatsApp', color: 'hover:text-green-400' },
    { icon: FaFacebook, href: '#', label: 'Facebook', color: 'hover:text-blue-500' },
  ];

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const glowVariants = {
    initial: { opacity: 0.5, scale: 1 },
    animate: {
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.2, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <>
      <motion.footer
        className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={footerVariants}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-900/5 to-transparent" />
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          {/* Top Section - Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.label}
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center">
                    <motion.div
                      className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {feature.count}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">{feature.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Brand & Description */}
            <motion.div variants={itemVariants} className="lg:col-span-5">
              <div className="flex items-start space-x-4 mb-8">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg"
                    variants={glowVariants}
                    initial="initial"
                    animate="animate"
                  />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <span className="text-white font-black text-2xl">YJ</span>
                  </div>
                </motion.div>
                <div>
                  <h3 className="text-2xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Yaari Junction
                  </h3>
                  <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
                    <HiCalendar className="w-4 h-4" />
                    2022-2025 · બજરંગ દળ
                  </p>
                </div>
              </div>
              
              <p className="text-gray-400 leading-relaxed mb-8">
                A digital chronicle of brotherhood, capturing the essence of college life through 
                laughter, chaos, and unforgettable moments. From bunked lectures to midnight adventures, 
                every memory etched in pixels, every story worth retelling.
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      className={`w-12 h-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl flex items-center justify-center text-gray-400 transition-all duration-300 ${social.color}`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <HiSparkles className="w-5 h-5 text-blue-400" />
                Quick Access
              </h4>
              <nav className="space-y-3">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300"
                      whileHover={{ x: 8 }}
                    >
                      <span className="w-10 h-10 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg flex items-center justify-center group-hover:border-blue-500/50 transition-colors duration-300">
                        <Icon className="w-5 h-5 group-hover:text-blue-400" />
                      </span>
                      <span className="font-medium">{link.label}</span>
                      <HiExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.a>
                  );
                })}
              </nav>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants} className="lg:col-span-4">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <HiMail className="w-5 h-5 text-purple-400" />
                Get in Touch
              </h4>
              <div className="space-y-4">
                {contactInfo.map((contact, index) => {
                  const Icon = contact.icon;
                  return (
                    <motion.a
                      key={contact.label}
                      href={contact.href}
                      className="group relative block p-4 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:border-gray-600 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${contact.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`} />
                      <div className="relative flex items-start gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${contact.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-300 mb-1">
                            {contact.label}
                          </p>
                          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                            {contact.value}
                          </p>
                        </div>
                        <HiExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors duration-300" />
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Developer Credit Section */}
          <motion.div
            variants={itemVariants}
            className="mt-16 p-8 bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-lg opacity-50" />
                  <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                    <HiCode className="w-7 h-7 text-white" />
                  </div>
                </motion.div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Crafted with passion by</p>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Devashy Rangpariya
                  </h3>
                </div>
              </div>
              
              <motion.div
                className="flex items-center gap-2 text-sm text-gray-400"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Made with <HiHeart className="w-5 h-5 text-red-500" /> 
                <span className="hidden sm:inline">THE BOYS (બજરંગ દળ) Group</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            className="border-t border-gray-800/50 mt-12 pt-8"
            variants={itemVariants}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                © {currentYear} Yaari Junction. All memories preserved forever.
              </p>
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-300 transition-colors duration-300">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-gray-300 transition-colors duration-300">
                  Terms of Service
                </a>
                <motion.button
                  onClick={() => window.open('#', '_blank')}
                  className="flex items-center gap-2 hover:text-gray-300 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <HiShare className="w-4 h-4" />
                  Share Site
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center group"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <HiArrowUp className="w-6 h-6 group-hover:animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
} 