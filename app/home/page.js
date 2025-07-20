'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  HiSparkles,
  HiPhotograph,
  HiUsers,
  HiAcademicCap,
  HiArrowRight,
  HiChevronDown,
  HiPlay,
  HiPause,
  HiVolumeUp,
  HiVolumeOff,
  HiX,
  HiMusicNote
} from 'react-icons/hi';
import { containerVariants, staggerItem } from '../../lib/animations';
import HighlightReel from '../../components/gallery/HighlightReel';
import Link from 'next/link';

export default function HomePage() {
  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const heroRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.12); // Default 12% volume
  const [showAudioPanel, setShowAudioPanel] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Smooth spring animation for audio visualization
  const audioSpring = useSpring(isAudioPlaying ? 1 : 0, {
    stiffness: 100,
    damping: 30
  });

  // Advanced Particle System
  const ParticleSystem = () => {
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
            style={{
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
            }}
            initial={{
              x: particle.x,
              y: particle.y,
            }}
            animate={{
              x: [
                particle.x,
                particle.x + particle.speedX * 100,
                particle.x + particle.speedX * 200,
                particle.x,
              ],
              y: [
                particle.y,
                particle.y + particle.speedY * 100,
                particle.y + particle.speedY * 200,
                particle.y,
              ],
              rotate: [0, 180, 360],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    );
  };

  // Component mount effect
  useEffect(() => {
    setIsLoaded(true);

    // Auto-start animation after component loads
    const timer = setTimeout(() => {
      document.body.style.overflow = 'auto';
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Initialize audio from localStorage
  useEffect(() => {
    const audioState = localStorage.getItem('audioState');
    const savedVolume = localStorage.getItem('audioVolume');
    const savedMute = localStorage.getItem('audioMuted');

    if (audioState) {
      const state = JSON.parse(audioState);
      setIsAudioPlaying(state.playing);
      setAudioInitialized(state.initialized);
    }

    if (savedVolume) {
      setVolume(parseFloat(savedVolume));
    } else {
      setVolume(0.12); // Default 12%
    }

    if (savedMute) {
      setIsMuted(savedMute === 'true');
    }

    const handleStorageChange = (e) => {
      if (e.key === 'audioState') {
        const state = JSON.parse(e.newValue);
        setIsAudioPlaying(state.playing);
        setAudioInitialized(state.initialized);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Enhanced 3D parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!imageRef.current) return;

      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const posX = (clientX - centerX) / centerX * 8;
      const posY = (clientY - centerY) / centerY * 8;

      requestAnimationFrame(() => {
        if (imageRef.current) {
          imageRef.current.style.transform = `
            perspective(1500px) 
            rotateY(${posX}deg) 
            rotateX(${-posY}deg) 
            translateZ(80px)
            scale(1.08)
          `;
        }
      });
    };

    const handleMouseLeave = () => {
      if (imageRef.current) {
        imageRef.current.style.transform = 'perspective(1500px) rotateY(0deg) rotateX(0deg) translateZ(0) scale(1)';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Advanced audio management
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    audio.volume = volume;
    audio.muted = isMuted;
    audio.loop = true;

    const initAudio = async () => {
      try {
        if (audioInitialized && isAudioPlaying) {
          await audio.play();
        }
      } catch (error) {
        console.log('Waiting for user interaction');
      }
    };

    initAudio();

    const saveAudioState = () => {
      localStorage.setItem('audioState', JSON.stringify({
        playing: !audio.paused,
        initialized: audioInitialized
      }));
      localStorage.setItem('audioVolume', volume.toString());
      localStorage.setItem('audioMuted', isMuted.toString());
    };

    audio.addEventListener('play', saveAudioState);
    audio.addEventListener('pause', saveAudioState);

    const handleVisibilityChange = () => {
      if (document.hidden && !audio.paused) {
        audio.volume = volume * 0.3;
      } else if (!document.hidden && audioInitialized && isAudioPlaying) {
        audio.volume = volume;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Auto-start audio on first user interaction
    if (!audioInitialized) {
      const startAudio = async () => {
        try {
          setAudioInitialized(true);
          await audio.play();
          setIsAudioPlaying(true);

          document.removeEventListener('click', startAudio);
          document.removeEventListener('scroll', startAudio);
          document.removeEventListener('touchstart', startAudio);
        } catch (error) {
          console.error('Audio start failed:', error);
        }
      };

      document.addEventListener('click', startAudio, { once: true });
      document.addEventListener('scroll', startAudio, { once: true });
      document.addEventListener('touchstart', startAudio, { once: true });
    }

    return () => {
      audio.removeEventListener('play', saveAudioState);
      audio.removeEventListener('pause', saveAudioState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [volume, isMuted, audioInitialized, isAudioPlaying]);

  const toggleAudio = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsAudioPlaying(true);
      } else {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      }
    } catch (error) {
      console.error('Audio toggle failed:', error);
    }
  }, []);

  const handleVolumeChange = useCallback((newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  }, [isMuted]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading Experience...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="auto" className="hidden">
        {/* Four Years, One Heart.mp3 */}
        <source src="/audio/bg-1.mp3" type="audio/mpeg" />
        <source src="/audio/bg-1.ogg" type="audio/ogg" />
        {/* <source src="/audio/background-music.mp3" type="audio/mpeg" /> */}
        {/* <source src="/audio/background-music.ogg" type="audio/ogg" /> */}
      </audio>

      {/* Advanced Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        {/* Animated Background with Advanced Parallax */}
        <motion.div
          ref={imageRef}
          className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out"
          style={{
            backgroundImage: 'url(/images/gallery/2025/bg-group.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            y: parallaxY,
          }}
        >
          {/* Multi-layer Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />
        </motion.div>

        {/* Advanced Particle System */}
        <ParticleSystem />

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0,
              }}
              animate={{
                y: [null, -50, -100],
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Enhanced Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="text-center"
          >
            {/* Animated Badge */}
            {/* <motion.div 
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-10 glass"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 15 }}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <HiSparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
              <span className="text-white/90 font-semibold text-lg">2022-2025 Journey</span>
            </motion.div> */}

            {/* Main Title with Advanced Animation */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-6xl font-black mb-3 leading-tight"
              initial={{ opacity: 0, y: 50, rotateX: 90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
            >
              <motion.span
                className="block text-white"
                whileHover={{ scale: 1.05, color: '#60a5fa' }}
                transition={{ duration: 0.3 }}
              >
                Our
              </motion.span>
              <motion.span
                className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                style={{
                  backgroundSize: '200% 200%',
                  animation: 'gradient-shift 4s ease infinite',
                }}
              >
                College Journey
              </motion.span>
            </motion.h1>

            {/* Enhanced Subtitle */}
            <motion.p
              className="text-2xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-12 leading-relaxed font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1 }}
            >
              Four years of <span className="text-blue-400 font-semibold">friendship</span>,
              <span className="text-purple-400 font-semibold"> growth</span>, and
              <span className="text-pink-400 font-semibold"> unforgettable memories</span>
              <br />captured in our digital time capsule
            </motion.p>

            {/* Advanced CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-8 justify-center items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
            >
              <Link href="/gallery">
                <motion.button
                  className="group relative px-12 py-6 bg-white text-black font-bold text-lg rounded-full overflow-hidden shadow-2xl"
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                  <span className="relative z-10 flex items-center gap-3">
                    <HiPhotograph className="w-6 h-6" />
                    Explore Gallery
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <HiArrowRight className="w-5 h-5" />
                    </motion.span>
                  </span>
                </motion.button>
              </Link>

              <Link href="/friends">
                <motion.button
                  className="group px-12 py-6 bg-transparent text-white font-bold text-lg rounded-full border-2 border-white/30 backdrop-blur-xl hover:bg-white/10 transition-all glass"
                  whileHover={{ scale: 1.08, y: -2, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <span className="flex items-center gap-3">
                    <HiUsers className="w-6 h-6" />
                    Meet Our Friends
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    >
                      <HiArrowRight className="w-5 h-5" />
                    </motion.span>
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3 text-white/70 cursor-pointer group"
            whileHover={{ scale: 1.1, color: 'rgba(255,255,255,0.9)' }}
          >
            <span className="text-sm font-medium tracking-wider uppercase">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <HiChevronDown className="w-8 h-8" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Ultra-Advanced Memory Highlights Section */}
      <section className="py-40 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.6),transparent)]" />
        </div>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-96 h-96 rounded-full opacity-5"
              style={{
                background: `radial-gradient(circle, ${['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'][i]
                  } 0%, transparent 70%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.05, 0.1, 0.05],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Advanced Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center mb-32"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 200 }}
              className="inline-block relative mb-10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-70" />
              <div className="relative p-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl">
                <HiPhotograph className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.h2
              className="text-5xl md:text-6xl lg:text-5xl font-black mb-8 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span className="text-white">Memory </span>
              <motion.span
                className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                Highlights
              </motion.span>
            </motion.h2>

            <motion.p
              className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 1 }}
            >
              A curated collection of moments that defined our journey.
              Each frame tells a story of <span className="text-blue-400 font-semibold">laughter</span>,
              <span className="text-purple-400 font-semibold"> achievement</span>, and the
              <span className="text-pink-400 font-semibold"> bonds</span> we&apos;ve built.
            </motion.p>
          </motion.div>

          {/* Ultra-Enhanced Highlight Reel Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            className="relative"
          >
            {/* Multi-layer Glow Effects */}
            <div className="absolute -inset-10 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-3xl opacity-70" />
            <div className="absolute -inset-5 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-2xl" />

            {/* Glassmorphism Container */}
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <HighlightReel />
            </div>
          </motion.div>

          {/* Ultra-Advanced CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-20 text-center"
          >
            <Link href="/gallery">
              <motion.button
                className="group relative px-16 py-8 overflow-hidden rounded-full shadow-2xl"
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {/* Animated Background Layers */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full" />

                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-full"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                <div className="absolute inset-[3px] bg-black/60 backdrop-blur-xl rounded-full" />

                {/* Button Content */}
                <span className="relative z-10 flex items-center gap-4 text-white font-bold text-xl">
                  <HiPhotograph className="w-8 h-8" />
                  Explore Full Gallery
                  <motion.span
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <HiArrowRight className="w-6 h-6" />
                  </motion.span>
                </span>

                {/* Enhanced Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 rounded-full"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
                />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Enhanced What Makes Us Special Section */}
      <section className="py-40 bg-black relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 50% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
              ]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-24"
          >
            <h2 className="text-6xl md:text-7xl font-black text-white mb-8">
              What Makes Us
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                {" "}Special
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover the unique elements that made our college journey extraordinary
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: HiPhotograph,
                title: 'Photo Gallery',
                description: 'Explore memories from 2022-2025',
                gradient: 'from-blue-500 to-cyan-500',
                delay: 0,
              },
              {
                icon: HiUsers,
                title: '13 Amazing Friends',
                description: 'Meet the incredible people who made it special',
                gradient: 'from-purple-500 to-pink-500',
                delay: 0.1,
              },
              {
                icon: HiAcademicCap,
                title: 'Sports Achievements',
                description: 'Cricket AR11 & Satoliya AR7 victories',
                gradient: 'from-orange-500 to-red-500',
                delay: 0.2,
              },
              {
                icon: HiSparkles,
                title: 'Funny Moments',
                description: 'Hilarious memories that still make us laugh',
                gradient: 'from-green-500 to-teal-500',
                delay: 0.3,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 100, rotateY: -90 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: item.delay,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{
                    y: -15,
                    rotateY: 5,
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                  className="group perspective-1000"
                >
                  <div className="relative p-8 bg-gradient-to-b from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700/50 overflow-hidden glass transform-gpu">
                    {/* Animated Background Glow */}
                    <motion.div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${item.gradient}`}
                      initial={{ scale: 0, rotate: 180 }}
                      whileHover={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />

                    {/* Floating Particles */}
                    <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-white/40 rounded-full"
                          initial={{
                            x: Math.random() * 100 + '%',
                            y: '100%',
                            scale: 0
                          }}
                          animate={{
                            y: '-10%',
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0]
                          }}
                          transition={{
                            duration: Math.random() * 2 + 1,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                          }}
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <motion.div
                        className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-3xl flex items-center justify-center mb-8 shadow-2xl`}
                        whileHover={{
                          rotate: 360,
                          scale: 1.2,
                          boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                        }}
                        transition={{ duration: 0.6, type: "spring" }}
                      >
                        <Icon className="w-10 h-10 text-white" />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                      <motion.div
                        className={`absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-full opacity-20`}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ultra-Advanced CTA Section */}
      <section className="py-40 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        {/* Advanced Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
              ]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating Elements */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: [1, 2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 45 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative perspective-1000"
          >
            {/* Ultra-Advanced Card Container */}
            <div className="relative bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-2xl rounded-3xl p-20 border border-gray-700/30 overflow-hidden shadow-2xl glass">

              {/* Animated Border Effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-50"
                style={{
                  background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #10b981, #f59e0b, #3b82f6)",
                  backgroundSize: "400% 100%",
                  padding: "2px",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute inset-[2px] bg-gray-900/90 backdrop-blur-xl rounded-3xl" />
              </motion.div>

              {/* Floating Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-32 h-32 rounded-full opacity-10 bg-gradient-to-r ${['from-blue-500 to-purple-500', 'from-purple-500 to-pink-500', 'from-green-500 to-blue-500'][i % 3]
                      }`}
                    initial={{
                      x: Math.random() * 100 + '%',
                      y: Math.random() * 100 + '%',
                    }}
                    animate={{
                      x: [null, Math.random() * 100 + '%'],
                      y: [null, Math.random() * 100 + '%'],
                      scale: [1, 1.5, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: Math.random() * 15 + 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -270, opacity: 0 }}
                  whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 1, type: "spring", stiffness: 200 }}
                  className="inline-block mb-12 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-60" />
                  <div className="relative p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <HiSparkles className="w-9 h-9 text-white" />
                    </motion.div>
                  </div>
                </motion.div>

                <motion.h2
                  className="text-4xl md:text-4xl lg:text-5xl font-black mb-8 leading-tight"
                  initial={{ opacity: 0, y: 50, rotateX: 90 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  <span className="text-white block">Ready to</span>
                  <motion.span
                    className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    style={{
                      backgroundSize: '200% 200%',
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    Relive the Magic?
                  </motion.span>
                </motion.h2>

                <motion.p
                  className="text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  Dive into our treasure trove of <span className="text-blue-400 font-semibold">memories</span>,
                  celebrate <span className="text-purple-400 font-semibold">friendships</span> that last a lifetime,
                  and witness the <span className="text-pink-400 font-semibold">journey</span> that shaped who we are today.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9, duration: 0.8, type: "spring" }}
                >
                  <Link href="/gallery">
                    <motion.button
                      className="group relative px-16 py-8 text-xl font-bold overflow-hidden shadow-2xl"
                      whileHover={{ scale: 1.08, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      {/* Multi-layer Button Design */}
                      <div className="absolute inset-0 bg-white rounded-full" />

                      <motion.div
                        className="absolute inset-0 rounded-full overflow-hidden"
                        whileHover={{ scale: 1.1 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
                          animate={{
                            x: ["-100%", "100%"],
                            rotate: [0, 360],
                          }}
                          transition={{
                            x: { duration: 3, repeat: Infinity, ease: "linear" },
                            rotate: { duration: 8, repeat: Infinity, ease: "linear" }
                          }}
                        />
                      </motion.div>

                      <div className="absolute inset-[3px] bg-black rounded-full" />

                      <span className="relative z-10 flex items-center gap-4 text-white">
                        Begin Your Journey
                        <motion.span
                          animate={{ x: [0, 8, 0], scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <HiArrowRight className="w-6 h-6" />
                        </motion.span>
                      </span>

                      {/* Enhanced Shine Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 rounded-full"
                        animate={{
                          x: ["-150%", "150%"]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 2,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Professional Audio Control Panel - Top Right */}
      <motion.div
        className="fixed top-8 right-8 z-50"
        initial={{ scale: 0, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 2, type: "spring", stiffness: 200, damping: 15 }}
      >
        <motion.button
          onClick={() => setShowAudioPanel(!showAudioPanel)}
          className="relative p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 group glass shadow-2xl"
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <motion.div
            animate={isAudioPlaying ? {
              rotate: 360,
              scale: [1, 1.1, 1]
            } : { scale: [1, 0.9, 1] }}
            transition={isAudioPlaying ? {
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            } : {
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative"
          >
            {isAudioPlaying ? (
              <HiVolumeUp className="w-7 h-7 text-white" />
            ) : (
              <HiVolumeOff className="w-7 h-7 text-white/60" />
            )}
          </motion.div>

          {/* Audio Visualization Rings */}
          {isAudioPlaying && (
            <>
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-blue-400/40"
                animate={{
                  scale: [1, 1.3, 1.6],
                  opacity: [0.6, 0.3, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-purple-400/40"
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [0.5, 0.2, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.3
                }}
              />
            </>
          )}

          {/* Music Note Indicator */}
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
            animate={isAudioPlaying ? {
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <HiMusicNote className="w-2 h-2 text-white" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Ultra-Advanced Audio Control Panel */}
      <AnimatePresence>
        {showAudioPanel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20, rotateX: -90 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20, rotateX: -90 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-24 right-8 z-50 w-96 p-8 bg-gray-900/95 backdrop-blur-2xl rounded-3xl border border-gray-700/50 shadow-2xl glass"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }}
                style={{ backgroundSize: '200% 200%' }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between mb-8">
              <h3 className="text-white font-bold text-xl flex items-center gap-3">
                <motion.div
                  animate={{ rotate: isAudioPlaying ? 360 : 0 }}
                  transition={{ duration: 2, repeat: isAudioPlaying ? Infinity : 0, ease: "linear" }}
                >
                  <HiVolumeUp className="w-6 h-6 text-blue-400" />
                </motion.div>
                Sound Control
              </h3>
              <motion.button
                onClick={() => setShowAudioPanel(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <HiX className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Play/Pause Button */}
            <motion.button
              onClick={toggleAudio}
              className="w-full mb-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 shadow-lg"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <motion.div
                animate={isAudioPlaying ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.6, repeat: isAudioPlaying ? Infinity : 0 }}
              >
                {isAudioPlaying ? (
                  <HiPause className="w-6 h-6" />
                ) : (
                  <HiPlay className="w-6 h-6" />
                )}
              </motion.div>
              {isAudioPlaying ? 'Pause Music' : 'Play Music'}
            </motion.button>

            {/* Volume Control */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={toggleMute}
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    animate={isMuted ? { opacity: [1, 0.5, 1] } : {}}
                    transition={{ duration: 1, repeat: isMuted ? Infinity : 0 }}
                  >
                    {isMuted ? (
                      <HiVolumeOff className="w-6 h-6 text-red-400" />
                    ) : (
                      <HiVolumeUp className="w-6 h-6" />
                    )}
                  </motion.div>
                </motion.button>

                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-3 bg-gray-700 rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, 
                        #3b82f6 0%, 
                        #8b5cf6 ${(volume * 50)}%, 
                        #ec4899 ${(volume * 100)}%, 
                        #374151 ${(volume * 100)}%, 
                        #374151 100%)`
                    }}
                  />
                </div>

                <span className="text-white text-lg font-bold min-w-[50px] text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>

              {/* Enhanced Visual Equalizer */}
              {isAudioPlaying && !isMuted && (
                <div className="flex items-center justify-center gap-2 h-12 bg-black/30 rounded-2xl p-3">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 bg-gradient-to-t from-blue-500 via-purple-500 to-pink-500 rounded-full"
                      animate={{
                        height: [
                          "8px",
                          `${Math.random() * 30 + 10}px`,
                          `${Math.random() * 25 + 15}px`,
                          `${Math.random() * 35 + 5}px`,
                          "8px"
                        ]
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Audio Info */}
              <div className="text-center text-sm text-gray-400 bg-black/20 rounded-xl p-3">
                <p>🎵 Background Music</p>
                <p className="text-xs mt-1">
                  {isAudioPlaying ? 'Now Playing' : 'Paused'} • Volume: {Math.round(volume * 100)}%
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}