'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import FunnyMomentCard from '../../components/funny/FunnyMomentCard';
import { FUNNY_MOMENTS, FUNNY_CATEGORIES, ANIMATION_DURATIONS } from '../../lib/constants';

export default function FunnyMomentsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showComments, setShowComments] = useState({});

  const filteredMoments = selectedCategory === 'all' 
    ? FUNNY_MOMENTS 
    : FUNNY_MOMENTS.filter(moment => moment.category === selectedCategory);

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_DURATIONS.slow / 1000,
        staggerChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: ANIMATION_DURATIONS.slow / 1000,
        ease: 'easeOut',
      },
    },
  };

  const categoryVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: ANIMATION_DURATIONS.normal / 1000,
        staggerChildren: 0.05,
      },
    },
  };

  const momentsGridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: ANIMATION_DURATIONS.normal / 1000,
        staggerChildren: 0.1,
      },
    },
  };

  const toggleComments = (momentId) => {
    setShowComments(prev => ({
      ...prev,
      [momentId]: !prev[momentId]
    }));
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          className="text-center mb-12"
          variants={headerVariants}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 3 
            }}
          >
            😂
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Funny Moments
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our collection of hilarious memories that still make us laugh! 
            From epic fails to comedy gold, these moments define our friendship.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.section
          className="mb-12"
          variants={categoryVariants}
        >
          <motion.h2
            className="text-2xl font-bold text-gray-800 text-center mb-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            Choose Your Comedy
          </motion.h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            {FUNNY_CATEGORIES.map((category, index) => (
              <motion.button
                key={category.id}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? `${category.color} text-white shadow-lg transform scale-105`
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md hover:shadow-lg'
                }`}
                onClick={() => setSelectedCategory(category.id)}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 20 },
                  visible: { 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    transition: { delay: index * 0.05 }
                  },
                }}
                whileHover={{ 
                  scale: selectedCategory === category.id ? 1.05 : 1.1,
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
                <span className="text-xs bg-black/20 px-2 py-1 rounded-full">
                  {category.id === 'all' 
                    ? FUNNY_MOMENTS.length 
                    : FUNNY_MOMENTS.filter(m => m.category === category.id).length
                  }
                </span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Funny Moments Grid */}
        <motion.section
          variants={momentsGridVariants}
        >
          <motion.h2
            className="text-3xl font-bold text-gray-800 text-center mb-8"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            {selectedCategory === 'all' ? 'All Hilarious Moments' : 
             `${FUNNY_CATEGORIES.find(c => c.id === selectedCategory)?.name} Collection`}
          </motion.h2>

          {filteredMoments.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMoments.map((moment, index) => (
                <FunnyMomentCard
                  key={moment.id}
                  moment={moment}
                  index={index}
                  showComments={showComments[moment.id]}
                  onToggleComments={() => toggleComments(moment.id)}
                />
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-16"
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No funny moments found
              </h3>
              <p className="text-gray-500">
                Select a different category to explore more hilarious memories.
              </p>
            </motion.div>
          )}
        </motion.section>

        {/* Fun Stats */}
        <motion.section
          className="mt-16 bg-white rounded-2xl shadow-lg p-8"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            Laughter Statistics
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              className="text-center"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {FUNNY_MOMENTS.reduce((total, moment) => total + moment.reactions.laughs, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Laughs</div>
            </motion.div>
            
            <motion.div
              className="text-center"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <div className="text-3xl font-bold text-pink-600 mb-2">
                {FUNNY_MOMENTS.reduce((total, moment) => total + moment.reactions.loves, 0)}
              </div>
              <div className="text-sm text-gray-600">Love Reactions</div>
            </motion.div>
            
            <motion.div
              className="text-center"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {FUNNY_MOMENTS.reduce((total, moment) => total + moment.comments.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Comments</div>
            </motion.div>
            
            <motion.div
              className="text-center"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <div className="text-3xl font-bold text-green-600 mb-2">
                {FUNNY_MOMENTS.length}
              </div>
              <div className="text-sm text-gray-600">Epic Moments</div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}