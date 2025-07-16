'use client';

import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ANIMATION_DURATIONS, FRIENDS_DATA } from '../../lib/constants';
import AnimatedCaption from './AnimatedCaption';
import CommentSection from './CommentSection';

const FunnyMomentCard = ({ moment, index = 0, showComments, onToggleComments }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const controls = useAnimation();

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9,
      rotateY: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: ANIMATION_DURATIONS.slow / 1000,
        delay: (index * 0.15),
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
    hover: {
      y: -10,
      scale: 1.02,
      rotateY: 2,
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

  const reactionVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: (index * 0.1) + 0.5,
      },
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
      },
    },
  };

  const participantVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: (index * 0.1) + 0.3,
        staggerChildren: 0.05,
      },
    },
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const getParticipantNames = (participantIds) => {
    return participantIds.map(id => {
      const friend = FRIENDS_DATA.find(f => f.id === id);
      return friend ? friend.name : id;
    });
  };

  const getCategoryColor = (category) => {
    const categoryMap = {
      'epic-fails': 'bg-red-500',
      'drama-queen': 'bg-pink-500',
      'relationship-comedy': 'bg-rose-500',
      'travel-fails': 'bg-blue-500',
      'classroom-comedy': 'bg-green-500',
      'group-fails': 'bg-orange-500',
    };
    return categoryMap[category] || 'bg-purple-500';
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'epic-fails': '🤦‍♂️',
      'drama-queen': '🎭',
      'relationship-comedy': '💕',
      'travel-fails': '🗺️',
      'classroom-comedy': '🎓',
      'group-fails': '👥',
    };
    return iconMap[category] || '😂';
  };

  const handleReactionClick = (reactionType) => {
    setShowReactions(true);
    controls.start({
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.5 }
    });
    setTimeout(() => setShowReactions(false), 2000);
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
    >
      {/* Funny Moment Image */}
      <div className="relative h-64 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
        {moment.image && (
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate={imageLoaded ? "visible" : "hidden"}
            whileHover="hover"
          >
            <Image
              src={moment.image}
              alt={moment.title}
              fill
              className="object-cover group-hover:brightness-110 transition-all duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoad={() => setImageLoaded(true)}
            />
          </motion.div>
        )}
        
        {/* Animated Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
          animate={{
            opacity: isHovered ? 0.8 : 0.5,
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Category Badge */}
        <motion.div
          className={`absolute top-4 left-4 ${getCategoryColor(moment.category)} text-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg`}
          variants={reactionVariants}
          whileHover="hover"
        >
          <motion.span 
            className="text-lg"
            animate={isHovered ? { rotate: [0, 15, -15, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {getCategoryIcon(moment.category)}
          </motion.span>
          <span className="text-sm font-semibold capitalize">
            {moment.category.replace('-', ' ')}
          </span>
        </motion.div>

        {/* Date Badge */}
        <motion.div
          className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg"
          variants={reactionVariants}
          whileHover="hover"
        >
          <span className="text-xs font-medium text-gray-800">
            {formatDate(moment.date)}
          </span>
        </motion.div>

        {/* Reaction Overlay */}
        {showReactions && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-6xl"
              animate={controls}
            >
              😂
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Moment Content */}
      <div className="p-6">
        {/* Participants */}
        <motion.div
          className="flex items-center gap-2 mb-4"
          variants={participantVariants}
        >
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 font-medium">Starring:</span>
            <div className="flex flex-wrap gap-1">
              {getParticipantNames(moment.participants).slice(0, 3).map((name, idx) => (
                <motion.span
                  key={idx}
                  className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {name}
                </motion.span>
              ))}
              {moment.participants.length > 3 && (
                <motion.span
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                >
                  +{moment.participants.length - 3}
                </motion.span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Moment Title */}
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
          {moment.title}
        </motion.h3>

        {/* Animated Caption */}
        <AnimatedCaption 
          caption={moment.caption}
          isHovered={isHovered}
          delay={(index * 0.1) + 0.4}
        />

        {/* Reactions */}
        <motion.div
          className="flex items-center justify-between mb-4"
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { delay: (index * 0.1) + 0.5 }
            },
          }}
        >
          <div className="flex items-center gap-4">
            <motion.button
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-purple-600 transition-colors"
              onClick={() => handleReactionClick('laugh')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-lg">😂</span>
              <span className="font-medium">{moment.reactions.laughs}</span>
            </motion.button>
            
            <motion.button
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-pink-600 transition-colors"
              onClick={() => handleReactionClick('love')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-lg">❤️</span>
              <span className="font-medium">{moment.reactions.loves}</span>
            </motion.button>
            
            <motion.button
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-yellow-600 transition-colors"
              onClick={() => handleReactionClick('surprise')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-lg">😮</span>
              <span className="font-medium">{moment.reactions.surprises}</span>
            </motion.button>
          </div>

          {/* Comments Toggle */}
          <motion.button
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors px-3 py-1 rounded-full hover:bg-blue-50"
            onClick={onToggleComments}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg">💬</span>
            <span className="font-medium">{moment.comments.length}</span>
            <motion.span
              animate={{ rotate: showComments ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ▼
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Comments Section */}
        <CommentSection 
          comments={moment.comments}
          showComments={showComments}
          momentId={moment.id}
        />
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: `linear-gradient(45deg, ${getCategoryColor(moment.category)}20, transparent, ${getCategoryColor(moment.category)}20)`,
        }}
        animate={{
          opacity: isHovered ? 0.3 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default FunnyMomentCard;