'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { HiHeart, HiExternalLink } from 'react-icons/hi';
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa';

const socialIcons = {
  instagram: FaInstagram,
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
};

export default function FriendCard({ friend, onCardClick, showSocialLinks = true, className = '' }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(friend);
    }
  };

  const handleSocialClick = (e, url) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer touch-manipulation ${className}`}
      onClick={handleCardClick}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Profile Image */}
      <div className="relative aspect-square overflow-hidden">
        {!imageError ? (
          <Image
            src={friend.profileImage}
            alt={`${friend.name} profile`}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">
              {friend.name.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Funny name overlay */}
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-sm font-medium bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1">
            "{friend.funnyName}"
          </p>
        </div>

        {/* Heart icon for favorites */}
        <motion.button
          className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            // Handle favorite toggle
          }}
        >
          <HiHeart className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Card Content - Mobile optimized */}
      <div className="p-4 sm:p-6">
        {/* Name and Nickname */}
        <div className="mb-2 sm:mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 truncate">
            {friend.name}
          </h3>
          {friend.nickname !== friend.name && (
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              "{friend.nickname}"
            </p>
          )}
        </div>

        {/* Bio */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 sm:mb-4 line-clamp-2">
          {friend.bio}
        </p>

        {/* Join Year */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            Since {friend.joinYear}
          </span>
          
          {/* View Profile Button */}
          <motion.button
            className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium touch-manipulation min-h-8"
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            View Profile
            <HiExternalLink className="w-4 h-4 ml-1" />
          </motion.button>
        </div>

        {/* Social Links */}
        {showSocialLinks && friend.socialLinks && Object.keys(friend.socialLinks).length > 0 && (
          <div className="flex items-center space-x-2 sm:space-x-3 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">Connect:</span>
            <div className="flex space-x-1 sm:space-x-2 flex-1 justify-center sm:justify-start">
              {Object.entries(friend.socialLinks).map(([platform, url]) => {
                const IconComponent = socialIcons[platform];
                if (!IconComponent) return null;

                return (
                  <motion.button
                    key={platform}
                    className="p-2.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 touch-manipulation min-h-10 min-w-10 sm:min-h-8 sm:min-w-8"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleSocialClick(e, url)}
                    title={`${friend.name} on ${platform}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Favorite Memories Preview */}
        {friend.favoriteMemories && friend.favoriteMemories.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Favorite Memories:</p>
            <div className="flex flex-wrap gap-1">
              {friend.favoriteMemories.slice(0, 2).map((memory, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                >
                  {memory}
                </span>
              ))}
              {friend.favoriteMemories.length > 2 && (
                <span className="inline-block px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                  +{friend.favoriteMemories.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 dark:group-hover:border-blue-600 rounded-2xl transition-colors duration-300 pointer-events-none" />
    </motion.div>
  );
}