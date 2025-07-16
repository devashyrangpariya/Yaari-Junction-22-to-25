'use client';

import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ANIMATION_DURATIONS, SPORTS_TEAMS } from '../../lib/constants';

const AchievementCard = ({ achievement, index = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const controls = useAnimation();
  const team = SPORTS_TEAMS.find(t => t.id === achievement.teamId);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: ANIMATION_DURATIONS.slow / 1000,
        delay: (index * 0.15),
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
    hover: {
      y: -12,
      scale: 1.03,
      rotateX: 2,
      transition: {
        duration: ANIMATION_DURATIONS.fast / 1000,
        ease: 'easeOut',
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.2 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: ANIMATION_DURATIONS.normal / 1000,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: ANIMATION_DURATIONS.normal / 1000,
      },
    },
  };

  const badgeVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 250,
        damping: 15,
        delay: (index * 0.1) + 0.4,
      },
    },
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.5,
      },
    },
  };

  const glowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0, 0.5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3,
      },
    },
  };

  const celebrationVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: [0, 1.5, 1],
      opacity: [0, 1, 0],
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getPositionColor = (position) => {
    if (position.includes('1st')) return 'bg-yellow-500';
    if (position.includes('2nd')) return 'bg-gray-400';
    if (position.includes('3rd')) return 'bg-amber-600';
    return 'bg-blue-500';
  };

  const getTypeIcon = (type) => {
    return type === 'victory' ? '🏆' : '🎯';
  };

  return (
    <motion.div
      className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 group"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered && team ? `0 20px 40px -12px ${team.colors.primary}30` : undefined
      }}
    >
      {/* Glow Effect for Victory Achievements */}
      {achievement.type === 'victory' && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{
            background: `linear-gradient(45deg, ${team?.colors.primary}20, transparent, ${team?.colors.primary}20)`,
          }}
          variants={glowVariants}
          initial="hidden"
          animate="visible"
        />
      )}

      {/* Achievement Image */}
      <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {achievement.images && achievement.images[0] && (
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate={imageLoaded ? "visible" : "hidden"}
            whileHover="hover"
          >
            <Image
              src={achievement.images[0]}
              alt={achievement.title}
              fill
              className="object-cover group-hover:brightness-110 transition-all duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>
        )}
        
        {/* Animated Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
          animate={{
            opacity: isHovered ? 0.8 : 0.4,
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Achievement Type Badge */}
        <motion.div
          className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 shadow-lg"
          variants={badgeVariants}
          whileHover="hover"
        >
          <motion.span 
            className="text-lg"
            animate={isHovered ? { rotate: [0, 15, -15, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {getTypeIcon(achievement.type)}
          </motion.span>
          <span className="text-sm font-semibold capitalize text-gray-800">{achievement.type}</span>
        </motion.div>

        {/* Position Badge */}
        <motion.div
          className={`absolute top-4 right-4 ${getPositionColor(achievement.position)} text-white rounded-full px-4 py-2 shadow-lg`}
          variants={badgeVariants}
          whileHover="hover"
        >
          <span className="text-sm font-bold">{achievement.position}</span>
        </motion.div>

        {/* Score Badge */}
        {achievement.score && (
          <motion.div
            className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (index * 0.1) + 0.6 }}
            whileHover={{ scale: 1.1 }}
          >
            <span className="text-xs font-bold text-gray-800">{achievement.score}</span>
          </motion.div>
        )}

        {/* Team Color Accent with Animation */}
        {team && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-2"
            style={{ backgroundColor: team.colors.primary }}
            animate={{
              height: isHovered ? 6 : 2,
            }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Achievement Content */}
      <div className="p-6">
        {/* Team Name with Enhanced Design */}
        {team && (
          <motion.div
            className="flex items-center gap-3 mb-4"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { delay: (index * 0.1) + 0.2 }
              },
            }}
          >
            <motion.div
              className="w-4 h-4 rounded-full shadow-sm"
              style={{ backgroundColor: team.colors.primary }}
              animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            />
            <span className="text-sm font-semibold text-gray-700">{team.name}</span>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
          </motion.div>
        )}

        {/* Achievement Title */}
        <motion.h3
          className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-gray-900"
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { delay: (index * 0.1) + 0.3 }
            },
          }}
        >
          {achievement.title}
        </motion.h3>

        {/* Achievement Description */}
        <motion.p
          className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed"
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { delay: (index * 0.1) + 0.4 }
            },
          }}
        >
          {achievement.description}
        </motion.p>

        {/* Highlights Section */}
        {achievement.highlights && achievement.highlights.length > 0 && (
          <motion.div
            className="mb-4"
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { delay: (index * 0.1) + 0.5 }
              },
            }}
          >
            <div className="flex flex-wrap gap-2">
              {achievement.highlights.slice(0, 2).map((highlight, idx) => (
                <motion.span
                  key={idx}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                  whileHover={{ scale: 1.05, backgroundColor: team?.colors.primary + '20' }}
                  transition={{ duration: 0.2 }}
                >
                  {highlight}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Achievement Footer */}
        <motion.div
          className="flex items-center justify-between"
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { delay: (index * 0.1) + 0.6 }
            },
          }}
        >
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">
              {formatDate(achievement.date)}
            </span>
            {achievement.type === 'victory' && (
              <motion.span 
                className="text-xs text-green-600 font-semibold"
                animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                Victory Achieved! 🎊
              </motion.span>
            )}
          </div>
          
          {/* Interactive Celebration Button */}
          <motion.button
            className="text-2xl cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ 
              scale: 1.3,
              rotate: [0, -15, 15, -10, 0],
            }}
            whileTap={{ scale: 0.8 }}
            onClick={() => {
              controls.start("visible");
              // Add confetti or celebration effect here
            }}
          >
            🎉
          </motion.button>
        </motion.div>

        {/* Celebration Effect */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          variants={celebrationVariants}
          animate={controls}
        >
          <div className="text-6xl">🎊</div>
        </motion.div>
      </div>

      {/* Hover Indicator */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"
        animate={{
          opacity: isHovered ? 1 : 0,
          scaleX: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default AchievementCard;