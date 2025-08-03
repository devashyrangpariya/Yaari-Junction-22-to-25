'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiSearch, HiFilter, HiUsers, HiHeart } from 'react-icons/hi';
import FriendCard from '../../components/friends/FriendCard';
import FriendModal from '../../components/friends/FriendModal';
import { FRIENDS_DATA } from '../../lib/constants';
import { containerVariants, staggerItem, staggerContainer } from '../../lib/animations';

export default function FriendsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'joinYear', 'favorites'
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'favorites'

  // Filter and sort friends
  const filteredAndSortedFriends = useMemo(() => {
    let friends = [...FRIENDS_DATA];

    // Apply search filter
    if (searchTerm) {
      friends = friends.filter(friend =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.funnyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply favorite filter (placeholder - in real app would check user's favorites)
    if (filterBy === 'favorites') {
      // For demo, we'll show all friends. In real app, filter by user's favorites
      friends = friends;
    }

    // Apply sorting
    friends.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'joinYear':
          return a.joinYear - b.joinYear;
        case 'favorites':
          // Sort by number of favorite memories
          return (b.favoriteMemories?.length || 0) - (a.favoriteMemories?.length || 0);
        default:
          return 0;
      }
    });

    return friends;
  }, [searchTerm, sortBy, filterBy]);

  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFriend(null);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our Amazing Friends
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Meet the incredible people who made our college journey unforgettable. 
              Each friend brought their unique personality and created countless memories together.
            </p>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center"
            variants={staggerItem}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <HiUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {FRIENDS_DATA.length}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Total Friends</p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center"
            variants={staggerItem}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <HiHeart className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {FRIENDS_DATA.reduce((total, friend) => total + (friend.favoriteMemories?.length || 0), 0)}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Shared Memories</p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg text-center"
            variants={staggerItem}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
              <HiUsers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {new Date().getFullYear() - 2022 + 1}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Years Together</p>
          </motion.div>
        </motion.div>


        {/* Friends Grid */}
        {filteredAndSortedFriends.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <HiSearch className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No friends found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? `No friends match "${searchTerm}". Try a different search term.`
                  : 'No friends available in this category.'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Clear search
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filteredAndSortedFriends.map((friend, index) => (
              <motion.div
                key={friend.id}
                variants={staggerItem}
                custom={index}
              >
                <FriendCard
                  friend={friend}
                  onCardClick={handleFriendClick}
                  showSocialLinks={true}
                  className="h-full"
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Friend Modal */}
        <FriendModal
          friend={selectedFriend}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}