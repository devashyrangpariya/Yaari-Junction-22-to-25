'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  HiPhotograph, 
  HiUsers, 
  HiHeart,
  HiCalendar,
  HiTrendingUp,
  HiStar
} from 'react-icons/hi';
import { HiTrophy } from 'react-icons/hi2';
import { staggerContainer, staggerItem } from '../../lib/animations';
import { formatDate } from '../../lib/utils';
import Button from '../ui/Button';

export default function UserStats({ userStats, userProfile }) {
  const statCards = [
    {
      title: 'Total Photos',
      value: userStats.totalPhotos,
      icon: HiPhotograph,
      color: 'blue',
      description: 'Memories captured',
      trend: '+12 this month',
    },
    {
      title: 'Friends Tagged',
      value: userStats.friendsTagged,
      icon: HiUsers,
      color: 'green',
      description: 'Amazing connections',
      trend: 'All friends active',
    },
    {
      title: 'Sports Achievements',
      value: userStats.sportsAchievements,
      icon: HiTrophy,
      color: 'yellow',
      description: 'Victory moments',
      trend: '3 championships',
    },
    {
      title: 'Funny Moments',
      value: userStats.funnyMoments,
      icon: HiHeart,
      color: 'pink',
      description: 'Laughs shared',
      trend: 'Most popular',
    },
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      icon: 'text-green-600 dark:text-green-400',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-800',
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      icon: 'text-yellow-600 dark:text-yellow-400',
      text: 'text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-200 dark:border-yellow-800',
    },
    pink: {
      bg: 'bg-pink-50 dark:bg-pink-900/20',
      icon: 'text-pink-600 dark:text-pink-400',
      text: 'text-pink-600 dark:text-pink-400',
      border: 'border-pink-200 dark:border-pink-800',
    },
  };

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const colors = colorClasses[stat.color];
          
          return (
            <motion.div
              key={stat.title}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border ${colors.border} hover:shadow-xl transition-shadow duration-300`}
              variants={staggerItem}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colors.bg}`}>
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <div className={`text-xs font-medium ${colors.text} bg-white dark:bg-gray-700 px-2 py-1 rounded-full`}>
                  {stat.trend}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {stat.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Yearly Breakdown */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          variants={staggerItem}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Photos by Year
            </h3>
            <HiCalendar className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {Object.entries(userStats.yearlyBreakdown).map(([year, count]) => {
              const percentage = (count / userStats.totalPhotos) * 100;
              
              return (
                <div key={year} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {year}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {count} photos
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Friends */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
          variants={staggerItem}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Most Tagged Friends
            </h3>
            <HiUsers className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {userStats.topFriends.map((friend, index) => (
              <motion.div
                key={friend.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={friend.profileImage}
                      alt={friend.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.name)}&size=40&background=3b82f6&color=ffffff`;
                      }}
                    />
                  </div>
                  {index < 3 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <HiStar className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {friend.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {friend.photoCount} photos together
                  </div>
                </div>
                
                <div className="text-xs text-gray-400">
                  #{index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Summary */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        variants={staggerItem}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <HiTrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userStats.recentActivity.map((activity, index) => {
            const activityTypes = {
              upload: { label: 'Photos Uploaded', icon: HiPhotograph, color: 'blue' },
              tag: { label: 'Friends Tagged', icon: HiUsers, color: 'green' },
              share: { label: 'Memories Shared', icon: HiHeart, color: 'pink' },
            };
            
            const activityInfo = activityTypes[activity.type];
            const colors = colorClasses[activityInfo.color];
            const Icon = activityInfo.icon;
            
            return (
              <motion.div
                key={activity.type}
                className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-white dark:bg-gray-700`}>
                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {activity.count}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {activityInfo.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {formatDate(activity.date, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Profile Summary */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
        variants={staggerItem}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Your College Journey
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Member since {formatDate(userProfile.joinDate, { month: 'long', year: 'numeric' })}
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.floor((new Date() - userProfile.joinDate) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-gray-500 dark:text-gray-400">Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {userStats.totalPhotos}
              </div>
              <div className="text-gray-500 dark:text-gray-400">Memories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {userStats.friendsTagged}
              </div>
              <div className="text-gray-500 dark:text-gray-400">Friends</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}