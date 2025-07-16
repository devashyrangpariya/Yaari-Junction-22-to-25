'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  HiPhotograph, 
  HiUsers, 
  HiHeart,
  HiShare,
  HiDownload,
  HiEye,
  HiCalendar,
  HiClock,
  HiTrendingUp,
  HiFilter
} from 'react-icons/hi';
import { staggerContainer, staggerItem } from '../../lib/animations';
import { formatDate, getFriendById } from '../../lib/utils';
import { FRIENDS_DATA } from '../../lib/constants';

export default function RecentActivity({ userStats }) {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    // Generate mock activity data
    const generateActivities = () => {
      const activityTypes = [
        { type: 'upload', icon: HiPhotograph, color: 'blue', label: 'uploaded photos' },
        { type: 'tag', icon: HiUsers, color: 'green', label: 'tagged friends' },
        { type: 'like', icon: HiHeart, color: 'pink', label: 'liked photos' },
        { type: 'share', icon: HiShare, color: 'purple', label: 'shared memories' },
        { type: 'download', icon: HiDownload, color: 'indigo', label: 'downloaded photos' },
        { type: 'view', icon: HiEye, color: 'gray', label: 'viewed gallery' },
      ];

      const mockActivities = Array.from({ length: 50 }, (_, i) => {
        const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        
        return {
          id: `activity-${i}`,
          type: activityType.type,
          icon: activityType.icon,
          color: activityType.color,
          label: activityType.label,
          date,
          count: Math.floor(Math.random() * 10) + 1,
          details: generateActivityDetails(activityType.type),
        };
      });

      return mockActivities.sort((a, b) => b.date - a.date);
    };

    const generateActivityDetails = (type) => {
      switch (type) {
        case 'upload':
          return {
            photos: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
              id: `photo-${i}`,
              thumbnail: `/images/gallery/sample-${(i % 12) + 1}.jpg`,
              title: `Photo ${i + 1}`,
            })),
          };
        case 'tag':
          return {
            friends: FRIENDS_DATA.slice(0, Math.floor(Math.random() * 3) + 1),
          };
        case 'like':
          return {
            photos: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
              id: `liked-photo-${i}`,
              thumbnail: `/images/gallery/sample-${(i % 12) + 1}.jpg`,
              title: `Liked Photo ${i + 1}`,
            })),
          };
        case 'share':
          return {
            platform: ['Instagram', 'Facebook', 'Twitter'][Math.floor(Math.random() * 3)],
            count: Math.floor(Math.random() * 5) + 1,
          };
        case 'download':
          return {
            format: ['ZIP', 'Individual', 'GIF'][Math.floor(Math.random() * 3)],
            size: `${(Math.random() * 50 + 10).toFixed(1)}MB`,
          };
        case 'view':
          return {
            section: ['Gallery', 'Friends', 'Sports', 'Funny Moments'][Math.floor(Math.random() * 4)],
            duration: `${Math.floor(Math.random() * 30) + 5} minutes`,
          };
        default:
          return {};
      }
    };

    const generatedActivities = generateActivities();
    setActivities(generatedActivities);
    setFilteredActivities(generatedActivities);
  }, []);

  useEffect(() => {
    let filtered = activities;

    // Filter by type
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(activity => activity.type === selectedFilter);
    }

    // Filter by time range
    const now = new Date();
    const timeRanges = {
      day: 1,
      week: 7,
      month: 30,
      year: 365,
    };

    if (timeRanges[timeRange]) {
      const cutoffDate = new Date(now.getTime() - timeRanges[timeRange] * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(activity => activity.date >= cutoffDate);
    }

    setFilteredActivities(filtered);
  }, [activities, selectedFilter, timeRange]);

  const activityFilters = [
    { value: 'all', label: 'All Activities', icon: HiTrendingUp },
    { value: 'upload', label: 'Uploads', icon: HiPhotograph },
    { value: 'tag', label: 'Tags', icon: HiUsers },
    { value: 'like', label: 'Likes', icon: HiHeart },
    { value: 'share', label: 'Shares', icon: HiShare },
    { value: 'download', label: 'Downloads', icon: HiDownload },
    { value: 'view', label: 'Views', icon: HiEye },
  ];

  const timeRangeOptions = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    gray: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return formatDate(date, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        variants={staggerItem}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Recent Activity
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Track your interactions and engagement
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <HiCalendar className="w-5 h-5 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Activity Type Filters */}
        <div className="flex flex-wrap gap-2">
          {activityFilters.map((filter) => {
            const Icon = filter.icon;
            const isActive = selectedFilter === filter.value;
            
            return (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Activity Stats */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {activityFilters.slice(1).map((filter) => {
          const Icon = filter.icon;
          const count = activities.filter(a => a.type === filter.value).length;
          
          return (
            <motion.div
              key={filter.value}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
              variants={staggerItem}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${colorClasses[
                  filter.value === 'upload' ? 'blue' :
                  filter.value === 'tag' ? 'green' :
                  filter.value === 'like' ? 'pink' :
                  filter.value === 'share' ? 'purple' :
                  filter.value === 'download' ? 'indigo' : 'gray'
                ]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {count}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {filter.label}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        variants={staggerItem}
        initial="hidden"
        animate="visible"
      >
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <HiClock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No recent activity
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedFilter !== 'all' || timeRange !== 'all'
                ? 'Try adjusting your filters to see more activities.'
                : 'Start interacting with photos and friends to see your activity here.'
              }
            </p>
          </div>
        ) : (
          <motion.div
            className="space-y-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filteredActivities.map((activity) => {
              const Icon = activity.icon;
              
              return (
                <motion.div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  variants={staggerItem}
                >
                  <div className={`p-2 rounded-lg ${colorClasses[activity.color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-900 dark:text-white">
                        You <span className="font-medium">{activity.label}</span>
                        {activity.count > 1 && (
                          <span className="ml-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                            {activity.count}
                          </span>
                        )}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getRelativeTime(activity.date)}
                      </span>
                    </div>
                    
                    {/* Activity Details */}
                    <div className="mt-2">
                      {activity.type === 'upload' && activity.details.photos && (
                        <div className="flex space-x-2">
                          {activity.details.photos.slice(0, 3).map((photo) => (
                            <div key={photo.id} className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                              <Image
                                src={photo.thumbnail}
                                alt={photo.title}
                                width={48}
                                height={48}
                                className="object-cover"
                                onError={(e) => {
                                  e.target.src = '/images/placeholder.jpg';
                                }}
                              />
                            </div>
                          ))}
                          {activity.details.photos.length > 3 && (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{activity.details.photos.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {activity.type === 'tag' && activity.details.friends && (
                        <div className="flex items-center space-x-2">
                          {activity.details.friends.slice(0, 3).map((friend) => (
                            <div key={friend.id} className="flex items-center space-x-1">
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                                <Image
                                  src={friend.profileImage}
                                  alt={friend.name}
                                  width={24}
                                  height={24}
                                  className="object-cover"
                                  onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.name)}&size=24&background=3b82f6&color=ffffff`;
                                  }}
                                />
                              </div>
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {friend.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {activity.type === 'share' && activity.details.platform && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Shared to {activity.details.platform}
                        </p>
                      )}
                      
                      {activity.type === 'download' && activity.details.format && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Downloaded as {activity.details.format} ({activity.details.size})
                        </p>
                      )}
                      
                      {activity.type === 'view' && activity.details.section && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Viewed {activity.details.section} for {activity.details.duration}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}