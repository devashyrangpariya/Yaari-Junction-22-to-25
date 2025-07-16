'use client';

import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ANIMATION_DURATIONS } from '../../lib/constants';

const TeamSection = ({ team, achievements, animationDelay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const controls = useAnimation();
  const teamAchievements = achievements.filter(achievement => achievement.teamId === team.id);
  const victories = teamAchievements.filter(a => a.type === 'victory');

  const containerVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: ANIMATION_DURATIONS.slow / 1000,
        delay: animationDelay / 1000,
        staggerChildren: 0.15,
        ease: "easeOut",
      },
    },
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        duration: ANIMATION_DURATIONS.extraSlow / 1000,
      },
    },
    hover: {
      scale: 1.15,
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
    celebration: {
      scale: [1, 1.3, 1.1, 1.25, 1],
      rotate: [0, 15, -15, 10, 0],
      transition: {
        duration: 1.2,
        ease: "easeInOut",
      },
    },
  };

  const achievementCountVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: 0.3,
      },
    },
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  const sparkleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 2,
      },
    },
  };

  const handleCelebration = () => {
    setShowCelebration(true);
    controls.start("celebration");
    setTimeout(() => setShowCelebration(false), 1200);
  };

  return (
    <motion.div
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 hover:shadow-2xl transition-all duration-500"
      style={{ borderColor: team.colors.primary }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: `0 25px 50px -12px ${team.colors.primary}40`
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Sparkle Effects */}
      {victories.length >= 3 && (
        <>
          <motion.div
            className="absolute top-2 left-2 text-yellow-400 text-lg"
            variants={sparkleVariants}
            initial="hidden"
            animate="visible"
          >
            ✨
          </motion.div>
          <motion.div
            className="absolute top-4 right-8 text-yellow-400 text-sm"
            variants={sparkleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            ⭐
          </motion.div>
          <motion.div
            className="absolute bottom-4 left-8 text-yellow-400 text-sm"
            variants={sparkleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 1 }}
          >
            💫
          </motion.div>
        </>
      )}

      {/* Team Header */}
      <div
        className="relative p-8 text-white overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${team.colors.primary} 0%, ${team.colors.secondary === '#ffffff' ? team.colors.primary + '80' : team.colors.secondary} 100%)`,
        }}
      >
        {/* Animated Background Pattern */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : ['0% 0%', '0% 0%'],
          }}
          transition={{ duration: 2, ease: "linear", repeat: Infinity }}
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <motion.h2
              className="text-2xl md:text-3xl font-bold mb-2"
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              {team.name}
            </motion.h2>
            <motion.p
              className="text-sm md:text-base opacity-90 mb-4"
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              {team.description}
            </motion.p>
            <motion.div
              className="flex items-center gap-4 text-sm flex-wrap"
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              <motion.span 
                className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
              >
                {team.sport}
              </motion.span>
              <motion.span 
                className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
              >
                Est. {team.foundedYear}
              </motion.span>
              {victories.length >= 3 && (
                <motion.span 
                  className="bg-yellow-400/20 px-3 py-1 rounded-full backdrop-blur-sm text-yellow-100 font-semibold"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                  whileHover={{ scale: 1.1 }}
                >
                  🏆 Champions
                </motion.span>
              )}
            </motion.div>
          </div>

          {/* Team Logo */}
          <motion.div
            className="relative w-20 h-20 md:w-28 md:h-28 ml-4 cursor-pointer"
            variants={logoVariants}
            animate={controls}
            whileHover="hover"
            onClick={handleCelebration}
          >
            <motion.div 
              className="absolute inset-0 bg-white/20 rounded-full blur-sm"
              animate={{
                scale: isHovered ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Image
              src={team.logo}
              alt={`${team.name} logo`}
              fill
              className="object-contain relative z-10 drop-shadow-lg"
              sizes="(max-width: 768px) 80px, 112px"
            />
            {showCelebration && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center text-4xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                🎉
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Achievement Count Badge */}
        <motion.div
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center cursor-pointer"
          variants={achievementCountVariants}
          animate={isHovered ? "pulse" : "visible"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-lg font-bold">{teamAchievements.length}</span>
        </motion.div>
      </div>

      {/* Enhanced Team Stats */}
      <motion.div
        className="p-6"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <div className="grid grid-cols-3 gap-4 mb-4">
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="text-2xl font-bold text-gray-800"
              animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              {victories.length}
            </motion.div>
            <div className="text-sm text-gray-600">Victories</div>
          </motion.div>
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="text-2xl font-bold text-gray-800"
              animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {teamAchievements.length}
            </motion.div>
            <div className="text-sm text-gray-600">Total</div>
          </motion.div>
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="text-2xl font-bold text-gray-800"
              animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {victories.length >= 3 ? '🔥' : victories.length >= 2 ? '⚡' : '💪'}
            </motion.div>
            <div className="text-sm text-gray-600">Status</div>
          </motion.div>
        </div>

        {/* Recent Achievement Preview */}
        {teamAchievements.length > 0 && (
          <motion.div
            className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 },
            }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-500 font-medium">Latest Achievement</div>
              <motion.div
                className="text-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                {teamAchievements[0].type === 'victory' ? '🏆' : '🎯'}
              </motion.div>
            </div>
            <div className="text-sm font-semibold text-gray-800 mb-1">
              {teamAchievements[0].title}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">
                {teamAchievements[0].position}
              </span>
              {teamAchievements[0].score && (
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {teamAchievements[0].score}
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* Victory Streak Indicator */}
        {victories.length >= 3 && (
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(251, 191, 36, 0.7)",
                  "0 0 0 10px rgba(251, 191, 36, 0)",
                  "0 0 0 0 rgba(251, 191, 36, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>🔥</span>
              <span>Triple Champions</span>
              <span>🔥</span>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TeamSection;