'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { HiX, HiHeart, HiCalendar, HiPhotograph, HiUsers } from 'react-icons/hi';
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa';

const socialIcons = {
  instagram: { icon: FaInstagram, color: 'text-pink-500', bgColor: 'bg-pink-50 dark:bg-pink-900/20' },
  twitter: { icon: FaTwitter, color: 'text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  linkedin: { icon: FaLinkedin, color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  facebook: { icon: FaFacebook, color: 'text-blue-700', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
};

export default function FriendModal({ friend, isOpen, onClose }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would typically save to localStorage or API
  };

  if (!friend) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-2xl transition-all">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Header */}
                  <div className="relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-10" />
                    
                    {/* Close Button */}
                    <button
                      onClick={onClose}
                      className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white/30 transition-colors duration-200"
                    >
                      <HiX className="w-6 h-6" />
                    </button>

                    {/* Profile Section */}
                    <div className="relative px-8 pt-8 pb-6">
                      <div className="flex flex-col items-center">
                        {/* Profile Image */}
                        <div className="relative w-32 h-32 mb-4">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full p-1">
                            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                              {!imageError ? (
                                <Image
                                  src={friend.profileImage}
                                  alt={`${friend.name} profile`}
                                  fill
                                  className={`object-cover transition-opacity duration-300 ${
                                    imageLoaded ? 'opacity-100' : 'opacity-0'
                                  }`}
                                  onLoad={() => setImageLoaded(true)}
                                  onError={() => setImageError(true)}
                                  sizes="128px"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                  <span className="text-white text-3xl font-bold">
                                    {friend.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                              
                              {!imageLoaded && !imageError && (
                                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Name and Funny Name */}
                        <div className="text-center mb-4">
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                            {friend.name}
                          </h2>
                          {friend.nickname !== friend.name && (
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                              "{friend.nickname}"
                            </p>
                          )}
                          <p className="text-lg font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full inline-block">
                            {friend.funnyName}
                          </p>
                        </div>

                        {/* Favorite Button */}
                        <motion.button
                          onClick={toggleFavorite}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                            isFavorite
                              ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <HiHeart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                          <span className="text-sm font-medium">
                            {isFavorite ? 'Favorited' : 'Add to Favorites'}
                          </span>
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-8 pb-8">
                    {/* Bio */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <HiUsers className="w-5 h-5 mr-2 text-blue-500" />
                        About
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {friend.bio}
                      </p>
                    </div>

                    {/* Join Year */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <HiCalendar className="w-5 h-5 mr-2 text-green-500" />
                        College Journey
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Joined in:</span> {friend.joinYear}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">
                          <span className="font-medium">Years together:</span> {new Date().getFullYear() - friend.joinYear + 1} years
                        </p>
                      </div>
                    </div>

                    {/* Favorite Memories */}
                    {friend.favoriteMemories && friend.favoriteMemories.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                          <HiPhotograph className="w-5 h-5 mr-2 text-purple-500" />
                          Favorite Memories
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {friend.favoriteMemories.map((memory, index) => (
                            <motion.div
                              key={index}
                              className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <p className="text-gray-800 dark:text-gray-200 font-medium">
                                {memory}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Social Links */}
                    {friend.socialLinks && Object.keys(friend.socialLinks).length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Connect with {friend.name}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {Object.entries(friend.socialLinks).map(([platform, url]) => {
                            const socialConfig = socialIcons[platform];
                            if (!socialConfig) return null;

                            const { icon: IconComponent, color, bgColor } = socialConfig;

                            return (
                              <motion.button
                                key={platform}
                                onClick={() => handleSocialClick(url)}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl ${bgColor} ${color} hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <IconComponent className="w-5 h-5" />
                                <span className="font-medium capitalize">
                                  {platform}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}