// components/layout/Footer.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import {
  HiHeart,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiArrowUp,
  HiCode,
  HiSparkles,
  HiCalendar,
  HiUserGroup,
  HiAcademicCap,
  HiPhotograph,
  HiShare,
  HiLink,
  HiX,
  HiClipboardCopy,
  HiCheck
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
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const sharePopupRef = useRef(null);
  const shareButtonRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const websiteUrl = "https://yaari-junction-22-to-25.vercel.app/home";
  
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
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (sharePopupRef.current && !sharePopupRef.current.contains(event.target) && 
          shareButtonRef.current && !shareButtonRef.current.contains(event.target)) {
        setShowSharePopup(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sharePopupRef, shareButtonRef]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const shareWebsite = (platform) => {
    const url = encodeURIComponent(websiteUrl);
    const text = encodeURIComponent("Check out this incredible college memories website by Devashy Rangpariya - Yaari Junction, celebrating our amazing journey from 2022-2025! #YaariJunction #CollegeMemories");
    
    let shareUrl;
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`;
        break;
      default:
        shareUrl = null;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
      setTimeout(() => setShowSharePopup(false), 500);
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(websiteUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const toggleSharePopup = () => {
    setShowSharePopup(prev => !prev);
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

  const features = [
    { icon: HiAcademicCap, label: 'College Life', count: '3+ Years' },
    { icon: HiUserGroup, label: 'Squad Members', count: '15+' },
    { icon: HiPhotograph, label: 'Memories', count: '1000+' },
    { icon: HiSparkles, label: 'Inside Jokes', count: '∞' },
  ];

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/devashyrangpariya', label: 'GitHub', color: 'hover:text-gray-400' },
    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/devashy-rangpariya/', label: 'LinkedIn', color: 'hover:text-blue-400' },
    { icon: FaInstagram, href: 'https://www.instagram.com/_devashy_.06/', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: FaTwitter, href: 'https://x.com/R_Devashy', label: 'Twitter', color: 'hover:text-cyan-400' },
    { icon: FaWhatsapp, href: 'https://wa.me/917600776596', label: 'WhatsApp', color: 'hover:text-green-400' },
    { icon: FaFacebook, href: 'https://www.facebook.com/share/1C5rwd3Zkh/', label: 'Facebook', color: 'hover:text-blue-500' },
  ];
  
  const shareOptions = [
    { 
      platform: 'facebook', 
      icon: FaFacebook, 
      label: 'Share on Facebook', 
      color: 'bg-gradient-to-br from-blue-600 to-blue-800',
      hoverColor: 'bg-gradient-to-br from-blue-500 to-blue-700',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    { 
      platform: 'twitter', 
      icon: FaTwitter, 
      label: 'Share on Twitter', 
      color: 'bg-gradient-to-br from-blue-400 to-blue-500',
      hoverColor: 'bg-gradient-to-br from-blue-300 to-blue-400',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-500'
    },
    { 
      platform: 'whatsapp', 
      icon: FaWhatsapp, 
      label: 'Share on WhatsApp', 
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      hoverColor: 'bg-gradient-to-br from-green-400 to-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    { 
      platform: 'linkedin', 
      icon: FaLinkedin, 
      label: 'Share on LinkedIn', 
      color: 'bg-gradient-to-br from-blue-700 to-blue-900',
      hoverColor: 'bg-gradient-to-br from-blue-600 to-blue-800',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-800'
    },
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
  
  const popupVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9,
      y: 10,
      transformOrigin: 'top right'
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.9,
      y: 10,
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
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
        {/* Enhanced Animated Background Elements */}
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
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-br from-indigo-500/5 to-pink-500/5 rounded-full filter blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          {/* Dynamic grid */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(180deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
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

          {/* Main Content Grid - Now with 2 columns instead of 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Brand & Description */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
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

              {/* Social Links - Enhanced design */}
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      className={`group relative w-12 h-12 flex items-center justify-center transition-all duration-300`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="absolute inset-0 bg-gray-700/30 backdrop-blur-sm border border-gray-600/30 rounded-xl group-hover:border-gray-500/50 transition-all duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-700/0 to-gray-700/0 group-hover:from-blue-600/20 group-hover:to-purple-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Icon className={`w-5 h-5 relative z-10 text-gray-400 ${social.color} transition-colors duration-300`} />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
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
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Developer Credit Section - Enhanced */}
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

          {/* Share Section - Replacing Bottom Bar */}
          <motion.div
            className="border-t border-gray-800/50 mt-12 pt-8"
            variants={itemVariants}
          >
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  © {currentYear} Yaari Junction. All memories preserved forever.
                </p>
                <div className="relative">
                  <motion.button 
                    onClick={toggleSharePopup}
                    ref={shareButtonRef}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-full hover:border-blue-400/50 transition-all duration-300 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-gray-300 text-sm">Share this website</span>
                    <div className="w-6 h-6 flex items-center justify-center bg-blue-500/20 rounded-full group-hover:bg-blue-500/30 transition-colors duration-300">
                      <HiShare className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                  </motion.button>
                  
                  {/* Popup that appears directly from the button */}
                  <AnimatePresence>
                    {showSharePopup && (
                      <motion.div
                        className="absolute bottom-full right-0 mb-4 w-80 shadow-2xl z-40"
                        variants={popupVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        ref={sharePopupRef}
                      >
                        <div className="rounded-2xl overflow-hidden">
                          <div className="relative bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
                            {/* Animated background elements */}
                            <div className="absolute inset-0 -z-10 overflow-hidden">
                              <motion.div 
                                className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full filter blur-2xl"
                                animate={{ 
                                  x: [0, 10, 0],
                                  y: [0, 10, 0], 
                                }}
                                transition={{ 
                                  duration: 5,
                                  repeat: Infinity,
                                  repeatType: "reverse"
                                }}
                              />
                              <motion.div 
                                className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full filter blur-2xl"
                                animate={{ 
                                  x: [0, -10, 0],
                                  y: [0, -10, 0], 
                                }}
                                transition={{ 
                                  duration: 6,
                                  repeat: Infinity,
                                  repeatType: "reverse"
                                }}
                              />
                            </div>

                            <div className="p-5">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                                  <HiShare className="w-4 h-4 text-blue-400" />
                                  Share Yaari Junction
                                </h3>
                                <motion.button 
                                  className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-800/50 transition-colors duration-200"
                                  onClick={() => setShowSharePopup(false)}
                                  whileHover={{ scale: 1.1, rotate: 90 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <HiX className="w-4 h-4" />
                                </motion.button>
                              </div>

                              {/* Website details with author info */}
                              <div className="mb-4 p-3 bg-gray-800/50 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-xl">
                                    <span className="text-white font-bold text-sm">YJ</span>
                                  </div>
                                  <div>
                                    <h4 className="text-sm text-white font-medium">Yaari Junction</h4>
                                    <p className="text-xs text-gray-400">by Devashy Rangpariya</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <a 
                                    href={websiteUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-colors"
                                  >
                                    <HiLink className="w-3 h-3" />
                                    yaari-junction-22-to-25.vercel.app
                                  </a>
                                  <motion.button 
                                    onClick={copyToClipboard}
                                    className="text-xs flex items-center gap-1 py-1 px-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    {copied ? (
                                      <>
                                        <HiCheck className="w-3 h-3 text-green-400" />
                                        <span className="text-green-400">Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <HiClipboardCopy className="w-3 h-3" />
                                        <span>Copy Link</span>
                                      </>
                                    )}
                                  </motion.button>
                                </div>
                              </div>

                              {/* Social Media Sharing Options */}
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                {shareOptions.map((option, index) => {
                                  const Icon = option.icon;
                                  return (
                                    <motion.button
                                      key={option.platform}
                                      onClick={() => shareWebsite(option.platform)}
                                      className="group relative flex items-center p-2 rounded-xl overflow-hidden"
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                    >
                                      {/* Background layers */}
                                      <div className={`absolute inset-0 ${option.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
                                      <motion.div 
                                        className="absolute inset-0 w-full h-full bg-white/20" 
                                        initial={{ x: '-100%', skewX: -15 }}
                                        whileHover={{ x: '100%' }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                      />
                                      
                                      <div className="relative flex items-center gap-2 text-white">
                                        <div className={`w-6 h-6 ${option.lightColor} rounded-full flex items-center justify-center`}>
                                          <Icon className={`w-3 h-3 ${option.textColor}`} />
                                        </div>
                                        <span className="text-xs font-medium">{option.platform}</span>
                                      </div>
                                    </motion.button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.footer>

      {/* Scroll to Top Button - Enhanced */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            className="fixed bottom-8 right-8 z-40 w-14 h-14 text-white rounded-full shadow-lg flex items-center justify-center group overflow-hidden"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-0 group-hover:opacity-100"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <HiArrowUp className="w-6 h-6 relative z-10 group-hover:animate-bounce" />
            
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
} 