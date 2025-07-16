'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ANIMATION_DURATIONS } from '../../lib/constants';

const AnimatedCaption = ({ caption, isHovered, delay = 0 }) => {
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [animatedText, setAnimatedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Split caption into words for animation
  const words = caption.split(' ');
  const previewText = words.slice(0, 15).join(' ') + (words.length > 15 ? '...' : '');

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay,
        staggerChildren: 0.02,
      }
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const expandVariants = {
    collapsed: {
      height: 'auto',
      transition: {
        duration: ANIMATION_DURATIONS.normal / 1000,
        ease: 'easeInOut',
      },
    },
    expanded: {
      height: 'auto',
      transition: {
        duration: ANIMATION_DURATIONS.normal / 1000,
        ease: 'easeInOut',
        staggerChildren: 0.01,
      },
    },
  };

  const typewriterVariants = {
    hidden: { width: 0 },
    visible: {
      width: '100%',
      transition: {
        duration: 2,
        ease: 'easeInOut',
      },
    },
  };

  // Typewriter effect for hover
  useEffect(() => {
    if (isHovered && showFullCaption) {
      setAnimatedText('');
      setCurrentIndex(0);
      
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex < caption.length) {
            setAnimatedText(caption.slice(0, prevIndex + 1));
            return prevIndex + 1;
          } else {
            clearInterval(timer);
            return prevIndex;
          }
        });
      }, 30);

      return () => clearInterval(timer);
    }
  }, [isHovered, showFullCaption, caption]);

  const handleToggleCaption = () => {
    setShowFullCaption(!showFullCaption);
  };

  return (
    <motion.div
      className="mb-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Caption Text */}
      <motion.div
        className="relative overflow-hidden"
        variants={expandVariants}
        animate={showFullCaption ? 'expanded' : 'collapsed'}
      >
        {showFullCaption ? (
          <motion.div
            className="text-gray-600 text-sm leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isHovered ? (
              // Typewriter effect on hover
              <motion.div className="relative">
                <span className="invisible">{caption}</span>
                <motion.span
                  className="absolute top-0 left-0 text-gray-800"
                  variants={typewriterVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {animatedText}
                  <motion.span
                    className="inline-block w-0.5 h-4 bg-purple-500 ml-1"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </motion.span>
              </motion.div>
            ) : (
              // Word-by-word animation
              <motion.div>
                {words.map((word, index) => (
                  <motion.span
                    key={index}
                    className="inline-block mr-1"
                    variants={wordVariants}
                    whileHover={{ 
                      scale: 1.05,
                      color: '#8b5cf6',
                      transition: { duration: 0.2 }
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.p
            className="text-gray-600 text-sm line-clamp-3 leading-relaxed"
            variants={wordVariants}
          >
            {previewText}
          </motion.p>
        )}
      </motion.div>

      {/* Read More/Less Button */}
      {words.length > 15 && (
        <motion.button
          className="mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 transition-colors"
          onClick={handleToggleCaption}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variants={{
            hidden: { opacity: 0, x: -10 },
            visible: { 
              opacity: 1, 
              x: 0,
              transition: { delay: delay + 0.2 }
            },
          }}
        >
          <span>{showFullCaption ? 'Show Less' : 'Read More'}</span>
          <motion.span
            animate={{ rotate: showFullCaption ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-xs"
          >
            ▼
          </motion.span>
        </motion.button>
      )}

      {/* Animated Underline */}
      <motion.div
        className="h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 mt-2"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ 
          scaleX: isHovered ? 1 : 0,
          transition: { duration: 0.3, ease: 'easeInOut' }
        }}
      />

      {/* Floating Emojis on Hover */}
      {isHovered && (
        <motion.div className="absolute -top-2 -right-2 pointer-events-none">
          {['😂', '🤣', '😆'].map((emoji, index) => (
            <motion.span
              key={index}
              className="absolute text-lg"
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.random() * 40 - 20,
                y: -20 - Math.random() * 20,
              }}
              transition={{
                duration: 2,
                delay: index * 0.3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnimatedCaption;