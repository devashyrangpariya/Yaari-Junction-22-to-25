'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  HiUser, 
  HiPhotograph, 
  HiCog, 
  HiCalendar
} from 'react-icons/hi';
import { APP_METADATA, FRIENDS_DATA, SPORTS_ACHIEVEMENTS, FUNNY_MOMENTS } from '../../lib/constants';
import { pageVariants, containerVariants, staggerItem } from '../../lib/animations';
import { storage } from '../../lib/utils';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import UserStats from '../../components/profile/UserStats';
import MemoryManager from '../../components/profile/MemoryManager';
import UserPreferences from '../../components/profile/UserPreferences';
import RecentActivity from '../../components/profile/RecentActivity';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user profile and stats
  useEffect(() => {
    const initializeProfile = async () => {
      try {
        // Get user preferences from localStorage or set defaults
        const savedPreferences = storage.get('userPreferences', {
          theme: 'light',
          animationsEnabled: true,
          autoPlayCarousels: true,
          showFriendSuggestions: true,
          emailNotifications: true,
          privacyMode: false,
        });

        // Mock user profile data (in real app, this would come from API)
        const profile = {
          id: 'devashy',
          name: APP_METADATA.author || 'Devashy Rangpariya',
          collegeName: APP_METADATA.collegeName || 'Yaari Junction 22-25',
          graduationYear: APP_METADATA.graduationYear || 2025,
          profileImage: '/images/friends/devashy.jpg',
          bio: 'Computer Science student passionate about web development, photography, and creating memories with amazing friends.',
          joinDate: new Date('2022-08-15'),
          preferences: savedPreferences,
        };

        // Calculate user statistics
        const stats = calculateUserStats();

        // Set data with a small delay to ensure smooth loading
        setTimeout(() => {
          setUserProfile(profile);
          setUserStats(stats);
          setLoading(false);
        }, 100);

      } catch (error) {
        console.error('Error initializing profile:', error);
        // Set default values even if there's an error
        setUserProfile({
          id: 'devashy',
          name: 'Devashy Rangpariya',
          collegeName: 'Yaari Junction 22-25',
          graduationYear: 2025,
          profileImage: '/images/friends/devashy.jpg',
          bio: 'Computer Science student passionate about web development, photography, and creating memories with amazing friends.',
          joinDate: new Date('2022-08-15'),
          preferences: {
            theme: 'light',
            animationsEnabled: true,
            autoPlayCarousels: true,
            showFriendSuggestions: true,
            emailNotifications: true,
            privacyMode: false,
          },
        });
        setUserStats(calculateUserStats());
        setLoading(false);
      }
    };

    initializeProfile();
  }, []);

  // Calculate user statistics based on existing data
  const calculateUserStats = () => {
    // Mock data - in real app, this would come from API
    const mockImages = Array.from({ length: 156 }, (_, i) => ({
      id: `img-${i}`,
      year: 2022 + Math.floor(i / 39),
      friends: FRIENDS_DATA.slice(0, Math.floor(Math.random() * 5) + 1).map(f => f.id),
      uploadDate: new Date(2022 + Math.floor(i / 39), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
    }));

    return {
      totalPhotos: mockImages.length,
      friendsTagged: FRIENDS_DATA.length,
      memoriesShared: mockImages.length,
      sportsAchievements: SPORTS_ACHIEVEMENTS.length,
      funnyMoments: FUNNY_MOMENTS.length,
      yearlyBreakdown: {
        2022: mockImages.filter(img => img.year === 2022).length,
        2023: mockImages.filter(img => img.year === 2023).length,
        2024: mockImages.filter(img => img.year === 2024).length,
        2025: mockImages.filter(img => img.year === 2025).length,
      },
      recentActivity: [
        { type: 'upload', count: 12, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        { type: 'tag', count: 8, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        { type: 'share', count: 5, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      ],
      topFriends: FRIENDS_DATA.slice(0, 5).map(friend => ({
        ...friend,
        photoCount: Math.floor(Math.random() * 30) + 10,
      })),
    };
  };

  const handlePreferencesUpdate = (newPreferences) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: newPreferences,
    }));
    storage.set('userPreferences', newPreferences);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: HiUser },
    { id: 'memories', name: 'My Memories', icon: HiPhotograph },
    { id: 'activity', name: 'Recent Activity', icon: HiCalendar },
    { id: 'preferences', name: 'Preferences', icon: HiCog },
  ];

  if (loading || !userProfile || !userStats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600 dark:text-gray-400 text-sm">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8"
          variants={staggerItem}
          initial="hidden"
          animate="visible"
        >
          <div className="relative h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-end space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                    <Image
                      src={userProfile.profileImage}
                      alt={userProfile.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.name)}&size=96&background=3b82f6&color=ffffff`;
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1 pb-2">
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {userProfile.name}
                  </h1>
                  <p className="text-blue-100 text-sm">
                    {userProfile.collegeName} • Class of {userProfile.graduationYear}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setShowPreferencesModal(true)}
                  className="mb-2"
                >
                  <HiCog className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {userProfile.bio}
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {userStats.totalPhotos}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Photos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {userStats.friendsTagged}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Friends</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {userStats.memoriesShared}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Memories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {userStats.sportsAchievements}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Achievements</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-8"
          variants={staggerItem}
          initial="hidden"
          animate="visible"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {activeTab === 'overview' && (
            <UserStats userStats={userStats} userProfile={userProfile} />
          )}
          
          {activeTab === 'memories' && (
            <MemoryManager userProfile={userProfile} />
          )}
          
          {activeTab === 'activity' && (
            <RecentActivity userStats={userStats} />
          )}
          
          {activeTab === 'preferences' && (
            <UserPreferences
              preferences={userProfile.preferences}
              onUpdate={handlePreferencesUpdate}
            />
          )}
        </motion.div>
      </div>

      {/* Preferences Modal */}
      <Modal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
        title="User Preferences"
        size="large"
      >
        <UserPreferences
          preferences={userProfile.preferences}
          onUpdate={(newPreferences) => {
            handlePreferencesUpdate(newPreferences);
            setShowPreferencesModal(false);
          }}
          isModal={true}
        />
      </Modal>
    </motion.div>
  );
}