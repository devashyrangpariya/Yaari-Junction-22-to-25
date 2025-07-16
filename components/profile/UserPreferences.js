'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiMoon, 
  HiSun, 
  HiDesktopComputer,
  HiPlay,
  HiPause,
  HiVolumeUp,
  HiVolumeOff,
  HiBell,
  HiBellOff,
  HiEye,
  HiEyeOff,
  HiShieldCheck,
  HiGlobe,
  HiColorSwatch,
  HiSparkles
} from 'react-icons/hi';
import { staggerContainer, staggerItem } from '../../lib/animations';
import { storage } from '../../lib/utils';
import Button from '../ui/Button';

export default function UserPreferences({ preferences, onUpdate, isModal = false }) {
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handlePreferenceChange = (key, value) => {
    const newPreferences = {
      ...localPreferences,
      [key]: value,
    };
    setLocalPreferences(newPreferences);
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(localPreferences);
    setHasChanges(false);
    
    // Apply theme immediately
    if (localPreferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (localPreferences.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Auto theme - check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleReset = () => {
    setLocalPreferences(preferences);
    setHasChanges(false);
  };

  const preferenceGroups = [
    {
      title: 'Appearance',
      icon: HiColorSwatch,
      preferences: [
        {
          key: 'theme',
          label: 'Theme',
          description: 'Choose your preferred color scheme',
          type: 'select',
          options: [
            { value: 'light', label: 'Light', icon: HiSun },
            { value: 'dark', label: 'Dark', icon: HiMoon },
            { value: 'auto', label: 'System', icon: HiDesktopComputer },
          ],
        },
      ],
    },
    {
      title: 'Animations & Effects',
      icon: HiSparkles,
      preferences: [
        {
          key: 'animationsEnabled',
          label: 'Enable Animations',
          description: 'Turn on/off smooth animations and transitions',
          type: 'toggle',
        },
        {
          key: 'autoPlayCarousels',
          label: 'Auto-play Carousels',
          description: 'Automatically advance image carousels',
          type: 'toggle',
        },
      ],
    },
    {
      title: 'Social Features',
      icon: HiGlobe,
      preferences: [
        {
          key: 'showFriendSuggestions',
          label: 'Friend Suggestions',
          description: 'Show suggested friends based on mutual connections',
          type: 'toggle',
        },
        {
          key: 'allowTagging',
          label: 'Allow Friend Tagging',
          description: 'Let friends tag you in their photos',
          type: 'toggle',
          value: localPreferences.allowTagging ?? true,
        },
      ],
    },
    {
      title: 'Notifications',
      icon: HiBell,
      preferences: [
        {
          key: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Receive email updates about new photos and activities',
          type: 'toggle',
        },
        {
          key: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Get browser notifications for important updates',
          type: 'toggle',
          value: localPreferences.pushNotifications ?? false,
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: HiShieldCheck,
      preferences: [
        {
          key: 'privacyMode',
          label: 'Privacy Mode',
          description: 'Hide your activity from other users',
          type: 'toggle',
        },
        {
          key: 'showOnlineStatus',
          label: 'Show Online Status',
          description: 'Let friends see when you\'re online',
          type: 'toggle',
          value: localPreferences.showOnlineStatus ?? true,
        },
        {
          key: 'allowDownloads',
          label: 'Allow Photo Downloads',
          description: 'Let others download your shared photos',
          type: 'toggle',
          value: localPreferences.allowDownloads ?? true,
        },
      ],
    },
  ];

  return (
    <motion.div
      className={`space-y-6 ${isModal ? '' : 'bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg'}`}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {!isModal && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              User Preferences
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Customize your experience and privacy settings
            </p>
          </div>
          
          {hasChanges && (
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={handleReset}>
                Reset
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      )}

      <motion.div
        className="space-y-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {preferenceGroups.map((group) => {
          const GroupIcon = group.icon;
          
          return (
            <motion.div
              key={group.title}
              className="space-y-4"
              variants={staggerItem}
            >
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <GroupIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {group.title}
                </h3>
              </div>
              
              <div className="space-y-4">
                {group.preferences.map((pref) => (
                  <div
                    key={pref.key}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {pref.label}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {pref.description}
                      </p>
                    </div>
                    
                    <div className="ml-4">
                      {pref.type === 'toggle' && (
                        <button
                          onClick={() => handlePreferenceChange(pref.key, !(pref.value ?? localPreferences[pref.key]))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            (pref.value ?? localPreferences[pref.key])
                              ? 'bg-blue-600'
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              (pref.value ?? localPreferences[pref.key]) ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      )}
                      
                      {pref.type === 'select' && (
                        <div className="flex space-x-2">
                          {pref.options.map((option) => {
                            const OptionIcon = option.icon;
                            const isSelected = localPreferences[pref.key] === option.value;
                            
                            return (
                              <button
                                key={option.value}
                                onClick={() => handlePreferenceChange(pref.key, option.value)}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  isSelected
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
                                }`}
                              >
                                <OptionIcon className="w-4 h-4" />
                                <span>{option.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Data Management Section */}
      <motion.div
        className="pt-6 border-t border-gray-200 dark:border-gray-700"
        variants={staggerItem}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Data Management
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Export Your Data
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              Download all your photos, memories, and profile data
            </p>
            <Button variant="outline" size="small">
              Export Data
            </Button>
          </div>
          
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <h4 className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
              Delete Account
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              Permanently delete your account and all associated data
            </p>
            <Button variant="danger" size="small">
              Delete Account
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Save Button for Modal */}
      {isModal && hasChanges && (
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      )}
    </motion.div>
  );
}