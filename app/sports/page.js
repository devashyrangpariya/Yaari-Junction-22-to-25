'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import TeamSection from '../../components/sports/TeamSection';
import AchievementCard from '../../components/sports/AchievementCard';
import { SPORTS_TEAMS, SPORTS_ACHIEVEMENTS, ANIMATION_DURATIONS } from '../../lib/constants';

export default function SportsPage() {
  const [selectedTeam, setSelectedTeam] = useState('all');

  const filteredAchievements = selectedTeam === 'all' 
    ? SPORTS_ACHIEVEMENTS 
    : SPORTS_ACHIEVEMENTS.filter(achievement => achievement.teamId === selectedTeam);

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

  const filterVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: ANIMATION_DURATIONS.normal / 1000,
        staggerChildren: 0.1,
      },
    },
  };

  const achievementsGridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: ANIMATION_DURATIONS.normal / 1000,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50"
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Sports Achievements
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Celebrating our victories and memorable sports moments from college life. 
            From cricket championships to cricket leagues, here are our proudest achievements.
          </p>
        </motion.div>

        {/* Teams Section */}
        <motion.section
          className="mb-16"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <motion.h2
            className="text-3xl font-bold text-gray-800 text-center mb-8"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            Our Teams
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {SPORTS_TEAMS.map((team, index) => (
              <TeamSection
                key={team.id}
                team={team}
                achievements={SPORTS_ACHIEVEMENTS}
                animationDelay={index * 200}
              />
            ))}
          </div>
        </motion.section>

        {/* Achievements Filter */}
        <motion.section
          className="mb-8"
          variants={filterVariants}
        >
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedTeam === 'all'
                  ? 'bg-gray-800 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
              }`}
              onClick={() => setSelectedTeam('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              All Achievements ({SPORTS_ACHIEVEMENTS.length})
            </motion.button>
            
            {SPORTS_TEAMS.map((team) => {
              const teamAchievements = SPORTS_ACHIEVEMENTS.filter(a => a.teamId === team.id);
              return (
                <motion.button
                  key={team.id}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedTeam === team.id
                      ? 'text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
                  }`}
                  style={{
                    backgroundColor: selectedTeam === team.id ? team.colors.primary : undefined,
                  }}
                  onClick={() => setSelectedTeam(team.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                >
                  {team.name} ({teamAchievements.length})
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* Achievements Grid */}
        <motion.section
          variants={achievementsGridVariants}
        >
          <motion.h2
            className="text-3xl font-bold text-gray-800 text-center mb-8"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            {selectedTeam === 'all' ? 'All Achievements' : 
             `${SPORTS_TEAMS.find(t => t.id === selectedTeam)?.name} Achievements`}
          </motion.h2>

          {filteredAchievements.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAchievements.map((achievement, index) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  index={index}
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
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No achievements found
              </h3>
              <p className="text-gray-500">
                Select a different team to view their achievements.
              </p>
            </motion.div>
          )}
        </motion.section>

        {/* Victory Stats */}
        <motion.section
          className="mt-16 bg-white rounded-2xl shadow-lg p-8"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            Victory Statistics
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              className="text-center"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {SPORTS_ACHIEVEMENTS.filter(a => a.type === 'victory').length}
              </div>
              <div className="text-sm text-gray-600">Total Victories</div>
            </motion.div>
            
            <motion.div
              className="text-center"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <div className="text-3xl font-bold text-green-600 mb-2">
                {SPORTS_ACHIEVEMENTS.filter(a => a.position.includes('1st')).length}
              </div>
              <div className="text-sm text-gray-600">First Places</div>
            </motion.div>
            
            <motion.div
              className="text-center"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {SPORTS_TEAMS.length}
              </div>
              <div className="text-sm text-gray-600">Active Teams</div>
            </motion.div>
            
            <motion.div
              className="text-center"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {SPORTS_ACHIEVEMENTS.length}
              </div>
              <div className="text-sm text-gray-600">Total Achievements</div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}